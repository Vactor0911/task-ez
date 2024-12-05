import {
  Box,
  Button,
  Dialog,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { ModalOpenState, modalOpenStateAtom } from "../state";
import { useAtom } from "jotai";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useCallback, useEffect, useRef, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const RegisterModal = () => {
  const [modalOpenState, setModalOpenState] = useAtom(modalOpenStateAtom);

  // 입력 값
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");

  // 입력란 객체
  const refId = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);
  const refPasswordConfirm = useRef<HTMLInputElement>(null);
  const refName = useRef<HTMLInputElement>(null);

  // 대화상자 변경시 입력값 초기화
  useEffect(() => {
    if (
      modalOpenState === ModalOpenState.REGISTER ||
      modalOpenState === ModalOpenState.NONE
    ) {
      setId("");
      setPassword("");
      setPasswordConfirm("");
      setName("");
    }
  }, [modalOpenState]);

  // 비밀번호 보이기 여부
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  // 로그인 버튼 클릭
  const handleLoginButtonClick = useCallback(
    (e: any) => {
      e.preventDefault();

      // 아이디 검증
      if (!id) {
        alert("아이디를 입력해 주세요.");
        refId.current?.focus();
        return;
      }

      // 비밀번호 검증
      if (!password) {
        alert("비밀번호를 입력해 주세요.");
        refPassword.current?.focus();
        return;
      }

      // 비밀번호 확인 검증
      if (!passwordConfirm) {
        alert("비밀번호 확인을 입력해 주세요.");
        refPasswordConfirm.current?.focus();
        return;
      } else if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        refPasswordConfirm.current?.focus();
        return;
      }
      
      // 별명 검증
      if (!name) {
        alert("별명을 입력해 주세요.");
        refName.current?.focus();
        return;
      }

      // 회원가입 요청
      //TODO: 회원가입 요청
    },
    [id, password, passwordConfirm, name]
  );

  return (
    <Dialog
      open={modalOpenState === ModalOpenState.REGISTER}
      onClose={() => setModalOpenState(ModalOpenState.NONE)}
      maxWidth="xs"
      fullWidth
      sx={{
        backdropFilter: "blur(3.5px)", // 가우시안 블러 효과
      }}
    >
      <Box padding={3}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "25px" }}
          >
            회원가입
          </Typography>
          <IconButton onClick={() => setModalOpenState(ModalOpenState.NONE)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid2 container direction="column" spacing={2} mt={3}>
          {/* 아이디 입력 */}
          <TextField
            inputRef={refId}
            variant="outlined"
            label="아이디"
            required
            fullWidth
            onChange={(e) => setId(e.target.value)}
          />

          {/* 비밀번호 입력 */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>비밀번호 *</InputLabel>
            <OutlinedInput
              inputRef={refPassword}
              required
              label="비밀번호"
              fullWidth
              type={isPasswordVisible ? "text" : "password"}
              endAdornment={
                <IconButton
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {/* 비밀번호 입력 */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>비밀번호 확인 *</InputLabel>
            <OutlinedInput
              inputRef={refPasswordConfirm}
              required
              label="비밀번호 확인"
              fullWidth
              type={isPasswordConfirmVisible ? "text" : "password"}
              endAdornment={
                <IconButton
                  onClick={() =>
                    setIsPasswordConfirmVisible(!isPasswordConfirmVisible)
                  }
                >
                  {isPasswordConfirmVisible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              }
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </FormControl>

          {/* 별명 입력 */}
          <TextField
            inputRef={refName}
            variant="outlined"
            label="별명"
            required
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />

          {/* 로그인 대화상자 이동 버튼 */}
          <Button
            variant="text"
            sx={{ color: grey[700], fontWeight: "bold", alignSelf: "flex-end" }}
            onClick={() => setModalOpenState(ModalOpenState.LOGIN)}
          >
            로그인
          </Button>

          {/* 회원가입 버튼 */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginButtonClick}
          >
            회원가입
          </Button>
        </Grid2>
      </Box>
    </Dialog>
  );
};

export default RegisterModal;
