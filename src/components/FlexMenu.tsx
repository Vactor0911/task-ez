import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import {
  IconButton,
  Button,
  Typography,
  Box,
  Paper,
  InputBase,
} from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isModalOpenedAtom,
  taskModalDataAtom,
  eventsAtom,
  ModalOpenState,
  TaskEzLoginStateAtom,
  modalOpenStateAtom,
} from "../state";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

import LoginButton from "../components/LoginButton"; // LoginButton 컴포넌트 추가
import { TaskProps } from "../state";
import axios from "axios";
import dayjs from "dayjs";
import { SERVER_HOST } from "../utils";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #fff6f6;
  z-index: 1000;
  transition: width 0.4s;
  overflow: hidden;
  padding: 10px 10px;
  padding-right: 60px;

  &.expanded {
    width: 370px;
  }

  &.collapsed {
    width: 60px;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 300px;
    height: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

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
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-height: 50%;

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

  .btn-expand-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff6f6;
  }

  .search-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: auto;
    max-height: 35%;
  }

  .search-results {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
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
    overflow-y: auto;
    padding: 5px;
  }

  .typo {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const FlexMenu: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const setModalOpenState = useSetAtom(modalOpenStateAtom);
  const { isLoggedIn, userId } = useAtomValue(TaskEzLoginStateAtom); // 로그인 상태 읽기
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
      .post(`${SERVER_HOST}/api/logout`, { userId }) // 사용자 ID 전달
      .then((response) => {
        if (response.data.success) {
          // LocalStorage에서 로그인 상태 제거
          localStorage.removeItem("TaskEzloginState");

          // Jotai 상태 초기화
          setTaskEzLoginState({
            isLoggedIn: false,
            userId: null,
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
      <div className="wrapper">
        {/* 헤더 섹션 */}
        <div className="header">
          <Typography variant="h6" className="logo">
            Task Ez
          </Typography>
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
        </div>

        {/* 작업 검색 */}
        <div className="search-bar">
          {/* 검색 바 */}
          <Paper
            component="form"
            elevation={0}
            sx={{
              p: "5px 10px",
              display: "flex",
              borderRadius: "50px",
              border: "1px solid #ddd",
            }}
          >
            <InputBase
              placeholder="할 일 검색"
              sx={{ flex: 1 }}
              startAdornment={
                <SearchIcon sx={{ color: "#888", margin: "0 8px" }} />
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <Box className="search-results">
              {searchResults.map((event) => (
                <Box
                  key={event.id}
                  className="result-item"
                  onClick={() => handleResultClick(event)} // 클릭 이벤트 추가
                >
                  <Typography
                    className="typo"
                    variant="body2"
                    sx={{
                      color: "#1E1E1E",
                      fontSize: "16px",
                      fontWeight: "bold",
                      width: "75%",
                    }}
                  >
                    {event.title} {/* 이벤트 제목 표시 */}
                  </Typography>
                  <div className="event-d-day">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: "#FB2A2A",
                        marginLeft: "auto",
                      }}
                    >
                      {`D - ${
                        dayjs(event.end).diff(
                          dayjs(dayjs().format("YYYY.MM.DD")),
                          "days"
                        ) <= 0
                          ? "Day"
                          : dayjs(event.end).diff(
                              dayjs(dayjs().format("YYYY.MM.DD")),
                              "days"
                            )
                      }`}
                    </Typography>
                  </div>
                </Box>
              ))}
            </Box>
          )}
        </div>

        {/* 메뉴 아이템 */}
        <Box className="menu-items">
          <Box className="menu-item">
            <NotificationsIcon className="menu-icon" />
            <Typography>
              알림 (
              {
                events.filter(
                  (event) =>
                    dayjs(event.end).diff(dayjs(), "day") < 3 && // 3일 전부터
                    dayjs(event.end).diff(dayjs(), "day") >= 0 // 오늘까지
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
                  dayjs(event.end).diff(
                    dayjs(dayjs().format("YYYY.MM.DD")),
                    "day"
                  ) < 3 && // 3일 전부터
                  dayjs(event.end).diff(
                    dayjs(dayjs().format("YYYY.MM.DD")),
                    "day"
                  ) >= 0 // 오늘까지
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
                    handleResultClick(event);
                  }}
                >
                  <Box
                    sx={{
                      width: "75%",
                    }}
                  >
                    <Typography
                      className="typo"
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
                      className="typo"
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
                    {`D - ${
                      dayjs(event.end).diff(
                        dayjs(dayjs().format("YYYY.MM.DD")),
                        "days"
                      ) <= 0
                        ? "Day"
                        : dayjs(event.end).diff(
                            dayjs(dayjs().format("YYYY.MM.DD")),
                            "days"
                          )
                    }`}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </div>

      {/* 토글 버튼 */}
      <Box className="btn-expand-wrapper">
        <IconButton
          className="btn-expand"
          size="medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ArrowForwardIosRoundedIcon
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.4s",
            }}
          />
        </IconButton>
      </Box>
    </Style>
  );
};

export default FlexMenu;
