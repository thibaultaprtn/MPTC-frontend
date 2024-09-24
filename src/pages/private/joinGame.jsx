import { useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

const JoinGame = () => {
  const { userMongoId, token, user } = useContext(GlobalContext);
  const [gameId, setGameId] = useState("");
  const [gameDetails, setGameDetails] = useState({});
  const [firstStep, setFirstStep] = useState(true);
  const handleFirstSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKURL}/game/joinable`,
        {
          params: {
            game_id: gameId,
            user_id: userMongoId,
          },
          headers: {
            Authorization: "Bearer " + token,
            email: user.email || "",
          },
        }
      );
      console.log(response.data);
      if (response.data) {
        setGameDetails(response.data);
        setFirstStep(false);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleTeamSubmit = async (event, number) => {
    // event.preventDefault();
    try {
      console.log(number);
      // const response = await axios.put(
      //   `${import.meta.env.VITE_BACKURL}/game/addplayer`,
      //   {
      //     params: {
      //       team_number: number,
      //       user_id: userMongoId,
      //     },
      //     headers: {
      //       Authorization: "Bearer " + token,
      //       email: user.email || "",
      //     },
      //   }
      // );
    } catch (error) {}
  };

  const handleGameIdChange = (event) => setGameId(event.target.value);
  return (
    <>
      {firstStep && (
        <form onSubmit={handleFirstSubmit}>
          <label>
            <input
              type="text"
              value={gameId}
              placeholder="Id de la partie à rejoindre"
              onChange={handleGameIdChange}
            />
          </label>
          <button type="submit">Rejoindre la partie</button>
        </form>
      )}
      {!firstStep && (
        <div>
          <h2>Rejoindre la partie "{gameDetails.game_name}"</h2>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {gameDetails.team.map((elem, index) => {
              return (
                <div
                  key={elem.team_number}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <button
                    onClick={(event) =>
                      handleTeamSubmit(event, elem.team_number)
                    }
                  >
                    Equipe n° {elem.team_number}
                  </button>
                  <p>{elem.team_name}</p>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {elem.users.map((elem, index) => {
                      return <p key={elem._id}>{elem.username}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default JoinGame;
