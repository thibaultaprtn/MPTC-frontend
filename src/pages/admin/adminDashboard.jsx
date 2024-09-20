import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const AdminDashboard = () => {
  const { userMongoId } = useContext(GlobalContext);
  useEffect(() => {}, []);
  return (
    <div>
      <h2>Bienvenue sur la page d'admin</h2>
      <a href="/addcandidate">Rajouter un candidat</a>
      <a href="/">Rajouter une épreuve</a>
    </div>
  );
};

export default AdminDashboard;
