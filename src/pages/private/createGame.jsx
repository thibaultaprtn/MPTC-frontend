import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const CreateGame = () => {
  const { userMongoId, token, user } = useContext(GlobalContext);
  const [gameName, setGameName] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [numberOfCandidatesPerTeam, setNumberOfCandidatesPerTeam] = useState(4);

  const handleSubmit = (event) => {
    //La requête dans axios doit avoir
    // headers: {
    //   Authorization: "Bearer " + idtoken,
    //   email: (user.email||""),
    // },
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
        <form>
          <label htmlFor="game_name"></label>
          <input
            id="game_name"
            value={gameName}
            placeholder="Nom de la partie"
            type="text"
            onChange={handleGameNameChange}
          />
          <label htmlFor="number_of_teams"></label>
          <input
            id="number_of_teams"
            value={numberOfTeams}
            placeholder="Nombre d'équipes participant à la partie"
            type="number"
            onChange={handleNumberOfTeamsChange}
          />
          <label htmlFor="number_of_candidates_per_team"></label>
          <input
            id="number_of_candidates_per_team"
            value={numberOfCandidatesPerTeam}
            placeholder="Nombre de candidats par brigade"
            type="number"
            onChange={handleNumberOfCandidatesPerTeamChange}
          />
        </form>
      </div>
    </>
  );
};

export default CreateGame;
