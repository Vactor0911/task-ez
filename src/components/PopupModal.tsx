import { useState, useEffect } from "react";
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

const PopupModal = ({ open, onClose, onSave, onDelete, defaultData }) => {
  const [title, setTitle] = useState(""); // 제목
  const [currentColor, setCurrentColor] = useState(""); // 색상
  const [description, setDescription] = useState(""); // 설명
  const [startDate, setStartDate] = useState(""); // 시작 날짜
  const [endDate, setEndDate] = useState(""); // 종료 날짜

  // 기본 데이터가 변경될 때마다 필드 업데이트
  useEffect(() => {
    setTitle(defaultData?.title || ""); // 제목 설정
    setCurrentColor(defaultData?.color || color.red); // 색상 설정
    setDescription(defaultData?.description || ""); // 설명 설정
    setStartDate(defaultData?.start || ""); // 시작 날짜 설정
    setEndDate(defaultData?.end || ""); // 종료 날짜 설정
  }, [defaultData]);

  // 저장 버튼 클릭
  const handleSave = () => {
    if (!title) return; // 제목이 없으면 저장하지 않음
    onSave({
      title,
      color: currentColor,
      description,
      start: startDate,
      end: endDate,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ padding: 2 }}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">일정 관리</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 날짜 필드 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            label="시작 날짜"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, mr: 1 }}
          />
          <TextField
            label="종료 날짜"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, ml: 1 }}
          />
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
          {defaultData?.id !== undefined && (
            <Button variant="outlined" color="error" onClick={onDelete}>
              삭제
            </Button>
          )}
          <Box>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
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

export default PopupModal;
