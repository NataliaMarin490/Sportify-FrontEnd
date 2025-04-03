import CourtForm from "../components/CourtForm";
import { useNavigate, useParams } from "react-router-dom";

const CreateCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    const courtData = id
      ? { ...data, id, featureIds: data.featureIds || [] }
      : data;

    console.log("Guardando cancha:", courtData);
    navigate("/administracion");
  };

  return (
    <div className="create-court-container">
      <CourtForm onSubmit={handleSubmit} isEditing={!!id} courtId={id} />
    </div>
  );
};

export default CreateCourt;
