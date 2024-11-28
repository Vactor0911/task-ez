import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendarToolbar from "./MyCalendarToolbar";

const MyCalendar = () => {
  // 시간 날짜 형식을 한국어로 설정
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  const events = [
    {
      title: "작업1",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 17),
    },
    {
      title: "작업2",
      start: new Date(2024, 10, 19),
      end: new Date(2024, 12, 21),
    },
  ];

  return (
    <Calendar
      localizer={localizer}
      events={events}
      selectable
      components={{ toolbar: MyCalendarToolbar }}
      style={{
        width: "95%",
        height: "100vh",
      }}
    ></Calendar>
  );
};

export default MyCalendar;
