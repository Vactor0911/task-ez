import styled from "@emotion/styled";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendarToolbar from "./MyCalendarToolbar";
import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { selectedDateAtom } from "../state";
import { color } from "../utils/theme";
import PopupModal from "./PopupModal";

const StyledCalendar = styled(Calendar)`
  width: 95%;
  height: 100vh;

  .rbc-day-bg:hover {
    background-color: ${color.calendal_background};
  }

  .rbc-row-segment {
    display: flex;
    justify-content: center;
  }
`;

const MyCalendar = () => {
  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

  // 이벤트 상태
  const [events, setEvents] = useState([
    {
      title: "작업1",
      description: "작업1 설명",
      start: new Date(2024, 10, 17),
      end: new Date(2024, 10, 18),
      id: 0,
      color: color.red,
    },
    {
      title: "작업2",
      description: "작업2 설명",
      start: new Date(2024, 10, 19),
      end: new Date(2024, 11, 21),
      id: 1,
      color: color.orange,
    },
  ]);

  // 모달 상태 및 선택된 데이터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // 빈 슬롯 클릭 이벤트 (새 이벤트 추가)
  const handleSelectSlot = useCallback((slotInfo) => {
    setModalData({
      type: "slot", // 새 이벤트 추가 모드
      data: {
        title: "", // 초기화된 제목
        description: "", // 초기화된 설명
        color: color.red, // 기본 색상 설정
        start: dayjs(slotInfo.start).format("YYYY-MM-DD"), // 시작 날짜 설정
        end: dayjs(slotInfo.end).format("YYYY-MM-DD"), // 종료 날짜 설정
      },
    });
    setIsModalOpen(true); // 모달 열기
  }, []);

  // 기존 이벤트 클릭 이벤트 (이벤트 수정)
  const handleSelectEvent = (event) => {
    setModalData({
      type: "event", // 기존 이벤트 수정 모드
      data: {
        ...event, // 기존 이벤트 데이터
        start: dayjs(event.start).format("YYYY-MM-DD"), // 시작 날짜
        end: dayjs(event.end).format("YYYY-MM-DD"), // 종료 날짜
      },
    });
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalData(null); // 데이터 초기화
  };

  // 모달 저장 버튼 처리
  const handleSaveModal = (updatedData) => {
    if (modalData?.type === "event") {
      // 기존 이벤트 수정
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === modalData.data.id ? { ...evt, ...updatedData } : evt
        )
      );
    } else if (modalData?.type === "slot") {
      // 새 이벤트 추가
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          ...updatedData,
          id: prevEvents.length, // 고유 ID 생성
          start: modalData.data.start,
          end: modalData.data.end,
        },
      ]);
    }
    handleCloseModal();
  };

  // 모달 삭제 버튼 처리
  const handleDeleteModal = () => {
    if (modalData?.type === "event") {
      // 기존 이벤트 삭제
      setEvents((prevEvents) =>
        prevEvents.filter((evt) => evt.id !== modalData.data.id)
      );
    }
    handleCloseModal();
  };

  return (
    <>
      <StyledCalendar
        localizer={localizer} // 언어 설정
        views={["month"]} // 월간 뷰 활성화
        events={events} // 이벤트 목록 전달
        selectable // 빈 슬롯 선택 가능
        date={selectedDate.toDate()} // 현재 선택된 날짜
        components={{ toolbar: MyCalendarToolbar }} // 커스텀 툴바 사용
        onSelectSlot={handleSelectSlot} // 빈 슬롯 클릭 이벤트
        onSelectEvent={handleSelectEvent} // 이벤트 클릭 이벤트
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color },
        })}
        onNavigate={(date) => setSelectedDate(dayjs(date))} // 날짜 이동 이벤트
      />

      {/* 팝업 모달 */}
      <PopupModal
        open={isModalOpen} // 모달 열림 여부
        onClose={handleCloseModal} // 모달 닫기 핸들러
        onSave={handleSaveModal} // 저장 핸들러
        onDelete={handleDeleteModal} // 삭제 핸들러
        defaultData={modalData?.data || {}} // 기본 데이터 전달
      />
    </>
  );
};

export default MyCalendar;
