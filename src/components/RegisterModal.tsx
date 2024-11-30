import { useState } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAtom } from "jotai";
import { isRegisterModalOpenAtom } from "../state";

const RegisterModal = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useAtom(
    isRegisterModalOpenAtom
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  // 입력란이 모두 채워졌는지 확인
  const isFormComplete =
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    nickname.trim() !== "";

  // 모달 닫기 및 초기화
  const handleClose = () => {
    setIsRegisterModalOpen(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNickname("");
    setErrorMessage("");
  };

  // 회원가입 처리
  const handleRegister = () => {
    if (password !== confirmPassword) {
      setErrorMessage("패스워드를 재입력 해주세요."); // 오류 메시지 설정
      return;
    }
    console.log("회원가입 시도:", {
      email,
      password,
      confirmPassword,
      nickname,
    });
    setErrorMessage(""); // 오류 메시지 초기화
  };

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* 패스워드 입력 */}
        <TextField
          label="패스워드 입력"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* 패스워드 재입력 */}
        <TextField
          label="패스워드 재입력"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* 닉네임 입력 */}
        <TextField
          label="별명 입력"
          variant="outlined"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
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
