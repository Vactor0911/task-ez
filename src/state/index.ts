import dayjs from "dayjs";
import { atom } from "jotai";

export const selectedDateAtom = atom(dayjs());

// 더보기 팝업 관련 상태
export const hiddenEventsAtom = atom<any[]>([]);
export const isShowMoreOpenedAtom = atom(false);
export const showMoreBtnAnchorAtom = atom<HTMLButtonElement | null>(null);

// 작업 모달 관련 상태
export const isModalOpenedAtom = atom(false); // 모달 열림 여부
export const taskModalDataAtom = atom(null as TaskProps | null); // 작업 데이터

// 작업 객체 타입
export interface TaskProps {
  id: number | null;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}

// 작업 목록 상태
export const eventsAtom = atom<TaskProps[]>([]);

// 모달 상태
export enum ModalOpenState {
  NONE,
  LOGIN,
  REGISTER,
}
export const modalOpenStateAtom = atom(ModalOpenState.NONE);

// 로그인 상태 저장 - LocalStorage에서 상태를 불러옵니다.
const savedLoginState = JSON.parse(localStorage.getItem("TaskEzloginState") || "{}");

export const TaskEzLoginStateAtom = atom({
  isLoggedIn: savedLoginState.isLoggedIn || false, // 로그인 상태
  userId: savedLoginState.userId || null, // 로그인된 사용자의 아이디
});
