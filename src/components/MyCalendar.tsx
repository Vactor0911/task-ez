import styled from "@emotion/styled";
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
      end: new Date(2024, 10, 19),
      id: 3,
      color: "red",
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
      end: new Date(2024, 12, 21),
      id: 1,
      color: "green",
    },
  ];

  // 캘린더 슬롯 선택 이벤트 처리
  const handleSelectSlot = useCallback((event) => {
    console.log("Selected Slot! ", event);
  }, []);

  // 캘린더 이벤트 선택 이벤트 처리
  const handleSelectEvent = useCallback((event) => {
    console.log("Selected Event! ", event);
  }, []);

  return (
    <StyledCalendar
      localizer={localizer} // 언어 설정
      events={events} // 표시할 이벤트 목록
      selectable
      date={selectedDate.toDate()}
      components={{ toolbar: MyCalendarToolbar }} // 툴바 컴포넌트
      onSelectSlot={handleSelectSlot} // 슬롯 클릭 이벤트
      onSelectEvent={handleSelectEvent} // 이벤트 클릭 이벤트
      eventPropGetter={(event) => { // 이벤트 요소 스타일 설정
        return {
          style: {
            backgroundColor: event.color,
          },
        };
      }}
      onNavigate={(date) => { // 날짜 변경 이벤트
        setSelectedDate(dayjs(date));
      }}
      onShowMore={(events) => { // 더보기 클릭 이벤트
        console.log("onShowMore", events);

        // 화면에 이미 출력중인 이벤트 제목 가져오기
        const showingEvents = document.querySelectorAll(".rbc-event-content");
        const showingEventNames = [] as string[];
        showingEvents.forEach((event) => {
          if (event.textContent) {
            showingEventNames.push(event.textContent);
          }
        });

        // 화면에 안보이는 이벤트 제목 가져오기
        const notShowingEvents = events.filter((event) => !showingEventNames.includes(event.title));
        console.log("notShowingEvents", notShowingEvents);
      }}
      style={{
        width: "95%",
        height: "100vh",
      }}
    />
  );
};

export default MyCalendar;
