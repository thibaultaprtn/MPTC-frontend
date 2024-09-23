import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
// import ProtectedRoute from "../components/protectedRoute";
// On peut protéger les routes au sein même des pages

const Dashboard = () => {
  const auth = FIREBASE_AUTH;
  const { logOut, user, isAdmin } = useContext(GlobalContext);
  console.log(useContext(GlobalContext));
  // console.log(user.email);
  // console.log(auth.currentUser.email);
  console.log(isAdmin);
  return (
    // <ProtectedRoute>
    <div>
      <p>Dashboard</p>

      <p>Tes parties</p>
      <p>Tes parties en attente</p>

      <a href="/creategame">Créer une partie</a>
      {isAdmin && <a href="/admindashboard">Accéder au dashboard admin</a>}
      <p>Rejoindre une partie</p>

      <p>You are already logged in</p>
      <p></p>
      <button
        onClick={() => {
          logOut(auth);
        }}
      >
        Logout
      </button>
    </div>
    // </ProtectedRoute>
  );
};

export default Dashboard;
