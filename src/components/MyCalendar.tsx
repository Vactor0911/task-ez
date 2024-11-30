import styled from "@emotion/styled";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendarToolbar from "./MyCalendarToolbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { selectedDateAtom } from "../state";
import { Box, Collapse, Paper, Popper } from "@mui/material";

const StyledCalendar = styled(Calendar)`
  width: 95%;
  height: 100vh;

  .rbc-day-bg:hover {
    background-color: #f0f0f0;
  }

  .rbc-row-segment {
    display: flex;
    justify-content: center;
  }
`;

const MyCalendar = () => {
  // 시간 날짜 형식을 한국어로 설정
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

  // 더보기 버튼 클릭시 표시할 숨겨진 이벤트 목록
  const [hiddenEvents, setHiddenEvents] = useState<any[]>([]);
  const [isShowMoreOpened, setIsShowMoreOpened] = useState(false);
  const [isShowMoreOpenedDelayed, setIsShowMoreOpenedDelayed] = useState(false);
  const anchorElem = useRef<HTMLButtonElement | null>(null);

  // 더보기 팝업 닫힘 여부 지연 처리
  useEffect(() => {
    if (isShowMoreOpened) {
      setIsShowMoreOpenedDelayed(isShowMoreOpened);
      return;
    }

    setTimeout(() => {
      setIsShowMoreOpenedDelayed(isShowMoreOpened);
    }, 300);
  }, [isShowMoreOpened]);

  // 이벤트 더보기 외부 클릭시 팝업 닫기
  const refCollapse = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refCollapse.current &&
        !refCollapse.current.contains(event.target as Node) &&
        event.target !== anchorElem.current
      ) {
        setIsShowMoreOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refCollapse]);

  // 캘린더에 표시할 테스트용 이벤트
  const events = [
    {
      title: "작업1",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 0,
      color: "red",
    },
    {
      title:
        "엄청나게 긴 이벤트 제목을 가진 작업3. 제목을 늘리기 위해 뭘 적는게 좋을지 고민중. 아무튼 이름이 엄청 긴 이벤트의 제목임. 여기서 제목이 더 길어지면 어떻게 되는지 보기 위해 이렇게 길게 작성함.",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 2,
      color: "blue",
    },
    {
      title: "작업4",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 19),
      id: 3,
      color: "orange",
    },
    {
      title: "작업5",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 19),
      id: 4,
      color: "red",
    },
    {
      title: "작업6",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 5,
      color: "red",
    },
    {
      title: "작업2",
      start: new Date(2024, 10, 19),
      end: new Date(2024, 11, 21),
      id: 1,
      color: "green",
    },
  ];

  // 캘린더 슬롯 선택 이벤트 처리
  const handleSelectSlot = useCallback(
    (event: any) => {
      // 더보기 팝업이 열려있으면 이벤트 처리 중지
      if (isShowMoreOpenedDelayed) {
        return;
      }

      console.log("Selected Slot! ", event);
    },
    [isShowMoreOpenedDelayed]
  );

  // 캘린더 이벤트 선택 이벤트 처리
  const handleSelectEvent = (event: any, hidden: boolean = false) => {
    // 더보기 팝업이 열려있으면 이벤트 처리 중지
    if (isShowMoreOpenedDelayed && !hidden) {
      return;
    }

    console.log("Selected Event! ", event);
  };

  return (
    <>
      <StyledCalendar
        localizer={localizer} // 언어 설정
        views={["month"]}
        events={events} // 표시할 이벤트 목록
        selectable
        date={selectedDate.toDate()}
        components={{ toolbar: MyCalendarToolbar }} // 툴바 컴포넌트
        onSelectSlot={handleSelectSlot} // 슬롯 클릭 이벤트
        onSelectEvent={(event) => handleSelectEvent(event)} // 이벤트 클릭 이벤트
        eventPropGetter={(event: any) => {
          // 이벤트 요소 스타일 설정
          return {
            style: {
              backgroundColor: event.color,
            },
          };
        }}
        onNavigate={(date) => {
          // 날짜 변경 이벤트
          setSelectedDate(dayjs(date));
        }}
        onShowMore={(events) => {
          // 더보기 클릭 이벤트

          // 클릭된 더보기 버튼 요소 저장
          anchorElem.current = event?.target as HTMLButtonElement;

          // 화면에 이미 출력중인 이벤트 제목 가져오기
          const showingEvents = document.querySelectorAll(".rbc-event-content");
          const showingEventNames = [] as string[];
          showingEvents.forEach((event) => {
            if (event.textContent) {
              showingEventNames.push(event.textContent);
            }
          });

          // 화면에 안보이는 이벤트 제목 가져오기
          const newHiddenEvents = events.filter(
            (event: any) => !showingEventNames.includes(event.title)
          );
          setHiddenEvents(newHiddenEvents); // 화면에 안보이는 이벤트 목록 저장
          setIsShowMoreOpened(!isShowMoreOpened); // 더보기 팝업 열기
        }}
      />
      <Popper
        open={true}
        placement="bottom-start"
        anchorEl={anchorElem?.current}
        sx={{
          zIndex: 10,
        }}
      >
        <Collapse in={isShowMoreOpened} ref={refCollapse}>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "5px 10px",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            {hiddenEvents.map((event, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: event.color,
                    padding: "5px",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                    width: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onClick={() => handleSelectEvent(event, true)}
                >
                  {event.title}
                </Box>
              );
            })}
          </Paper>
        </Collapse>
      </Popper>
    </>
  );
};

export default MyCalendar;
