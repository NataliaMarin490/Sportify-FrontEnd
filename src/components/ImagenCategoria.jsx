import "../Styles/ImagenCategoria.css";


const Imagen = ({}) => {
  return (
    <div>
      <img className="Imagen" src="public\icons\image 7.png" alt="cancha" />
      <div className="ContenedorImg">
        <p className="TextoImagenCate">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
        <div className="Info">
          <div>
            <h4 className="Titulo">15 AÑOS</h4>
            <p className="Titulo2">EXPERIENCIA</p>
          </div>
          <div>
            <h4 className="Titulo">25 +</h4>
            <p className="Titulo2">CANCHAS</p>
          </div>
          <div>
            <h4 className="Titulo">500 +</h4>
            <p className="Titulo2">USUARIOS</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Imagen;
