import React from "react";
import CourtForm from "../components/CourtForm";

const CreateCourt = () => {
  const handleSubmit = (data) => {
    console.log("Guardando cancha:", data);
  };

  return (
    <div className="create-court-container">
      <CourtForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCourt;
