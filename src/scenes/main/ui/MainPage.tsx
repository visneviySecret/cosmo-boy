import styled from "styled-components";
import { GameRoot } from "../../../features/game";

const MainPageContainer = styled.div`
  width: 100%;
  max-width: 100%;
`;

const MainPage = () => {
  return (
    <MainPageContainer>
      <GameRoot />
    </MainPageContainer>
  );
};

export default MainPage;
