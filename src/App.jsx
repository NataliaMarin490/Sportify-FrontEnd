import "./App.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout ";
import Home from "./Components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
