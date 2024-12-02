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
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAtom } from "jotai";
import { isLoginModalOpenAtom, isRegisterModalOpenAtom } from "../state";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);
  const [, setIsRegisterModalOpen] = useAtom(isRegisterModalOpenAtom);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 패스워드 보이기 여부

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  // 모달 닫기 및 초기화
  const handleClose = () => {
    setIsLoginModalOpen(false);
    setId("");
    setPassword("");
    setErrorMessage(""); // 오류 메시지 초기화
  };

  // 회원가입 버튼 클릭
  const handleRegisterClick = () => {
    handleClose();
    setIsRegisterModalOpen(true);
  };

  // 로그인 처리
  const handleLogin = () => {
    if (!id || !password) {
      setErrorMessage("아이디와 패스워드를 입력해주세요.");
      return;
    }

    // 서버 요청 예제 (실제 로직 추가 가능)
    const isValid = id === "test@example.com" && password === "password";
    if (!isValid) {
      setErrorMessage("로그인 정보를 확인해주세요.");
      return;
    }

    console.log("로그인 성공!");
    setErrorMessage(""); // 오류 메시지 초기화
    handleClose(); // 모달 닫기
  };

  return (
    <Dialog
      open={isLoginModalOpen}
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
            로그인
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 아이디 입력 */}
        <TextField
          label="아이디 입력"
          variant="outlined"
          value={id}
          onChange={(e) => setId(e.target.value)}
          fullWidth
          margin="dense"
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // 좌우 배치
            alignItems: "center",
            mt: 1,
            pr: 1,
          }}
        >
          {/* 오류 메시지 */}
          <Box sx={{ flexGrow: 1, textAlign: "left" }}>
            {errorMessage && (
              <Typography
                sx={{
                  color: "red",
                  fontSize: "1em",
                }}
              >
                {errorMessage}
              </Typography>
            )}
          </Box>

          {/* 회원가입 버튼 */}
          <Button
            variant="text"
            onClick={handleRegisterClick}
            sx={{
              textTransform: "none",
              fontSize: "0.9rem",
              color: "black",
              padding: 0,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: "transparent", // hover 효과 제거
              },
            }}
          >
            회원가입
          </Button>
        </Box>

        {/* 로그인 버튼 */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3.5, fontWeight: "bold" }}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoginModal;
