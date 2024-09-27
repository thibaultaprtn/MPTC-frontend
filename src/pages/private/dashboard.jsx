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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <h1>DASHBOARD</h1>
      </div>
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginBottom: 60,
          }}
        >
          <h2>TES PARTIES :</h2>
          <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
            {games.map((elem) => {
              return (
                elem.launched && (
                  <Link
                    className="dashboardgamelink"
                    key={elem._id}
                    to={`/game/${elem._id}`}
                  >
                    <p>{elem.game_name}</p>
                    <p>Team {userTeamNumber[elem._id]}</p>
                  </Link>
                )
              );
            })}
          </div>
          <h2>TES PARTIES EN ATTENTE :</h2>
          <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
            {games.map((elem) => {
              return (
                !elem.launched && (
                  <Link
                    className="dashboardgamelink"
                    key={elem._id}
                    to={`/game/${elem._id}`}
                  >
                    <p>{elem.game_name}</p>
                    <p>Team {userTeamNumber[elem._id]}</p>
                  </Link>
                )
              );
            })}
          </div>
        </div>
        <h2 style={{ marginBottom: 20 }}>ACTIONS :</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a className="dashboardaction" href="/creategame">
            Créer une partie
          </a>
          <a className="dashboardaction" href="/joingame">
            Rejoindre une partie
          </a>
          {isAdmin && (
            <a
              style={{ textAlign: "center" }}
              className="dashboardaction"
              href="/admindashboard"
            >
              Accéder au dashboard admin
            </a>
          )}

          {/* <p>You are already logged in</p>
          <p></p> */}
          <button
            className="logoutbutton"
            onClick={() => {
              logOut(auth);
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
};

export default Dashboard;
