import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";

const Game = () => {
  const navigate = useNavigate();
  const { userMongoId, user, token } = useContext(GlobalContext);
  const [gameDetails, setGameDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const { id } = useParams();
  //   console.log(id);

  const handleLaunchGame = async () => {};

  //TODO Il faut différencier deux cas :
  //Lors de la requête, si jamais la partie n'est pas encore lancée, il faut récupérer uniquement les infos générales de la partie sans les différents bet

  useEffect(() => {
    const fetchgame = async () => {
      try {
        const game = await axios.get(
          `${import.meta.env.VITE_BACKURL}/game/dashboard`,
          {
            params: {
              game_id: id,
              user_id: userMongoId,
            },
            headers: {
              Authorization: "Bearer " + token,
              email: user.email || "",
            },
          }
        );
        // console.log("game.data", game.data);
        const userData = await axios.get(
          `${import.meta.env.VITE_BACKURL}/user/`,
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
        // console.log(userData.data.games.includes(id));
        console.log(game.data);
        // console.log(userData.data);
        setUserDetails(userData.data);
        setGameDetails(game.data);
        setIsAuthorized(userData.data.games.includes(id));
        setIsLoading(false);
      } catch (error) {
        navigate("/");
        console.log(error.message);
      }
    };
    fetchgame();
    // setIsAuthorized(userDetails.games.includes(id));
    // setIsAuthorized(userDetails.games.includes(id));
  }, []);

  //   console.log(isAuthorized);

  return (
    <>
      {isLoading ? (
        <p>Chargement</p>
      ) : isAuthorized ? (
        <div>
          <p>Partie</p>

          {gameDetails.launched ? (
            <p>La partie a été lancé</p>
          ) : (
            <p>La partie n'est pas encore démarée</p>
          )}
          {gameDetails.launchable ? (
            <p>La partie est prête à être lancée</p>
          ) : (
            <p>Le mercato n'est pas encore fini !</p>
          )}
          <button disabled={!gameDetails.launchable} onClick={handleLaunchGame}>
            Lancer la partie
          </button>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Game;
