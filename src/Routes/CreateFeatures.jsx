import FeatureForm from "../components/FeatureForm";

const CreateFeatures = () => {
  const handleFeatureSubmit = () => {
    console.log("Característica guardada con éxito");
  };

  return (
    <div className="create-features-container">
      <FeatureForm onSubmit={handleFeatureSubmit} />
    </div>
  );
};

export default CreateFeatures;
