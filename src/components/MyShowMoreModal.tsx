import { Box, Collapse, Paper, Popper } from "@mui/material";
import { useAtomValue } from "jotai";
import { forwardRef } from "react";
import {
  hiddenEventsAtom,
  isShowMoreOpenedAtom,
  showMoreBtnAnchorAtom,
} from "../state";

interface MyShowMoreModalProps {
  handleSelectEvent: (event: any, hidden?: boolean) => void;
}

const MyShowMoreModal = forwardRef<HTMLDivElement, MyShowMoreModalProps>(
  ({ handleSelectEvent }: MyShowMoreModalProps, ref) => {
    const isShowMoreOpened = useAtomValue(isShowMoreOpenedAtom);
    const showMoreBtnAnchor = useAtomValue(showMoreBtnAnchorAtom);
    const hiddenEvents = useAtomValue(hiddenEventsAtom);

    return (
      <Popper
        open={Boolean(showMoreBtnAnchor)}
        placement="bottom-start"
        anchorEl={showMoreBtnAnchor}
        sx={{
          zIndex: 10,
        }}
      >
        <Collapse in={isShowMoreOpened} ref={ref}>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "5px 10px",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            {hiddenEvents.map((event, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: event.color,
                    padding: "5px",
                    borderRadius: "5px",
                    color: "black",
                    cursor: "pointer",
                    width: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onClick={() => handleSelectEvent(event, true)}
                >
                  {event.title}
                </Box>
              );
            })}
          </Paper>
        </Collapse>
      </Popper>
    );
  }
);

export default MyShowMoreModal;
