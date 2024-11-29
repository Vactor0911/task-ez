import styled from "@emotion/styled";
import MyCalendar from "../components/MyCalendar";
import FlexMenu from "../components/FlexMenu";

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
        </Style>
    );
}

export default Main;