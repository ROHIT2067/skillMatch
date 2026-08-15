import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LearnerDetail from "./pages/LearnerDetail.jsx";
import PathFinder from "./pages/PathFinder.jsx";
import CohortGaps from "./pages/CohortGaps.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/learners" element={<LearnerDetail />} />
            <Route path="/path" element={<PathFinder />} />
            <Route path="/gaps" element={<CohortGaps />} />
            <Route path="*" element={<Navigate to="/learners" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
