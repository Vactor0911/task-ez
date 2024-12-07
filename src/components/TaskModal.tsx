import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  Typography,
  IconButton,
  Grid2,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { color } from "../utils/theme";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import {
  eventsAtom,
  isModalOpenedAtom,
  TaskEzLoginStateAtom,
  taskModalDataAtom,
} from "../state"; // serverInfoAtom - API 통신을 위한 서버 정보
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MAX_DATE, MIN_DATE, SERVER_HOST, toKstISOString } from "../utils";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import axios from "axios"; // Axios 추가 : 백엔드 통신을 위한 라이브러리 - API 통신을 위한 서버 정보

const TaskModal = () => {
  const [events, setEvents] = useAtom(eventsAtom); // 이벤트 목록
  const taskModalData = useAtomValue(taskModalDataAtom); // 작업 데이터
  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom); // 모달 열림 여부
  const TaskEzLoginState = useAtomValue(TaskEzLoginStateAtom); // 사용자 로그인 상태 정보

  const [title, setTitle] = useState(""); // 제목
  const [currentColor, setCurrentColor] = useState(""); // 색상
  const [description, setDescription] = useState(""); // 설명
  const [startDate, setStartDate] = useState(dayjs()); // 시작 날짜
  const [endDate, setEndDate] = useState(dayjs()); // 종료 날짜

  // 작업 모달 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    if (taskModalData) {
      setTitle(taskModalData.title);
      setCurrentColor(taskModalData.color);
      setDescription(taskModalData.description);
      setStartDate(dayjs(taskModalData.start));
      setEndDate(dayjs(taskModalData.end));
    }
  }, [taskModalData]);

  // 저장 버튼 클릭
  const handleSaveButtonClicked = useCallback(() => {
    if (!title || !startDate || !endDate) {
      // 필수 데이터가 없으면 중지
      alert("필수 입력값이 누락되었습니다.");
      return;
    }

    // 백엔드 API로 보낼 작업 데이터 구성
    const taskData = {
      id: taskModalData?.id ?? null, // 고유 ID (새 작업의 경우 null로 전송)
      user_id: TaskEzLoginState.userId, // 사용자 ID (임시값)
      title,
      description: description || "",
      start: toKstISOString(startDate),
      end: toKstISOString(endDate),
      color: currentColor || "#3174ad",
    };

    axios
      .post(`${SERVER_HOST}/api/save-task`, taskData)
      .then((response) => {
        if (response.data.success) {
          // 프론트엔드 상태 업데이트
          setEvents((prevEvents) => {
            if (!taskModalData?.id) {
              // 새 작업 추가 (백엔드에서 반환된 ID 사용)
              return [
                ...prevEvents,
                {
                  id: response.data.task_id, // 백엔드에서 반환된 고유 ID
                  title: title,
                  description: description,
                  start: new Date(taskData.start), // 문자열을 Date 객체로 변환
                  end: new Date(taskData.end), // 문자열을 Date 객체로 변환
                  color: currentColor,
                },
              ];
            } else {
              // 기존 작업 업데이트
              return prevEvents.map((event) =>
                event.id === taskModalData?.id
                  ? {
                      ...event,
                      ...taskData,
                      start: new Date(taskData.start), // 문자열을 Date 객체로 변환
                      end: new Date(taskData.end), // 문자열을 Date 객체로 변환
                    }
                  : event
              );
            }
          });
        } else {
          console.error("작업 저장 실패:", response.data.message);
          alert("작업 저장에 실패했습니다: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("작업 저장 중 오류 발생:", error);
        alert("작업 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      });

    setIsModalOpened(false); // 모달 닫기
  }, [
    title,
    startDate,
    endDate,
    currentColor,
    description,
    taskModalData,
    events,
  ]);
  // 저장 버튼 클릭 끝

  // 삭제 버튼 클릭
  const handleDeleteButtonClicked = useCallback(() => {
    if (!taskModalData || taskModalData?.id === null) {
      return;
    } // 데이터가 없으면 중지

    // 백엔드 API로 보낼 작업 데이터 구성
    const taskData = {
      taskId: taskModalData.id,
    };

    // 백엔드 API로 삭제 요청
    axios.post(`${SERVER_HOST}/api/delete-task`, taskData).then((response) => {
      if (response.data.success) {
        // 프론트엔드 상태 업데이트
        setEvents(events.filter((event) => event.id !== taskModalData.id));
        setIsModalOpened(false);
      } else {
        console.error("작업 삭제 실패:", response.data.message);
        alert("작업 삭제에 실패했습니다: " + response.data.message);
      }
    });
  }, [taskModalData]);

  return (
    <Dialog
      open={isModalOpened}
      onClose={() => setIsModalOpened(false)}
      maxWidth="sm"
      fullWidth
    >
      <Grid2 container direction="column" spacing={2} m={3}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">일정 관리</Typography>

          {/* 닫기 버튼 */}
          <IconButton onClick={() => setIsModalOpened(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 구분선 */}
        <Divider
          sx={{
            mb: 1,
          }}
        />

        {/* 날짜 필드 */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* 시작 날짜 */}
            <DatePicker
              label="시작 날짜"
              value={startDate}
              format="YYYY-MM-DD"
              views={["year", "month", "day"]}
              onChange={(newValue) => {
                const newStartDate = newValue || dayjs();
                setStartDate(newStartDate);

                // 종료일 이후 선택시 종료일 날짜 변경
                if (endDate.isBefore(newStartDate)) {
                  setEndDate(newStartDate);
                }
              }}
              minDate={MIN_DATE}
              maxDate={MAX_DATE}
            />
            {/* 종료 날짜 */}
            <DatePicker
              label="종료 날짜"
              value={endDate}
              format="YYYY-MM-DD"
              views={["year", "month", "day"]}
              onChange={(newValue) => setEndDate(newValue || dayjs())}
              minDate={MIN_DATE.isBefore(startDate) ? startDate : MIN_DATE}
              maxDate={MAX_DATE}
            />
          </LocalizationProvider>
        </Box>

        {/* 제목 필드 */}
        <TextField
          label="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="dense"
        />

        {/* 색상 선택 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 2 }}>색상:</Typography>
          {Object.values(color).map((col) => (
            <Box
              key={col}
              onClick={() => setCurrentColor(col)}
              sx={{
                backgroundColor: col,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border:
                  currentColor === col ? "2px solid black" : "1px solid gray",
                cursor: "pointer",
                mr: 1,
              }}
            />
          ))}
        </Box>

        {/* 설명 필드 */}
        <TextField
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />

        {/* 작업 완료 버튼 */}
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckRoundedIcon />}
          disabled={taskModalData?.id === null} // 새 작업일 때 비활성화
          sx={{
            alignSelf: "flex-end",
            mb: 2,
          }}
          onClick={handleDeleteButtonClicked}
        >
          작업 완료
        </Button>

        {/* 버튼 */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {true && ( //TODO: 수정 모드일 때만 삭제 버튼 표시
            <Button
              variant="outlined"
              color="error"
              disabled={taskModalData?.id === null}
              onClick={handleDeleteButtonClicked}
            >
              삭제
            </Button>
          )}
          <Box>
            <Button onClick={() => setIsModalOpened(false)} sx={{ mr: 2 }}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveButtonClicked}
              disabled={!title} // 제목이 없으면 비활성화
            >
              저장
            </Button>
          </Box>
        </Box>
      </Grid2>
    </Dialog>
  );
};

export default TaskModal;
