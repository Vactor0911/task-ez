import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IconButton, Button, Typography, Box } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isModalOpenedAtom,
  taskModalDataAtom,
  eventsAtom,
  ModalOpenState,
  TaskEzLoginStateAtom,
  modalOpenStateAtom,
  serverInfoAtom,
} from "../state";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

import LoginButton from "../components/LoginButton"; // LoginButton 컴포넌트 추가
import TaskModal from "./TaskModal";
import { TaskProps } from "../state";
import axios from "axios";
import dayjs from "dayjs";

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
        background-color: #e5e5e5;
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
    gap: 5px;

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
    margin-bottom: 10px;

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

  .search-results {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    padding: 5px;

    .result-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      font-size: 14px;
      cursor: pointer; /* 클릭 가능한 스타일 추가 */
      &:hover {
        background-color: #f0f0f0; /* 마우스 오버 효과 */
      }

      .event-title {
        font-weight: bold;
      }

      .event-d-day {
        display: flex;
        align-items: center;

        .d-label {
          font-size: 14px;
          font-weight: bold;
          color: #888;
          min-width: 20px;
          text-align: center;
        }

        .d-value {
          font-size: 14px;
          color: #555;
          min-width: 30px;
          text-align: right;
        }

        .highlight {
          animation: highlight 2s ease-in-out;
          background-color: yellow !important;
        }
      }
    }
  }

  .ararm-container {
    background-color: #fff6f6;
    border-radius: 8px;
    max-height: 300px;
    overflow-y: auto;
    padding: 5px;
  }
`;

const FlexMenu: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const setModalOpenState = useSetAtom(modalOpenStateAtom);
  const { isLoggedIn, id } = useAtomValue(TaskEzLoginStateAtom); // 로그인 상태 읽기
  const setTaskEzLoginState = useSetAtom(TaskEzLoginStateAtom); // useSetAtom 불러오기
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TaskProps[]>([]);
  const events = useAtomValue(eventsAtom);

  const [, setIsModalOpened] = useAtom(isModalOpenedAtom); // 모달 열림 상태
  const [, setTaskModalData] = useAtom(taskModalDataAtom); // 선택된 작업 데이터

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }, [searchQuery, events]);

  // 검색 결과 클릭 시 모달 열기
  const handleResultClick = (event: TaskProps) => {
    setTaskModalData(event); // 선택된 작업 데이터 설정
    setIsModalOpened(true); // 모달 열기
  };

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
          localStorage.removeItem("TaskEzloginState");

          // Jotai 상태 초기화
          setTaskEzLoginState({
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
  }; // 로그아웃 기능 구현 끝

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
              <Button
                variant="contained"
                onClick={() => setModalOpenState(ModalOpenState.LOGIN)} // 로그인 모달 열기
              >
                로그인/회원가입
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 검색 바 */}
      {isExpanded && (
        <Box className="search-bar" sx={{ width: "100%", padding: "18px" }}>
          <Box className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="할 일 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          {searchResults.length > 0 && (
            <Box className="search-results">
              {searchResults.map((event) => (
                <Box
                  key={event.id}
                  className="result-item"
                  onClick={() => handleResultClick(event)} // 클릭 이벤트 추가
                >
                  <span className="event-title">{event.title}</span>
                  <div className="event-d-day">
                    <span className="d-label">D</span>
                    <span className="d-value">
                      {dayjs(event.start).diff(dayjs(), "day")}
                    </span>
                  </div>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* 메뉴 아이템 */}
      {isExpanded && (
        <Box className="menu-items">
          <Box className="menu-item">
            <NotificationsIcon className="menu-icon" />
            <Typography>
              알림 (
              {
                events.filter(
                  (event) =>
                    dayjs(event.start).diff(dayjs(), "day") >= -3 && // 3일 전부터
                    dayjs(event.start).diff(dayjs(), "day") <= 0 // 오늘까지
                ).length
              }
              )
            </Typography>
          </Box>

          {/* 알림 목록 */}
          <Box className="ararm-container">
            {events
              .filter(
                (event) =>
                  dayjs(event.start).diff(dayjs(), "day") >= -3 && // 3일 전부터
                  dayjs(event.start).diff(dayjs(), "day") <= 0 // 오늘까지
              )
              .map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    cursor: "pointer", // 클릭 가능
                  }}
                  onClick={() => {
                    const targetElement = document.querySelector(
                      `[data-date="${dayjs(event.start).format("YYYY-MM-DD")}"]`
                    );
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: "smooth" }); // 달력 이동
                      targetElement.classList.add("highlight"); // 하이라이트 효과 추가
                      setTimeout(
                        () => targetElement.classList.remove("highlight"),
                        2000
                      );
                    }
                    setIsModalOpened(true);
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1E1E1E",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {event.title} {/* 이벤트 제목 표시 */}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#1E1E1E", fontWeight: "bold" }}
                    >
                      {`${dayjs(event.start).format("YYYY.MM.DD")} ~ ${dayjs(
                        event.end
                      ).format("YYYY.MM.DD")}`}
                    </Typography>
                  </Box>

                  {/* D-Day 표시 */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#FB2A2A",
                      marginLeft: "auto",
                    }}
                  >
                    {`D - ${dayjs(event.start).diff(dayjs(), "day")}`}
                  </Typography>
                </Box>
              ))}
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
      <TaskModal />
    </Style>
  );
};

export default FlexMenu;
