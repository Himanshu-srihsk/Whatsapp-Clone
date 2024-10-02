import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Status from "./Components/Status/Status";
import StatusViewer from "./Components/Status/StatusViewer";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/status" element={<Status/>}></Route>
        <Route path="/status/:userId" element={<StatusViewer/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
