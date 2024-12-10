import { useNavigate } from "react-router-dom";

const Account = ({teams,setTeams,teamName,setTeamName}) => {
  const navigate = useNavigate();


  // Form submit handler
  const makeTeam = (event) => {
    event.preventDefault();
    if (teamName.trim()) {
      setTeams((previous) => ({
        ...previous, [teamName]: [] // Create a new array with the input name
      }));
      setTeamName(""); // Clear input field after creation
    }
  };


  const removeFromTeam = (team, index) => {
    setTeams((prevTeams) => ({
      ...prevTeams,
      [team]: prevTeams[team].filter((_, i) => i !== index),
    }));
  }

  const deleteTeam = (team) => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      delete updatedTeams[team];
      return updatedTeams;
    }) 
  }


  //------------------------------------RETURN-----------------------------------//


  return (
    <>
      <h2 className="page-title">Hello User</h2>
      <p>Make a New Team</p>
      <form onSubmit={makeTeam}>
        <input
          value={teamName}
          onChange={(event) => setTeamName(event.target.value)}
          placeholder="Team Name"
        />
        <button type="submit">Make Team</button>
      </form>

      <h3>My Teams</h3>
      <section id="teams">
      <ul>
        {Object.keys(teams).map((team) => {
          return (
            <li key={team}>
              <section id="teamName-and-deleteButton">
                <h3>{team}</h3>
                <button onClick={() => deleteTeam(team)}>Delete Team</button>
              </section>
              <section id="team-members">
                {teams[team].map((pokemon, index) => {
                  return (
                    <section id="member">
                      <img src={pokemon.sprite} onClick={() => { navigate(`/NationalDex/${pokemon.name}`)} }/>
                      <p onClick={() => { 
                        navigate(`/NationalDex/${pokemon.name}`)} }
                        >{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
                      </p>

                      <button
                        onClick={() => removeFromTeam(team, index)}
                      >Remove from Team</button>
                    </section>
                    )
                  })}
              </section>
            </li>
          )
        })}
      </ul>
      </section>
    </>
  );
};

export default Account;
