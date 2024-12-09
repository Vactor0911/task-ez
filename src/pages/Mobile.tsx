import styled from "@emotion/styled";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: #555;
  padding: 20px;
  gap: 20px;
  word-break: keep-all;
  text-align: center;
`;

const Mobile = () => {
  return (
    <Style>
      <ReportGmailerrorredRoundedIcon
        sx={{
          fontSize: "30vw",
        }}
      />
      <h1>모바일 화면은 아직 개발되지 않았습니다..</h1>
    </Style>
  );
};

export default Mobile;
