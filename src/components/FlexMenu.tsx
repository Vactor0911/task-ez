import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useState } from "react";

const Style = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #fff6f6;
  z-index: 1000;
  transition: width 0.5s;
`;

const FlexMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Style style={{
        width: isExpanded ? "30%" : "5%",
    }}>
      <IconButton aria-label="delete" size="small" onClick={() => {
        setIsExpanded(!isExpanded);
      }}>
        <ArrowForwardIosRoundedIcon sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
        }} />
      </IconButton>
    </Style>
  );
};

export default FlexMenu;
