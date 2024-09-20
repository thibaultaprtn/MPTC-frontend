import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FIREBASE_AUTH } from "../FirebaseConfig";

const AdminRoute = ({ children }) => {
  //On pourrait utiliser le user provenant de Firebase plutot ?
  const { user, isAdmin } = useContext(GlobalContext);
  return user && isAdmin ? children : <Navigate to="/"></Navigate>;
};

export default AdminRoute;
