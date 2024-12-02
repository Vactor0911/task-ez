import { useState } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAtom, useAtomValue } from "jotai";
import { isLoginModalOpenAtom, isRegisterModalOpenAtom, serverInfoAtom } from "../state";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const RegisterModal = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useAtom(
    isRegisterModalOpenAtom
  );
  const [, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);  // 패스워드 보이기 여부
  const [isconfirmPasswordVisible, setIsconfirmPasswordVisible] = useState(false);  // 패스워드 재입력 보이기 여부

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const serverInfo = useAtomValue(serverInfoAtom); // useAtomValue 불러오기
  const HOST = serverInfo.HOST; // HOST 불러오기
  const PORT = serverInfo.PORT; // PORT 불러오기


  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  // 입력란이 모두 채워졌는지 확인
  const isFormComplete =
    id.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    name.trim() !== "";

  // 모달 닫기 및 초기화
  const handleClose = () => {
    setIsRegisterModalOpen(false);
    setId("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setErrorMessage("");
  };

   // 로그인 모달로 이동
   const handleLoginClick = () => {
    handleClose();
    setIsLoginModalOpen(true);
  };

  // 회원가입 처리
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전송 전 입력값 검증
    if (!id || !password || !confirmPassword) {
        console.error('이메일 또는 비밀번호가 비어있으면 안됩니다.');
        alert("이메일 또는 비밀번호가 비어있으면 안됩니다.");
        return;
    }

    if (!name) {
      console.error('닉네임을 입력해주세요.');
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log('id과 비밀번호로 회원가입 요청을 보냅니다:', { id, password });

    // 서버로 회원가입 요청 전송
    axios
    .post(`${HOST}:${PORT}/api/register`, {
      id: id,
      password: password,
      name: name,
    })
    .then((response) => {
      // 서버로부터 성공 메시지를 받은 경우
      console.log("회원가입 성공:", response.data.message);

      // 사용자에게 성공 메시지 보여주기 (UI 반영)
      alert("회원가입이 성공적으로 완료되었습니다!");

      handleLoginClick(); // 로그인 모달로 이동
    })
    .catch((error) => {
      // 서버로부터 반환된 에러 메시지 확인
      if (error.response) {
        console.error("서버가 오류를 반환했습니다:", error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("요청을 보내는 중 오류가 발생했습니다:", error.message);
        alert("예기치 않은 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
      }
    });

  };  //회원가입 끝

  return (
    <Dialog
      open={isRegisterModalOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      BackdropProps={{
        style: {
          backdropFilter: "blur(3.5px)", // 가우시안 블러 효과
          backgroundColor: "rgba(0, 0, 0, 0.3)", // 약간의 어두운 투명도 추가
        },
      }}
    >
      <Box sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "25px" }}
          >
            회원가입
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 이메일 입력 */}
        <TextField
          label="이메일 입력"
          variant="outlined"
          value={id}
          onChange={(e) => setId(e.target.value)}
          fullWidth
          margin="normal"
        />

         {/* 패스워드 입력 */}
         <FormControl sx={{ marginTop: "20px" }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            패스워드 입력
          </InputLabel>
          <OutlinedInput
            fullWidth
            id="outlined-adornment-password"
            margin="dense"
            label="패스워드 입력"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setIsPasswordVisible(!isPasswordVisible);
                  }}
                >
                  {isPasswordVisible ? (
                    <VisibilityIcon sx={{ color: "black" }} />
                  ) : (
                    <VisibilityOffIcon sx={{ color: "black" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {/* 패스워드 재입력 */}
        <FormControl sx={{ marginTop: "20px" }} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            패스워드 재입력
          </InputLabel>
          <OutlinedInput
            fullWidth
            id="outlined-adornment-password"
            margin="dense"
            label="패스워드 재입력"
            type={isconfirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setIsconfirmPasswordVisible(!isconfirmPasswordVisible);
                  }}
                >
                  {isconfirmPasswordVisible ? (
                    <VisibilityIcon sx={{ color: "black" }} />
                  ) : (
                    <VisibilityOffIcon sx={{ color: "black" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {/* 닉네임 입력 */}
        <TextField
          label="별명 입력"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* 오류 메시지 */}
        {errorMessage && (
          <Typography sx={{ color: "red", mt: 1, fontSize: "1em" }}>
            {errorMessage}
          </Typography>
        )}

        {/* 버튼들 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={!isFormComplete} // 모든 필드가 입력되지 않으면 비활성화
            sx={{
              backgroundColor: isFormComplete ? "#1976d2" : "#bdbdbd",
              color: "#fff",
            }}
          >
            회원가입
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RegisterModal;
