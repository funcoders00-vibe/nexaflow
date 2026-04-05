import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NexaflowLogin from "./pages/NexaflowLogin";
import NexaFlowDashboard from "./pages/NexaFlowDashboard";
import NexaFlowCreateProject from "./pages/NexaFlowCreateProject";
import NexaFlowDocuments from "./pages/NexaFlowDocuments";
import NexaFlowProjects from "./pages/NexaFlowProjects";
import NexaFlowCommunication from "./pages/NextFlowCommunication";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexaflowLogin />} />
        <Route path="/dashboard" element={<NexaFlowDashboard />} />
        <Route path="/client" element={<NexaFlowCreateProject/>}/>
        <Route path="/projects"element={<NexaFlowProjects/>}/>
        <Route path="/communication"element={<NexaFlowCommunication/>}/>
        <Route path="/documents"element={<NexaFlowDocuments/>}/>
      </Routes>
    </Router>
  );
}

export default App;
