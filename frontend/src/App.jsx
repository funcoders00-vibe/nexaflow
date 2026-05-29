import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NexaFlowLogin from "./pages/NexaFlowLogin";
import NexaFlowDashboard from "./pages/NexaFlowDashboard";
import NexaFlowCreateProject from "./pages/NexaFlowCreateProject";
import NexaFlowDocuments from "./pages/NexaFlowDocuments";
import NexaFlowProjects from "./pages/NexaFlowProjects";
import NexaFlowCommunication from "./pages/NextFlowCommunication";
import NexaAiChat from "./pages/NexaAiChat";
import NexaFlowTasks from "./pages/NexaFlowTasks";
import NexaFlowFinance from "./pages/NexaFlowFinance";

// Elegant client-side protected route guard
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexaFlowLogin />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <NexaFlowDashboard />
          </ProtectedRoute>
        } />
        <Route path="/client" element={
          <ProtectedRoute>
            <NexaFlowCreateProject />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <NexaFlowProjects />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <NexaFlowTasks />
          </ProtectedRoute>
        } />
        <Route path="/finances" element={
          <ProtectedRoute>
            <NexaFlowFinance />
          </ProtectedRoute>
        } />
        <Route path="/communication" element={
          <ProtectedRoute>
            <NexaFlowCommunication />
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <NexaFlowDocuments />
          </ProtectedRoute>
        } />
        <Route path="/nexaAI" element={
          <ProtectedRoute>
            <NexaAiChat />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
