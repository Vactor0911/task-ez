import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
  )
}

export default App
