import { useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

const JoinGame = () => {
  const { mongoUserId, token, user } = useContext(GlobalContext);
  const [gameId, setGameId] = useState("");
  const [gameDetails, setGameDetails] = useState({});
  const [firstStep, setFirstStep] = useState(true);
  const handleFirstSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.get(
      `${import.meta.env.VITE_BACKURL}/game/joinable`,
      {
        params: {
          game_id: gameId,
        },
        headers: {
          Authorization: "Bearer " + token,
          email: user.email || "",
        },
      }
    );
    console.log(response);
    if (response.data.game) {
      setGameDetails(response.data.game);
      setFirstStep(false);
    }
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
    </>
  );
};

export default JoinGame;
