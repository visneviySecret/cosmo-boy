import styled from "styled-components";
import MainPage from "../scenes/main/ui/MainPage";
import "./App.css";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  background-color: #282c34;
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <MainPage />
    </AppContainer>
  );
}

export default App;
