export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_COURTS":
      return { ...state, courts: action.payload };

    case "ADD_COURT":
      return {
        ...state,
        courts: [...state.courts, action.payload],
      };

    case "GET_RECOMMENDED_COURTS":
      return { ...state, recommendedCourts: action.payload };

    case "UPDATE_COURT":
      return {
        ...state,
        courts: state.courts.map((court) =>
          court.id === action.payload.id ? action.payload : court
        ),
      };

    case "DELETE_COURT":
      return {
        ...state,
        courts: state.courts.filter((court) => court.id !== action.payload),
      };

    default:
      throw new Error("Acción no existente");
  }
};
