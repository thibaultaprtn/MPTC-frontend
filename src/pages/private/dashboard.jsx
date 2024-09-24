import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import axios from "axios";
import { Link } from "react-router-dom";
// import ProtectedRoute from "../components/protectedRoute";
// On peut protéger les routes au sein même des pages

const Dashboard = () => {
  const auth = FIREBASE_AUTH;
  const { logOut, user, isAdmin, userMongoId, token } =
    useContext(GlobalContext);
  const [games, setGames] = useState([]);
  const [userTeamNumber, setUserTeamNumber] = useState({});
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
      // console.log("fetchedgames", fetchedgames.data);
      // console.log("testing", fetchedgames.data.user_team_number);
      setGames(fetchedgames.data.gameslist);
      setUserTeamNumber(fetchedgames.data.user_team_number);
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
          return (
            elem.launched && (
              <Link key={elem._id} to={`/game/${elem._id}`}>
                {elem.game_name} {userTeamNumber[elem._id]}
              </Link>
            )
          );
        })}
      </>
      <p>Tes parties en attente</p>
      <>
        {games.map((elem) => {
          return (
            !elem.launched && (
              <Link key={elem._id} to={`/game/${elem._id}`}>
                {elem.game_name} {userTeamNumber[elem._id]}
              </Link>
            )
          );
        })}
      </>

      <a href="/creategame">Créer une partie</a>
      <a href="/joingame">Rejoindre une partie</a>
      {isAdmin && <a href="/admindashboard">Accéder au dashboard admin</a>}

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
