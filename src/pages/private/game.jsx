import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";

import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

const Game = () => {
  const navigate = useNavigate();
  const { userMongoId, user, token } = useContext(GlobalContext);
  const [gameDetails, setGameDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [mercato, setMercato] = useState([]);
  const [total, setTotal] = useState(0);
  const { id } = useParams();
  //   console.log(id);

  useEffect(() => {
    let totaltemp = 0;
    if (mercato.length === 0) {
      setTotal(0);
    }
    for (let i = 0; i < mercato.length; i++) {
      totaltemp = totaltemp + mercato[i].bet;
    }
    console.log(totaltemp);
    setTotal(totaltemp);
  }, [mercato]);

  const addCandidate = (candidate) => {
    const newMercato = [...mercato];
    const exist = newMercato.find((elem) => elem._id === candidate._id);
    console.log("le candidat est déjà ajouté au mercato :", exist);
    if (exist) {
      exist.bet++;
      setMercato(newMercato);
    } else {
      newMercato.push({ ...candidate, bet: 1 });
      setMercato(newMercato);
    }
  };

  const removeCandidate = (candidate) => {
    const newMercato = [...mercato];
    const exist = newMercato.find((elem) => elem._id === candidate._id);
    if (exist.bet === 1) {
      // trouver l'index
      const index = newMercato.indexOf(exist);
      // supprimer l'élément du tableau
      newMercato.splice(index, 1);
      // if (newMercato.length === 0) {
      //   setCartVisible(false);
      // }
    } else {
      exist.bet--;
    }
    setMercato(newMercato);
  };

  const hardRemoveCandidate = (candidate) => {
    const newMercato = [...mercato];
    const exist = newMercato.find((elem) => elem._id === candidate._id);
    if (exist) {
      const index = newMercato.indexOf(exist);
      newMercato.splice(index, 1);
    }
    setMercato(newMercato);
  };

  const handleLaunchGame = async () => {};
  const handleDisplayCandidates = () => {};

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
        console.log(game.data.available_candidates);
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
          <p>Partie "{gameDetails.game_name}"</p>

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
          {/* N'afficher le bouton que si l'ID est celui de l'admin de la partie */}
          <button disabled={!gameDetails.launchable} onClick={handleLaunchGame}>
            Lancer la partie
          </button>

          {/* Ne fonctionne pas dans le cas ou on n'est pas dans de la draft car on renvoie plusieurs teams et pas uniquement la notre */}

          {gameDetails.launched ? (
            <div></div>
          ) : (
            <div>
              <p>Ton équipe :</p>
              {gameDetails.team[0].users.map((elem) => {
                return (
                  <p key={elem._id}>
                    {elem.username} {elem._id === userMongoId && "(toi)"}
                  </p>
                );
              })}

              {!gameDetails.team[0].draft && !gameDetails.team[0].full && (
                <>
                  <h2> Choisis ta brigade ! Fais des enchères</h2>
                  <p>Liste des candidats disponibles</p>
                  <div style={{ display: "flex" }}>
                    {gameDetails.available_candidates.map((elem, index) => {
                      return (
                        <div
                          key={elem._id}
                          onClick={() => {
                            addCandidate(elem);
                          }}
                          className="hovercursor"
                        >
                          <img
                            src={elem.can_pics[0].secure_url}
                            style={{
                              width: 75,
                              height: 75,
                              objectFit: "contain",
                            }}
                          />
                          <p>{elem.can_surname}</p>
                        </div>
                      );
                    })}
                  </div>
                  {/* Composant Mercato / Equivalent du panier dans deliverro */}

                  <h2>Tes enchères</h2>
                  <p>Total : {total}</p>
                  <div style={{ display: "flex" }}>
                    {mercato
                      .sort(function (a, b) {
                        return b.bet - a.bet;
                      })
                      .map((mercatoItem) => {
                        return (
                          <div key={mercatoItem._id}>
                            <img
                              src={mercatoItem.can_pics[0].secure_url}
                              alt=""
                              style={{
                                width: 75,
                                height: 75,
                                objectFit: "contain",
                              }}
                            />
                            <p>{mercatoItem.can_surname}</p>
                            <p>Bet : {mercatoItem.bet}</p>
                            <FaPlus
                              onClick={() => {
                                addCandidate(mercatoItem);
                              }}
                            />
                            <FaMinus
                              onClick={() => {
                                removeCandidate(mercatoItem);
                              }}
                            />
                            <FaTrashCan
                              onClick={() => {
                                hardRemoveCandidate(mercatoItem);
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Game;
