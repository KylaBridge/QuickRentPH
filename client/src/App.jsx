import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      
      {/* Landing page route */}
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Add more routes here for more pages */}
    </Routes>
  );
}

export default App;
