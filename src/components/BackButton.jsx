import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../Styles/backButton.css";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
    
  if (location.pathname === "/") return null;

  return (
    <button className="backButton" onClick={() => navigate(-1)}>
      <ArrowLeft size={15} />
    </button>
  );
};

export default BackButton;
