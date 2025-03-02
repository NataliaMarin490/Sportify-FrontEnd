import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout ";
import Home from "./Routes/Home";
import Category from "./Routes/Category";
import Detail from "./Routes/Detail";
import CreateAccount from "./Routes/CreateAccount.jsx";
import Login from "./Routes/Login.jsx";
import CreateCourt from "./Routes/CreateCourt";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminCourts from "./Routes/AdminCourts.jsx";
import AdminCategories from "./Routes/AdminCategories.jsx";
import AdminUsers from "./Routes/AdminUsers.jsx";
import AdminFeatures from "./Routes/AdminFeatures.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-court" element={<CreateCourt />} />
      </Route>
      <Route path="/administration" element={<AdminLayout />}>
        <Route index element={<AdminCourts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="features" element={<AdminFeatures />} />
      </Route>
    </Routes>
  );
}

export default App;
