import "../Styles/image.css";

const Image = () => {
  return (
    <div>
      <img className="image" src="public\icons\image 7.png" alt="cancha" />
      <div className="image-container">
        <p className="image-text">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
        <div className="image-info">
          <div>
            <h4 className="main-title">15 AÑOS</h4>
            <p className="secondary-title">EXPERIENCIA</p>
          </div>
          <div>
            <h4 className="main-title">25 +</h4>
            <p className="secondary-title">CANCHAS</p>
          </div>
          <div>
            <h4 className="main-title">500 +</h4>
            <p className="secondary-title">USUARIOS</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Image;
