import React from 'react'
import "../Styles/admin.css";
import { useContextGlobal } from '../Context/global.context';



const Admin = () => {
  const {state, dispatch} = useContextGlobal();

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_COURT", payload: id });
  };


  const handleEdit = (id) => {
    console.log("Editar court con ID:", id);
    dispatch({ type: "UPDATE_COURT", payload: id });
  };

  return (
    <div className="admin-view">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {state.courts.map((court) => (
            <tr key={court.id}>
              <td>{court.id}</td>
              <td>{court.name}</td>
              <td>
                <button onClick={() => handleEdit(court.id)}>Editar</button>
                <button onClick={() => handleDelete(court.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={handleAdd}>Agregar Nueva Receta</button> */}
    </div>
  );
}

export default Admin
