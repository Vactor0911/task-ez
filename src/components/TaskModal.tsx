import { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { color } from "../utils/theme";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { eventsAtom, isModalOpenedAtom, taskDataAtom } from "../state";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TaskModal = () => {
  const [events, setEvents] = useAtom(eventsAtom); // 이벤트 목록
  const taskData = useAtomValue(taskDataAtom); // 작업 데이터
  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom); // 모달 열림 여부

  const [title, setTitle] = useState(""); // 제목
  const [currentColor, setCurrentColor] = useState(""); // 색상
  const [description, setDescription] = useState(""); // 설명
  const [startDate, setStartDate] = useState(null as dayjs.Dayjs | null); // 시작 날짜
  const [endDate, setEndDate] = useState(null as dayjs.Dayjs | null); // 종료 날짜

  // 삭제 버튼 클릭
  const handleDeleteButtonClicked = useCallback(() => {}, []);

  // 저장 버튼 클릭
  const handleSaveButtonClicked = useCallback(() => {
    if (!taskData || !title || !startDate || !endDate) {
      return;
    } // 데이터가 없으면 중지

    setEvents(
      events.map((event) =>
        event.id === taskData.id
          ? {
              ...event,
              title: title,
              color: currentColor,
              description: description,
              start: startDate.toDate(),
              end: endDate.add(1, "day").toDate(),
            }
          : event
      )
    )
  }, [title, currentColor, description, startDate, endDate]);

  return (
    <Dialog
      open={isModalOpened}
      onClose={() => setIsModalOpened(false)}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ padding: 2 }}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">일정 관리</Typography>

          {/* 닫기 버튼 */}
          <IconButton onClick={() => setIsModalOpened(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 날짜 필드 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="시작 날짜"
              value={startDate}
              format="YYYY-MM-DD"
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="종료 날짜"
              value={endDate}
              format="YYYY-MM-DD"
              onChange={(newValue) => setEndDate(newValue)}
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
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
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

        {/* 버튼 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          {true && ( //TODO: 수정 모드일 때만 삭제 버튼 표시
            <Button
              variant="outlined"
              color="error"
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
      </Box>
    </Dialog>
  );
};

export default TaskModal;
