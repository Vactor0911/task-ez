import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

// 한국어 설정
moment.locale("ko-KR");
export const localizer = momentLocalizer(moment);