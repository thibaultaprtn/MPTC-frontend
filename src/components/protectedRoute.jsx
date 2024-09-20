import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { FIREBASE_AUTH } from "../FirebaseConfig";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(GlobalContext);
  return user ? children : <Navigate to="/"></Navigate>;
};

export default ProtectedRoute;
