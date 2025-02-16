import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout ";
import Home from "./Routes/Home";
import Admin from "./Routes/Admin";
import Categoria from "./Routes/Categoria";
import Detail from "./Routes/Detail";
import CrearCuenta from "./Routes/CrearCuenta.jsx";
import IniciarSesion from "./Routes/IniciarSesion.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/CrearCuenta" element={<CrearCuenta />} />
        <Route path="/IniciarSesion" element={<IniciarSesion />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
