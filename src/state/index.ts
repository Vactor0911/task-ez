import dayjs from "dayjs";
import { atom } from "jotai";
import { color } from "../utils/theme";

//서버 정보
export const serverInfoAtom = atom({
  PORT:3005,
  HOST:"http://localhost"
});

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
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}
export const eventsAtom = atom([
  {
    id: 0,
    title: "작업1",
    description: "작업1 설명",
    start: new Date(2024, 11, 17),
    end: new Date(2024, 11, 18),
    color: color.red,
  },
  {
    id: 1,
    title: "작업2",
    description: "작업2 설명",
    start: new Date(2024, 10, 19),
    end: new Date(2024, 11, 21),
    color: color.orange,
  },
  {
    id: 2,
    title: "작업3",
    description: "작업1 설명",
    start: new Date(2024, 11, 17),
    end: new Date(2024, 11, 18),
    color: color.red,
  },
  {
    id: 3,
    title: "작업4",
    description: "작업1 설명",
    start: new Date(2024, 11, 17),
    end: new Date(2024, 11, 18),
    color: color.red,
  },
  {
    id: 4,
    title: "작업5",
    description: "작업1 설명",
    start: new Date(2024, 11, 17),
    end: new Date(2024, 11, 18),
    color: color.red,
  },
  {
    id: 5,
    title: "작업6",
    description: "작업1 설명",
    start: new Date(2024, 11, 17),
    end: new Date(2024, 11, 18),
    color: color.red,
  },
] as TaskProps[]);

// 로그인 모달 상태
export const isLoginModalOpenAtom = atom(false);

// 회원가입 모달 상태
export const isRegisterModalOpenAtom = atom(false);


// 로그인 상태 저장 - LocalStorage에서 상태를 불러옵니다.
const savedLoginState = JSON.parse(localStorage.getItem("loginState") || "{}");

export const loginStateAtom = atom({
  isLoggedIn: savedLoginState.isLoggedIn || false, // 로그인 상태
  id: savedLoginState.id || "", // 로그인된 사용자의 아이디
});

