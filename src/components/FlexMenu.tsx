import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IconButton, Button, Typography, Box } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isLoginModalOpenAtom, loginStateAtom, serverInfoAtom } from "../state";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

import LoginButton from "../components/LoginButton";  // LoginButton 컴포넌트 추가
import axios from "axios";


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

  &.expanded {
    width: 300px;
  }

  &.collapsed {
    width: 60px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 20px;

    .logo {
      display: block;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .collapsed .logo {
      display: none;
    }

    .auth-buttons {
      button {
        font-size: 12px;
        color: #555;
        background-color: #E5E5E5;
        border-radius: 6px;
        padding: 5px 10px;
        font-weight: bold;
      }
    }
  }

  .menu-items {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .menu-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333;
      cursor: pointer;

      .menu-icon {
        margin-right: 12px;
        font-size: 20px;
      }
    }
  }

  .arrow-container {
    position: absolute;
    top: 50%;
    left: 95%;
    transform: translate(-50%, -50%);
    transition: left 0.4s;
  }

  &.collapsed .arrow-container {
    left: 50%;
  }

  .search-container {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    border: 1px solid #ddd;
    padding: 5px 10px;
    width: 100%;

    .search-icon {
      color: #888;
      margin-right: 8px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: #555;
      background: none;
    }
  }
`;

const FlexMenu: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);
  const { isLoggedIn, id } = useAtomValue(loginStateAtom); // 로그인 상태 읽기
  const setLoginState = useSetAtom(loginStateAtom); // useSetAtom 불러오기

  const serverInfo = useAtomValue(serverInfoAtom); // useAtomValue 불러오기
  const HOST = serverInfo.HOST; // HOST 불러오기
  const PORT = serverInfo.PORT; // PORT 불러오기



  // 화면 로딩 상태 관리
  const [isLoaded, setIsLoaded] = useState(false);

  // 화면 렌더링 완료 후 상태 업데이트
  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // 로딩 중일 경우 FlexMenu 숨김
  if (!isLoaded) {
    return null;
  }



  // 로그아웃 기능 구현 시작
  const handleLogoutClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다."); // 로그인 상태가 아닌 경우 알림
      return;
    }
  
    // Axios를 사용해 로그아웃 요청
    axios
      .post(`${HOST}:${PORT}/api/logout`, { id }) // 사용자 ID 전달
      .then((response) => {
        if (response.data.success) {
          console.log("로그아웃 응답:", response.data);
  
          // LocalStorage에서 로그인 상태 제거
          localStorage.removeItem("loginState");
  
          // Jotai 상태 초기화
          setLoginState({
            isLoggedIn: false,
            id: "",
          });
  
          alert("로그아웃이 성공적으로 완료되었습니다."); // 성공 메시지
        } else {
          alert(response.data.message || "로그아웃 처리에 실패했습니다."); // 서버에서 실패 메시지
        }
      })
      .catch((error) => {
        // 오류 처리
        console.error("로그아웃 중 오류 발생:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.");
      });
  };    // 로그아웃 기능 구현 끝
  

  return (
    <Style className={isExpanded ? "expanded" : "collapsed"}>
      {/* 헤더 섹션 */}
      <div className="header">
        {isExpanded && (
          <Typography variant="h6" className="logo">
            Task Ez
          </Typography>
        )}
        {isExpanded && (
          <div className="auth-buttons">
            {isLoggedIn ? (
              // 로그아웃 기능 추가
              <LoginButton onClick={handleLogoutClick} />
            ) : (
              <Button variant="contained" onClick={() => setIsLoginModalOpen(true)} // 로그인 모달 열기
              >
                로그인/회원가입
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 검색 바 */}
      {isExpanded && (
        <Box className="search-bar" sx={{ width: "100%", padding: "16px" }}>
          <Box className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="할 일 검색"
            />
          </Box>
        </Box>
      )}

      {/* 메뉴 아이템 */}
      {isExpanded && (
        <Box className="menu-items">
          <Box className="menu-item">
            <NotificationsIcon className="menu-icon" />
            <Typography>알림 (0)</Typography>
          </Box>
        </Box>
      )}

      {/* 토글 버튼 */}
      <div className="arrow-container">
        <IconButton
          aria-label="toggle-menu"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ArrowForwardIosRoundedIcon
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        </IconButton>
      </div>
    </Style>
  );
};

export default FlexMenu;
