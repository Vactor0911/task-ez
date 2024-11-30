import styled from "@emotion/styled";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"; // 화살표 아이콘
import { useState } from "react";
import { IconButton, Button } from "@mui/material"; // 아이콘 버튼, 버튼 컴포넌트
import SearchIcon from "@mui/icons-material/Search"; // 검색 아이콘
import DateRangeIcon from '@mui/icons-material/DateRange'; // 달력 아이콘
import NotificationsIcon from '@mui/icons-material/Notifications'; // 알림 아이콘

// 스타일 정의
const Style = styled.div`
  display: flex;
  flex-direction: column;
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
  }

  /* 상단 헤더 영역 스타일 */
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

  /* 검색바 영역 스타일 */
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0;

    .search-container {
      display: flex;
      align-items: center;
      width: 60%;
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

  /* 화살표 버튼 위치 설정 */
  .arrow-container {
    position: absolute;
    top: 50%; /* 세로 중앙 */
    left: ${(props: { isExpanded: boolean }) =>
      props.isExpanded ? "95%" : "50%"}; /* 펼침 상태에 따라 위치 조정 */
    transform: translate(-50%, -50%);
    transition: left 0.4s;
  }
`;

const FlexMenu: React.FC = () => {
  // 사이드바 상태를 관리하는 useState
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Style
      style={{
        width: isExpanded ? "30%" : "5%", // 펼쳐진 상태에 따라 너비 조정
      }}
      isExpanded={isExpanded} // 상태를 props로 전달
    >
      {/* 헤더 섹션 */}
      <div className="header">
        <div className="logo">
          <span>TZ</span>
        </div>
        <div className="auth-buttons">
          <Button variant="text">로그인/회원가입</Button>
        </div>
      </div>

      {/* 검색바 섹션 - 펼쳐진 상태에서만 렌더링 */}
      {isExpanded && (
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
      )}

      {/* 화살표 버튼 섹션 */}
      <div className="arrow-container">
        <IconButton
          aria-label="toggle-menu"
          size="small"
          onClick={() => {
            setIsExpanded(!isExpanded); // 상태 토글
          }}
        >
          <ArrowForwardIosRoundedIcon
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", // 펼침 상태에 따라 화살표 회전
              transition: "0.3s", // 부드러운 애니메이션
            }}
          />
        </IconButton>
      </div>
    </Style>
  );
};

export default FlexMenu;
