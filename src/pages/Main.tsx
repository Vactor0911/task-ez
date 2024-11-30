import styled from "@emotion/styled";
import MyCalendar from "../components/MyCalendar";
import FlexMenu from "../components/FlexMenu";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const Style = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
`;

const Main = () => {
    return (
        <Style>
            <FlexMenu />
            <MyCalendar />
            <LoginModal />
            <RegisterModal />
        </Style>
    );
}

export default Main;