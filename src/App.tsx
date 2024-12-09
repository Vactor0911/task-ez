import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Mobile from "./pages/Mobile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={screen.width < 768 ? <Mobile /> : <Main />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
