import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import NationalDex from "./components/NationalDex.jsx"
import SelectedPokemon from "./components/SelectedPokemon.jsx"
import Account from "./components/Account.jsx"


const App = () => {
  const navigate = useNavigate();

const [teamName, setTeamName] = useState(""); // Team name input
const [teams, setTeams] = useState({}); // Object holding all teams
const [searchedPokemon, setSearchedPokemon] = useState("");
const [pokemon, setPokemon] = useState([]);

  useEffect(() => {

    const getPokemon = async() => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
      const responseJSON = await response.json();
      const pokemon151 = responseJSON.results;


      const pokeData = await Promise.all(
        pokemon151.map(async (singlePokemon) => {
          const response = await fetch(singlePokemon.url);
          const pokeDetail = await response.json();
          // console.log(`pokeDetail: `, pokeDetail);


          
          return {
            name: singlePokemon.name,
            sprite: pokeDetail.sprites.front_default,
            id: pokeDetail.id,
            type: pokeDetail.types,
          };
        })
      );

      console.log(`pokeData: `, pokeData);
      setPokemon(pokeData);

    }


    getPokemon();
  }, [])



const searchFunction = (event) => {
  event.preventDefault();

  const pokemonName = searchedPokemon.trim().toLowerCase();
  const pokemonExists = pokemon.some((poke) => poke.name === pokemonName);

  if (pokemonExists) {
    navigate(`/NationalDex/${pokemonName}`);
  } else {
    alert("Pokémon not found in the National Dex.");
  }
  setSearchedPokemon("");

  

}
//------------------------------------RETURN-----------------------------------//
 return (
  <>

    <section id="navigation-and-title">

      <nav>
        <Link to={`/Account`}>Account</Link>
        <Link to={"/NationalDex"}>National Dex</Link>
      </nav>
      

      <form id="search-bar" onSubmit={searchFunction}>
        <input
          placeholder="Search Pokémon by name"
          value={searchedPokemon}
          onChange={(event) => setSearchedPokemon(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>


      <h1>Practice PokeKeeper</h1>
    </section>

    <Routes>
      <Route path="/Account" element={<Account 
        teamName={teamName} setTeamName={setTeamName}
        teams={teams} setTeams={setTeams}/>}
      />
      <Route path="/NationalDex" element={<NationalDex pokemon={pokemon}/>}/>
      <Route path="/NationalDex/:name" element={<SelectedPokemon 
        teams={teams} setTeams={setTeams}/>}
      />
    </Routes>
  </>
 )
}

export default App
