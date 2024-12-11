import { Button } from "@mui/material";
import { useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { hiddenEventsAtom, isShowMoreOpenedAtom, showMoreBtnAnchorAtom } from "../state";

// 아이콘
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MyShowMore = ({ events, count }: any) => {
  const [, setHiddenEvents] = useAtom(hiddenEventsAtom); // 숨겨진 이벤트 목록
  const [isShowMoreOpened, setIsShowMoreOpened] = useAtom(isShowMoreOpenedAtom); // 더보기 팝업 열림 여부
  const setShowMoreBtnAnchor = useSetAtom(showMoreBtnAnchorAtom); // 더보기 버튼 요소

  // 더보기 클릭 이벤트
  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, events: any[]) => {
      // 클릭된 더보기 버튼 요소 저장
      setShowMoreBtnAnchor(e.target as HTMLButtonElement);

      // 화면에 이미 출력중인 이벤트 제목 가져오기
      const showingEvents = document.querySelectorAll(".rbc-event-content");
      const showingEventIds = [] as number[];
      showingEvents.forEach((event) => {
        if (event.id) {
          showingEventIds.push(Number(event.id));
        }
      });

      // 화면에 안보이는 이벤트 제목 가져오기
      const newHiddenEvents = events.filter(
        (event: any) => !showingEventIds.includes(event.id)
      );
      setHiddenEvents(newHiddenEvents); // 화면에 안보이는 이벤트 목록 저장
      setIsShowMoreOpened(!isShowMoreOpened); // 더보기 팝업 열기
    },
    [isShowMoreOpened]
  );

  return (
    <Button
      variant="text"
      startIcon={<MoreVertIcon />}
      sx={{
        padding: 0,
      }}
      onClick={(e) => handleButtonClick(e, events)}
    >
      +{count}
    </Button>
  );
};

export default MyShowMore;
