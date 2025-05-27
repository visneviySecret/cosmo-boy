import styled from "styled-components";
import MainPage from "../scenes/main/ui/MainPage";
import "./App.css";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #282c34;
`;

function App() {
  return (
    <AppContainer>
      <MainPage />
    </AppContainer>
  );
}

export default App;
