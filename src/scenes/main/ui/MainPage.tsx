import { Game } from "../../../features/game";
import styled from "styled-components";

const MainPageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainPage = () => {
  return (
    <MainPageContainer>
      <Game />
    </MainPageContainer>
  );
};

export default MainPage;
