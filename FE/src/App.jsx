import Layout from "./components/layout/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;