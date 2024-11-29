import styled from "@emotion/styled";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useState } from "react";
import { IconButton, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // 검색 아이콘 추가
import NotificationsIcon from "@mui/icons-material/Notifications"; // 알림 아이콘 추가
import DateRangeIcon from "@mui/icons-material/DateRange"; // 일정 아이콘 추가
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // 계정 아이콘 추가

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
  transition: width 0.4s;
  overflow: hidden;

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    transition: margin-left 0.4s;

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px;

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;

      span {
        margin-left: 8px;
      }
    }

    .auth-buttons {
      button {
        margin-left: 10px;
        font-size: 14px;
        color: #555;
        background-color: #f2f2f2;
        border-radius: 20px;
        padding: 5px 15px;
      }
    }
  }

  .search-bar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 60%;
    padding: 10px 0;

    .search-container {
      display: flex;
      align-items: center;
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 25px;
      padding: 10px 15px;
      background-color: #fff;

      .search-icon {
        margin-right: 10px;
        color: #888;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        color: #999;
        background: none;
      }
    }
  }
`;

const FlexMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Style
      style={{
        width: isExpanded ? "30%" : "5%",
      }}
    >
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          <span>TZ</span>
        </div>
        <div className="auth-buttons">
          <Button variant="text">로그인/회원가입</Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-bar">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="할 일 검색"
          />
        </div>
      </div>
      <IconButton
        aria-label="delete"
        size="small"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <ArrowForwardIosRoundedIcon
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
          }}
        />
      </IconButton>
    </Style>
  );
};

export default FlexMenu;
