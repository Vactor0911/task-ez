import dayjs from "dayjs";
import { atom } from "jotai";

export const selectedDateAtom = atom(dayjs());

export const hiddenEventsAtom = atom<any[]>([]);
export const isShowMoreOpenedAtom = atom(false);
export const showMoreBtnAnchorAtom = atom<HTMLButtonElement | null>(null);