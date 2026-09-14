import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;