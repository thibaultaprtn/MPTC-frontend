import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import axios from "axios";
// import ProtectedRoute from "../components/protectedRoute";
// On peut protéger les routes au sein même des pages

const Dashboard = () => {
  const auth = FIREBASE_AUTH;
  const { logOut, user, isAdmin, userMongoId, token } =
    useContext(GlobalContext);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(useContext(GlobalContext));
  // console.log(user.email);
  // console.log(auth.currentUser.email);
  // console.log(isAdmin);

  useEffect(() => {
    const fetchgames = async () => {
      // console.log(user.email);
      const fetchedgames = await axios.get(
        `${import.meta.env.VITE_BACKURL}/game/list`,
        {
          params: {
            user_id: userMongoId,
          },
          headers: {
            Authorization: "Bearer " + token,
            email: user.email || "",
          },
        }
      );
      // console.log(fetchedgames.data);
      setGames(fetchedgames.data);
    };
    fetchgames();
    setIsLoading(false);
  }, []);

  // console.log(games);

  return (
    // <ProtectedRoute>
    <div>
      <p>Dashboard</p>

      <p>Tes parties</p>
      <>
        {games.map((elem) => {
          return !elem.launchable && <p key={elem._id}>{elem.game_name}</p>;
        })}
      </>
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
