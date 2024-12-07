import { useEffect, useState } from "react";
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
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  ModalOpenState,
  modalOpenStateAtom,
  TaskEzLoginStateAtom,
} from "../state"; // serverInfoAtom, TaskEzLoginStateAtom 불러오기
import axios from "axios";
import { SERVER_HOST } from "../utils";

const LoginModal = () => {
  const [modalOpenState, setModalOpenState] = useAtom(modalOpenStateAtom); // 모달 열림 상태

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 패스워드 보이기 여부

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  const setLoginState = useSetAtom(TaskEzLoginStateAtom); // useSetAtom 불러오기
  const [, setIsLoading] = useState(false); // 로그인 로딩 상태 추가

  // 모달창 변경시 입력값 초기화
  useEffect(() => {
    if (
      modalOpenState === ModalOpenState.LOGIN ||
      modalOpenState === ModalOpenState.NONE
    ) {
      setId("");
      setPassword("");
      setErrorMessage("");
    }
  }, [modalOpenState]);

  //일반 로그인 기능 시작
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!id || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setIsLoading(true); // 로딩 상태 활성화

    // 서버에 로그인 요청
    axios
      .post(`${SERVER_HOST}/api/login`, {
        id: id,
        password: password,
      })
      .then((response) => {
        const { nickname, userId } = response.data;

        alert(`[ ${nickname} ]님 로그인에 성공했습니다!`); // 로그인 성공 메시지

        // 로그인 상태 업데이트
        const TaskEzloginState = {
          isLoggedIn: true,
          userId: userId,
        };

        setLoginState(TaskEzloginState); // Jotai 상태 업데이트
        localStorage.setItem(
          "TaskEzloginState",
          JSON.stringify(TaskEzloginState)
        ); // LocalStorage에 저장
        setModalOpenState(ModalOpenState.NONE); // 성공 후 로그인 모달 닫기
      })
      .catch((error) => {
        if (error.response) {
          console.error("서버 오류:", error.response.data.message);
          alert(error.response.data.message || "로그인 실패");
        } else {
          console.error("요청 오류:", error.message);
          alert("예기치 않은 오류가 발생했습니다. 나중에 다시 시도해 주세요.");
        }

        setPassword(""); // 로그인 실패 시 비밀번호 초기화
      })
      .finally(() => {
        setIsLoading(false); // 로딩 상태 비활성화
      });
  }; //일반 로그인 기능 끝

  return (
    <Dialog
      open={modalOpenState === ModalOpenState.LOGIN}
      onClose={() => setModalOpenState(ModalOpenState.NONE)}
      maxWidth="xs"
      fullWidth
      sx={{
        backdropFilter: "blur(3.5px)", // 가우시안 블러 효과
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
          <IconButton onClick={() => setModalOpenState(ModalOpenState.NONE)}>
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
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
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
            onClick={() => setModalOpenState(ModalOpenState.REGISTER)}
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
