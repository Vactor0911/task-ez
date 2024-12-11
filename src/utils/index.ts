import dayjs from "dayjs";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

//서버 정보
export const SERVER_HOST = "https://task-ez.vactor0911.dev";

// 한국어 설정
moment.locale("ko-KR");
export const localizer = momentLocalizer(moment);

// 선택 가능한 날짜 범위
export const MIN_DATE = dayjs().add(-1, "year").month(0).startOf("month"); // 1년 전 1월
export const MAX_DATE = dayjs().add(1, "year").month(11).endOf("month"); // 1년 후 12월

// toISOString() 반환값을 한국 표준시로 변환
export const toKstISOString = (date: dayjs.Dayjs) => {
    return new Date(date.toDate().getTime() - date.toDate().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// 한국 표준시가 적용된 dayjs 객체 반환
export const koDayjs = (date?: dayjs.Dayjs) => {
    return dayjs(dayjs(date).toDate());
};