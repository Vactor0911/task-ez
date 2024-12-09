import styled from "@emotion/styled";
import { Calendar } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendarToolbar from "./MyCalendarToolbar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  eventsAtom,
  isModalOpenedAtom,
  isShowMoreOpenedAtom,
  ModalOpenState,
  modalOpenStateAtom,
  selectedDateAtom,
  showMoreBtnAnchorAtom,
  TaskEzLoginStateAtom,
  taskModalDataAtom,
  TaskProps,
} from "../state";
import { color } from "../utils/theme";
import TaskModal from "./TaskModal";
import MyShowMore from "./MyShowMore";
import { localizer, SERVER_HOST } from "../utils";
import MyShowMoreModal from "./MyShowMoreModal";
import axios from "axios";

const StyledCalendar = styled(Calendar)`
  width: calc(100% - 70px);
  height: 100vh;

  .rbc-day-bg:hover {
    background-color: #f0f0f0;
  }

  .rbc-row-segment {
    display: flex;
    justify-content: center;
  }
`;

// 작업 편집 모달 모드
const enum TaskModalMode {
  NONE,
  EVENT,
  SLOT,
}

const MyCalendar = () => {
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

  // 더보기 버튼 클릭시 표시할 숨겨진 이벤트 목록
  const [isShowMoreOpened, setIsShowMoreOpened] = useAtom(isShowMoreOpenedAtom);
  const [isShowMoreOpenedDelayed, setIsShowMoreOpenedDelayed] = useState(false);
  const showMoreBtnAnchor = useAtomValue(showMoreBtnAnchorAtom);

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
        event.target !== showMoreBtnAnchor
      ) {
        setIsShowMoreOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refCollapse, showMoreBtnAnchor]);

  // 이벤트 상태
  const [events, setEvents] = useAtom(eventsAtom);

  const TaskEzLoginState = useAtomValue(TaskEzLoginStateAtom);
  useEffect(() => {
    // 새로고침 시 이벤트 목록 다시 불러오기
    setEvents([] as TaskProps[]); // 이벤트 초기화

    // 로그인 상태가 아니라면 처리 중지
    if (TaskEzLoginState.userId == null) {
      return;
    }

    // 서버에서 이벤트 목록 불러오기
    axios
      .post(`${SERVER_HOST}/api/get-tasks`, {
        userId: TaskEzLoginState.userId,
      })
      .then((response) => {
        const { success, tasks } = response.data;
        if (success) {
          // 이벤트 목록 업데이트
          setEvents(
            tasks.map((task: any) => ({
              id: task.task_id,
              title: task.title,
              description: task.content,
              start: new Date(task.start_date),
              end: new Date(task.end_date),
              color: task.color,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("이벤트 목록 불러오기 실패:", error);
      });
  }, [TaskEzLoginState]);

  // 모달 상태 및 선택된 데이터
  const setIsModalOpened = useSetAtom(isModalOpenedAtom); // 작업 편집 모달 열림 여부
  const setTaskModalData = useSetAtom(taskModalDataAtom); // 작업 데이터
  const [, setTaskModalMode] = useState<TaskModalMode>(
    TaskModalMode.NONE
  ); // 모달 모드
  const setModalOpenState = useSetAtom(modalOpenStateAtom); // 모달 열림 상태

  // 빈 슬롯 클릭 이벤트 (새 이벤트 추가)
  const handleSelectSlot = useCallback(
    (slotInfo: any) => {
      // 비로그인 상태이면 로그인 대화상자 팝업
      if (!TaskEzLoginState.isLoggedIn) {
        setModalOpenState(ModalOpenState.LOGIN); // 로그인 대화상자 팝업
        return;
      }

      // 더보기 팝업이 열려있으면 이벤트 처리 중지
      if (isShowMoreOpenedDelayed) {
        return;
      }

      setTaskModalData({
        id: null, // 새로운 이벤트의 경우 ID는 null
        title: "", // 초기화된 제목
        description: "", // 초기화된 설명
        color: color.red, // 기본 색상 설정
        start: dayjs(slotInfo.start).toDate(), // 시작 날짜 설정
        end: dayjs(slotInfo.end).add(-1, "day").toDate(), // 종료 날짜 설정
      });
      setIsModalOpened(true); // 모달 열기
    },
    [isShowMoreOpenedDelayed, TaskEzLoginState]
  );

  // 기존 이벤트 클릭 이벤트 (이벤트 수정)
  const handleSelectEvent = useCallback(
    (event: any, hidden: boolean = false) => {
      // 비로그인 상태이면 로그인 대화상자 팝업
      if (!TaskEzLoginState.isLoggedIn) {
        setModalOpenState(ModalOpenState.LOGIN); // 로그인 대화상자 팝업
        return;
      }

      // 더보기 팝업이 열려있으면 이벤트 처리 중지
      if (isShowMoreOpenedDelayed && !hidden) {
        return;
      }

      setTaskModalMode(TaskModalMode.EVENT); // 이벤트 모드로 설정
      setTaskModalData({
        ...event, // 기존 이벤트 데이터
        start: dayjs(event.start).toDate(), // 시작 날짜
        end: dayjs(event.end).toDate(), // 종료 날짜
      });
      setIsModalOpened(true); // 모달 열기
    },
    [isShowMoreOpenedDelayed, TaskEzLoginState]
  );

  return (
    <>
      <StyledCalendar
        localizer={localizer} // 언어 설정
        views={["month"]} // 월간 뷰 활성화
        events={events} // 이벤트 목록 전달
        selectable // 빈 슬롯 선택 가능
        date={selectedDate.toDate()} // 현재 선택된 날짜
        components={{
          toolbar: MyCalendarToolbar,
          showMore: MyShowMore,
        }} // 툴바 컴포넌트
        onSelectSlot={handleSelectSlot} // 빈 슬롯 클릭 이벤트
        onSelectEvent={(event) => handleSelectEvent(event)} // 이벤트 클릭 이벤트
        eventPropGetter={(event: any) => {
          // 이벤트 요소 스타일 설정
          return {
            style: {
              backgroundColor: event.color,
              color: "black",
              fontWeight: "500",
            },
          };
        }}
        onNavigate={(date) => {
          // 날짜 변경 이벤트
          setSelectedDate(dayjs(date));
        }}
      />

      {/* 팝업 모달 */}
      <TaskModal />

      {/* 작업 더보기 모달 */}
      <MyShowMoreModal
        ref={refCollapse}
        handleSelectEvent={handleSelectEvent}
      />
    </>
  );
};

export default MyCalendar;
