import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

const CreateGame = () => {
  const { userMongoId, token, user } = useContext(GlobalContext);
  const [gameName, setGameName] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [numberOfCandidatesPerTeam, setNumberOfCandidatesPerTeam] = useState(4);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKURL}/game/create`,
        {
          game_name: gameName,
          admin_id: userMongoId,
          nb_teams: numberOfTeams,
          nb_candidates_team: numberOfCandidatesPerTeam,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            email: user.email || "",
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGameNameChange = (event) => setGameName(event.target.value);
  const handleNumberOfTeamsChange = (event) =>
    setNumberOfTeams(event.target.value);
  const handleNumberOfCandidatesPerTeamChange = (event) =>
    setNumberOfCandidatesPerTeam(event.target.value);

  return (
    <>
      <h2>Créer une partie</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor="game_name">Nom de la partie</label>
          <input
            id="game_name"
            value={gameName}
            placeholder="Nom de la partie"
            type="text"
            onChange={handleGameNameChange}
          />
          <label htmlFor="number_of_teams">
            Nombre d'équipes dans la partie
          </label>
          <input
            id="number_of_teams"
            value={numberOfTeams}
            placeholder="Nombre d'équipes participant à la partie"
            type="number"
            onChange={handleNumberOfTeamsChange}
          />
          <label htmlFor="number_of_candidates_per_team">
            Nombre de candidats par équipe
          </label>
          <input
            id="number_of_candidates_per_team"
            value={numberOfCandidatesPerTeam}
            placeholder="Nombre de candidats par brigade"
            type="number"
            onChange={handleNumberOfCandidatesPerTeamChange}
          />
          <button type="submit">Créer la partie</button>
        </form>
      </div>
    </>
  );
};

export default CreateGame;
