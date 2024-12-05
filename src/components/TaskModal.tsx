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
import { eventsAtom, isModalOpenedAtom, taskModalDataAtom } from "../state";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MAX_DATE, MIN_DATE } from "../utils";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const TaskModal = () => {
  const [events, setEvents] = useAtom(eventsAtom); // 이벤트 목록
  const taskModalData = useAtomValue(taskModalDataAtom); // 작업 데이터
  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom); // 모달 열림 여부

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
      setEndDate(dayjs(taskModalData.end).add(-1, "day"));
    }
  }, [taskModalData]);

  // 저장 버튼 클릭
  const handleSaveButtonClicked = useCallback(() => {
    if (!taskModalData || !title || !startDate || !endDate) {
      // 데이터가 없으면 중지
      return;
    }

    if (taskModalData.id === -1) {
      // 새 작업 추가
      setEvents([
        ...events,
        {
          id: events.length,
          title: title,
          color: currentColor,
          description: description,
          start: startDate.toDate(),
          end: endDate.add(1, "day").toDate(),
        },
      ]);
    } else {
      // 기존 작업 편집
      setEvents(
        events.map((event) =>
          event.id === taskModalData.id
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
      );
    }
    setIsModalOpened(false);
  }, [events, title, currentColor, description, startDate, endDate]);

  // 삭제 버튼 클릭
  const handleDeleteButtonClicked = useCallback(() => {
    if (!taskModalData || taskModalData.id === -1) {
      return;
    } // 데이터가 없으면 중지

    setEvents(events.filter((event) => event.id !== taskModalData.id));
    setIsModalOpened(false);
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
        <Divider sx={{
          mb: 1,
        }} />

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
          disabled={taskModalData?.id === -1} // 새 작업일 때 비활성화
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
              disabled={taskModalData?.id === -1}
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
