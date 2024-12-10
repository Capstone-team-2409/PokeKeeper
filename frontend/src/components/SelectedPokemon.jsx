import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SelectedPokemon = ({ teams, setTeams }) => {
  const navigate = useNavigate();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(""); // To track the chosen team
  const { name } = useParams();

  useEffect(() => {
    const getSinglePokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        const singlePokemon = await response.json();
        // console.log(`singlePokemon.abilities[0].ability.name:`, singlePokemon.abilities[0].ability.name);
        // figure out a way to choose the pokemon's desired ability
        //    dropdown menu to choose perhaps????
        // the `ability` in the schema Pokemon model is a String, so it has to be just one ability chosen
        const abilitiesArray = singlePokemon.abilities;
        console.log(`abilitiesArray:`, abilitiesArray);
        const commonAbility = singlePokemon.abilities[0].ability.name

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
        const speciesInfo = await speciesResponse.json();

        const pokeDescription = speciesInfo.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        ).flavor_text;

        const sanitizedDescription = pokeDescription.replace(/[\n\r\f]/g, " ");

        const detailedPokemon = {
          name: singlePokemon.name,
          sprite: singlePokemon.sprites.front_default,
          shinySprite: singlePokemon.sprites.front_shiny,
          id: singlePokemon.id,
          type: singlePokemon.types.map((typeObj) => typeObj.type.name).join(", "),
          description: sanitizedDescription,
          ability: commonAbility,
        };

        setPokemonDetails(detailedPokemon);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    getSinglePokemon();
  }, [name]);

  const addToTeam = () => {
    console.log(selectedTeam);
    console.log(teams);
    console.log(teams[selectedTeam]);
    if (!selectedTeam) {
      alert("Please select a team!");
      return;
    }

    if(teams[selectedTeam].length >= 6) {
      alert("This team is full");
      return;
    }




    // connect to backend here with POST request to our API



    setTeams((prevTeams) => ({
      ...prevTeams,
      [selectedTeam]: [...(prevTeams[selectedTeam] || []), pokemonDetails],
    }));

    alert(`${pokemonDetails.name[0].toUpperCase() + pokemonDetails.name.slice(1)} added to ${selectedTeam}!`);
  };

  if (!pokemonDetails) {
    return <p>Loading...</p>;
  }


  //------------------------------------RETURN-----------------------------------//

  

  return (
    <section id="selected-pokemon">
      <div className="poke-images">
        <img src={pokemonDetails.sprite} alt={pokemonDetails.name} className="page-title"/>
        <img src={pokemonDetails.shinySprite} alt={`${pokemonDetails.name} shiny`} />
      </div>
      <h2>{pokemonDetails.name[0].toUpperCase() + pokemonDetails.name.slice(1)}</h2>
      <p>Type: {pokemonDetails.type.toUpperCase()}</p>
      <p>PokéDex Entry: {pokemonDetails.description}</p>

      {/* Team Selection Dropdown */}
      <select value={selectedTeam} onChange={(event) => setSelectedTeam(event.target.value)}>
        <option value="">Select a Team</option>
        {Object.keys(teams).map((teamName) => (
          <option key={teamName} value={teamName}>
            {teamName}
          </option>
        ))}
      </select>

      <button onClick={addToTeam}>Add to Team</button>
      <button onClick={() => navigate(`/NationalDex`)}>Back to National Dex</button>
    </section>
  );
};

export default SelectedPokemon;
