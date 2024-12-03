import dayjs from "dayjs";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

// 한국어 설정
moment.locale("ko-KR");
export const localizer = momentLocalizer(moment);

// 선택 가능한 날짜 범위
export const MIN_DATE = dayjs().add(-1, "year").month(0).startOf("month"); // 1년 전 1월
export const MAX_DATE = dayjs().add(1, "year").month(11).endOf("month"); // 1년 후 12월