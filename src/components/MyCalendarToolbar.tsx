import styled from "@emotion/styled";
import { Button, Collapse, IconButton, Paper, Popper } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useRef, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useAtom } from "jotai";
import { selectedDateAtom } from "../state";

// 아이콘
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { MAX_DATE, MIN_DATE } from "../utils";

const Style = styled.div`
  .rbc-toolbar {
    display: flex;
    justify-content: center;
    margin: 0;
  }

  .rbc-toolbar button {
    display: flex;
    border: none;
    border-radius: 50px;
    padding: 5px;
    margin: 10px;
  }

  .rbc-toolbar button svg {
    width: 1.5em;
    height: 1.5em;
  }

  .rbc-toolbar .rbc-toolbar-label {
    flex-grow: 0;
  }
`;

const MyCalendarToolbar = () => {
  const [isDataCalendarOpen, setIsDataCalendarOpen] = useState(false); // 달력 선택기 열림 여부
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom); // 선택된 날짜
  const anchorElem = useRef<HTMLButtonElement>(null); // 달력 선택기 버튼 요소

  // 달력 선택기 외부 클릭 시 달력 선택기 닫기
  const refCollapse = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refCollapse.current && !refCollapse.current.contains(event.target as Node) && event.target !== anchorElem.current) {
        setIsDataCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refCollapse]);

  return (
    <Style>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <IconButton
            onClick={() => {
                if (selectedDate <= MIN_DATE) {
                  return;
                }
                setSelectedDate(selectedDate.add(-1, "month"));
              }}
          >
            <PlayArrowRoundedIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </span>
        <span className="rbc-toolbar-label">
          <Button
            ref={anchorElem}
            onClick={() => {
              setIsDataCalendarOpen(!isDataCalendarOpen);
            }}
            sx={{
                fontWeight: "bold",
                fontSize: "1.5em",
            }}
          >
            {selectedDate.format("YYYY년 MM월")}
          </Button>
          <Popper
            open={true}
            placement="bottom"
            anchorEl={anchorElem?.current}
            sx={{
              zIndex: 10,
            }}
          >
            <Collapse in={isDataCalendarOpen} ref={refCollapse}>
              <Paper
                elevation={3}
                sx={{
                  marginTop: "10px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    defaultValue={selectedDate}
                    views={["year", "month"]}
                    openTo="month"
                    minDate={MIN_DATE}
                    maxDate={MAX_DATE}
                    value={selectedDate}
                    onChange={(date) => {
                      setIsDataCalendarOpen(
                        date?.month() === selectedDate.month()
                      );
                      setSelectedDate(date);
                    }}
                    sx={{
                      height: "auto",
                      paddingBottom: "10px",
                    }}
                  />
                </LocalizationProvider>
              </Paper>
            </Collapse>
          </Popper>
        </span>
        <span className="rbc-btn-group">
          <IconButton
            onClick={() => {
              if (selectedDate >= MAX_DATE.add(-1, "month")) {
                return;
              }
              setSelectedDate(selectedDate.add(1, "month"));
            }}
          >
            <PlayArrowRoundedIcon />
          </IconButton>
        </span>
      </div>
    </Style>
  );
};

export default MyCalendarToolbar;
