import styled from "@emotion/styled"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendarToolbar from "./MyCalendarToolbar";
import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { selectedDateAtom } from "../state";

const StyledCalendar = styled(Calendar)`
  .rbc-day-bg:hover {
    background-color: #f0f0f0;
  }

  .rbc-button-link:not(.rbc-show-more) {
    pointer-events: none;
  }
`;

const MyCalendar = () => {
  // 시간 날짜 형식을 한국어로 설정
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

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
      title: "작업3",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 2,
      color: "red",
    },
    {
      title: "작업4",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 3,
      color: "red",
    },
    {
      title: "작업5",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
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
      end: new Date(2024, 12, 21),
      id: 1,
      color: "green",
    },
  ];

  // 캘린더 슬롯 선택 이벤트 처리
  const handleSelectSlot = useCallback((event) => {
    console.log("Selected Slot! ", event);
  }, [])

  // 캘린더 이벤트 선택 이벤트 처리
  const handleSelectEvent = useCallback((event) => {
    console.log("Selected Event! ", event);
  }, [])

  return (
    <StyledCalendar
      localizer={localizer} // 언어 설정
      events={events} // 표시할 이벤트 목록
      selectable
      date={selectedDate.toDate()}
      components={{ toolbar: MyCalendarToolbar }} // 툴바 컴포넌트
      onSelectSlot={handleSelectSlot} // 슬롯 선택 이벤트
      onSelectEvent={handleSelectEvent} // 이벤트 선택 이벤트
      eventPropGetter={(event) => {
        return {
          style: {
            backgroundColor: event.color,
          },
        }
      }}
      onNavigate={(date) => {
        setSelectedDate(dayjs(date));
      }} // 날짜 변경 이벤트
      style={{
        width: "95%",
        height: "100vh",
      }}
    />
  );
};

export default MyCalendar;
