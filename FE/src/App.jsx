import Layout from "./components/layout/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Login2 from "./pages/login2";
import Aichat from "./pages/chat";
import Transaksi from "./pages/transaksi";
import Analitik from "./pages/analitik";
import Setting from "./pages/setting";
import AddTransaction from "./pages/addTransaction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aichat" element={<Aichat />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/analytics" element={<Analitik />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;