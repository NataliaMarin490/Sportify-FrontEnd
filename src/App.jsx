import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout ";
import Home from "./Routes/Home";
import Admin from "./Routes/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
