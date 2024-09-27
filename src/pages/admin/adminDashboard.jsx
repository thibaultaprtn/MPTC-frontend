import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const AdminDashboard = () => {
  const { userMongoId } = useContext(GlobalContext);
  useEffect(() => {}, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <h1>ADMIN DASHBOARD</h1>
      </div>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <h2 className="gamedescription">ACTIONS :</h2>
        <a
          style={{ textAlign: "center" }}
          className="dashboardaction"
          href="/addcandidate"
        >
          Rajouter un candidat
        </a>
        <a style={{ textAlign: "center" }} className="dashboardaction" href="/">
          Rajouter une épreuve
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
