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
  const [maxBet, setMaxBet] = useState(20);
  const [changed, setChanged] = useState(true);
  const [total, setTotal] = useState(0);
  const { id } = useParams();

  //   console.log(id);

  useEffect(() => {
    console.log(changed);
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
        console.log(game);
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
        // console.log(game.data.available_candidates);
        // console.log(userData.data);
        if (!game.data.launched) {
          setMaxBet(
            (game.data.nb_candidates_team -
              game.data.team[0].candidates.length) *
              10
          );
        }
        console.log(game.data);
        setUserDetails(userData.data);
        setGameDetails(game.data);
        setIsAuthorized(userData.data.games.includes(id));
        setMercato([]);
        setIsLoading(false);
      } catch (error) {
        navigate("/");
        console.log(error.message);
      }
    };
    fetchgame();
    // setIsAuthorized(userDetails.games.includes(id));
    // setIsAuthorized(userDetails.games.includes(id));
  }, [changed]);

  useEffect(() => {
    let totaltemp = 0;
    if (mercato.length === 0) {
      setTotal(0);
    }
    for (let i = 0; i < mercato.length; i++) {
      totaltemp = totaltemp + mercato[i].bet;
    }
    // console.log(totaltemp);
    setTotal(totaltemp);
  }, [mercato]);

  const addCandidate = (candidate) => {
    if (total >= maxBet) {
      return;
    }
    const newMercato = [...mercato];
    const exist = newMercato.find((elem) => elem._id === candidate._id);
    // console.log("le candidat est déjà ajouté au mercato :", exist);
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

  const handleLaunchGame = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKURL}/game/launch`,
        {
          game_id: id,
          user_id: userMongoId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            email: user.email || "",
          },
        }
      );
      setChanged(!changed);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDisplayCandidates = () => {};

  const handleSubmitBets = async (mercato) => {
    try {
      if (mercato.length === 0) {
        return alert("Tu n'as pas choisi de candidats");
      } else if (total < maxBet) {
        return alert("Il te reste des crédits à utiliser !");
      } else {
        let bets = {};
        mercato.sort(function (a, b) {
          return b.bet - a.bet;
        });
        for (let i = 0; i < mercato.length; i++) {
          bets[mercato[i]._id] = mercato[i].bet;
        }
        // console.log(bets);
        bets.time = Date.now();
        const response = await axios.put(
          `${import.meta.env.VITE_BACKURL}/game/placebet`,
          { bets: bets, user_id: userMongoId, game_id: id },
          {
            headers: {
              Authorization: "Bearer " + token,
              email: user.email || "",
            },
          }
        );
        console.log("response", response);
        alert("tu viens de placer tes enchères !");
        setChanged(!changed);

        //Il faut faire un objet que l'on va venir push dans le fichier de partie
        //Il faut qu'on le rajoute dans le bet de l'équipe correspondante
        //Pas besoin de mettre le round, on pourra y avoir accès via l'index car on push dans le dossier
        //Il faut passer le draft a true
        //Changer ce que l'on affiche sur la page : Mettre les infos du dernier bet
        //Indiquer que l'on doit attendre que les autres fassent leurs enchères.
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //TODO Il faut différencier deux cas :
  //Lors de la requête, si jamais la partie n'est pas encore lancée, il faut récupérer uniquement les infos générales de la partie sans les différents bet

  //   console.log(isAuthorized);

  return (
    <>
      {isLoading ? (
        <p>Chargement</p>
      ) : isAuthorized ? (
        <div className="container" style={{ marginTop: 30 }}>
          <h2 style={{ marginTop: 20, marginBottom: 20 }}>
            Partie "{gameDetails.game_name}"
          </h2>

          {gameDetails.launched ? (
            <p className="gamedescription">La partie a été lancé</p>
          ) : (
            <p className="gamedescription">
              La partie n'est pas encore démarée
            </p>
          )}

          {!gameDetails.launched &&
            (gameDetails.launchable ? (
              <p className="gamedescription">
                La partie est prête à être lancée
              </p>
            ) : (
              <p className="gamedescription">
                Le mercato n'est pas encore fini !
              </p>
            ))}

          {/* N'afficher le bouton que si l'ID est celui de l'admin de la partie */}
          {!gameDetails.launched && (
            <button
              className="launchgamebutton"
              disabled={
                !gameDetails.launchable || gameDetails.admin_id !== userMongoId
              }
              onClick={handleLaunchGame}
            >
              Lancer la partie
            </button>
          )}

          {/* Ne fonctionne pas dans le cas ou on n'est pas dans de la draft car on renvoie plusieurs teams et pas uniquement la notre */}

          {gameDetails.launched ? (
            <div></div>
          ) : (
            <div>
              <h3>Ton équipe :</h3>
              <ul></ul>
              {gameDetails.team[0].users.map((elem) => {
                return (
                  <li key={elem._id}>
                    {elem.username} {elem._id === userMongoId && "(toi)"}
                  </li>
                );
              })}

              {gameDetails.team[0].draft && !gameDetails.team[0].full && (
                <p style={{ marginBottom: 30, marginTop: 30, fontSize: 20 }}>
                  Tu as placé tes enchères, attends que les autres joueurs
                  valident les leurs !
                </p>
              )}

              {!gameDetails.team[0].draft && !gameDetails.team[0].full && (
                <>
                  <h3> Choisis ta brigade ! Fais des enchères :</h3>
                  <p>Liste des candidats disponibles :</p>
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      display: "flex",
                      gap: 15,
                      flexWrap: "wrap",
                    }}
                  >
                    {gameDetails.available_candidates.map((elem, index) => {
                      return (
                        <div
                          key={elem._id}
                          onClick={() => {
                            addCandidate(elem);
                          }}
                          className="hovercursor gamecandidatedisplay"
                        >
                          <img
                            src={elem.can_pics[0].secure_url}
                            style={{
                              width: 75,
                              // height: 75,
                              objectFit: "contain",
                            }}
                          />
                          <p>{elem.can_surname}</p>
                        </div>
                      );
                    })}
                  </div>
                  {/* Composant Mercato / Equivalent du panier dans deliverro */}

                  <h3>Tes enchères</h3>
                  <p className="gamedescription">
                    Crédit restant : {maxBet - total}
                  </p>
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      display: "flex",
                      gap: 15,
                      flexWrap: "wrap",
                    }}
                  >
                    {mercato
                      .sort(function (a, b) {
                        return b.bet - a.bet;
                      })
                      .map((mercatoItem) => {
                        return (
                          <div
                            className="hovercursor gamecandidatedisplay"
                            key={mercatoItem._id}
                          >
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
                            {/* <p style={{ fontSize: 8 }}>{mercatoItem._id}</p> */}
                            <p>Bet : {mercatoItem.bet}</p>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
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
                          </div>
                        );
                      })}
                  </div>
                  <button
                    className="placebetbutton"
                    onClick={() => {
                      handleSubmitBets(mercato);
                      // setChanged(!changed);
                    }}
                  >
                    Valider les enchères
                  </button>
                </>
              )}

              {/* TODO Il faut changer ce display parce que cela correspond à une partie qui n'est pas lancée*/}

              {gameDetails.team[0].full && (
                <p className="gamedescription">
                  {" "}
                  Ta brigade est au complet ! Attends que les autres joueurs
                  finissent de compléteter les leurs et que l'admin lance la
                  partie !
                </p>
              )}

              <div>
                <p className="gamedescription">Les candidats de ta brigade :</p>
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {gameDetails.team[0].candidates.map((elem) => {
                    return (
                      <div
                        className="hovercursor gamecandidatedisplay"
                        key={elem._id}
                      >
                        <img
                          src={elem.can_pics[0].secure_url}
                          alt=""
                          style={{
                            width: 75,
                            height: 75,
                            objectFit: "contain",
                          }}
                        />
                        <p key={elem._id}>{elem.can_surname}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div style={{ height: 200 }}></div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Game;
