import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import NationalDex from "./components/NationalDex.jsx";
import JohtoDex from "./components/JohtoDex.jsx";
import HoennDex from "./components/HoennDex.jsx";
import SinnohDex from "./components/SinnohDex.jsx";
import UnovaDex from "./components/UnovaDex.jsx";
import KalosDex from "./components/KalosDex.jsx";
import AlolaDex from "./components/AlolaDex.jsx";
import GalarDex from "./components/GalarDex.jsx";
import PaldeaDex from "./components/PaldeaDex.jsx";
import SelectedPokemon from "./components/SelectedPokemon.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
import Account from "./components/Account/Account.jsx";

const App = () => {
  const [teamName, setTeamName] = useState(""); 
  const [teams, setTeams] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [searchedPokemon, setSearchedPokemon] = useState(""); 
  const [pokemon, setPokemon] = useState([]); 

  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

 
  useEffect(() => {
    const getPokemon = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
      const responseJSON = await response.json();
      const pokemon151 = responseJSON.results;

      const pokeData = await Promise.all(
        pokemon151.map(async (singlePokemon) => {
          const response = await fetch(singlePokemon.url);
          const pokeDetail = await response.json();
          return {
            name: singlePokemon.name,
            sprite: pokeDetail.sprites.front_default,
            id: pokeDetail.id,
            type: pokeDetail.types,
          };
        })
      );

      setPokemon(pokeData);
    };

    getPokemon();
  }, []);

  const searchFunction = (event) => {
    event.preventDefault();
    const pokemonName = searchedPokemon.trim().toLowerCase();

      navigate(`/NationalDex/${pokemonName}`);

    setSearchedPokemon("");
  };

  const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/Login" />;
  };

  return (
    <>
      <section id="navigation-and-title">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/Account">Account</Link>
          <Link to="/NationalDex">National Dex</Link>
          <Link to="/JohtoDex">Johto Dex</Link>
          <Link to="/HoennDex">Hoenn Dex</Link>
          <Link to="/SinnohDex">Sinnoh Dex</Link>
          <Link to="/UnovaDex">Unova Dex</Link>
          <Link to="/KalosDex">Kalos Dex</Link>
          <Link to="/AlolaDex">Alola Dex</Link>
          <Link to="/GalarDex">Galar Dex</Link>
          <Link to="/PaldeaDex">Paldea Dex</Link>
          <Link to="/Register">Register</Link>
          <Link to="/Login">Login</Link>
        </nav>

        <form id="search-bar" onSubmit={searchFunction}>
          <input
            placeholder="Search Pokémon by name"
            value={searchedPokemon}
            onChange={(event) => setSearchedPokemon(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <h1>PokéKeeper</h1>
      </section>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/NationalDex" element={<NationalDex pokemon={pokemon} />} />
        <Route path="/JohtoDex" element={<JohtoDex/>} />
        <Route path="/HoennDex" element={<HoennDex/>} />
        <Route path="/SinnohDex" element={<SinnohDex/>} />
        <Route path="/UnovaDex" element={<UnovaDex/>} />
        <Route path="/KalosDex" element={<KalosDex/>} />
        <Route path="/AlolaDex" element={<AlolaDex/>} />
        <Route path="/GalarDex" element={<GalarDex/>} />
        <Route path="/PaldeaDex" element={<PaldeaDex/>} />
        <Route path="/NationalDex/:name" element={<SelectedPokemon teams={teams} setTeams={setTeams} />} />
        <Route path="/Register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/Account"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Account pokemon={pokemon} teamName={teamName} setTeamName={setTeamName} teams={teams} setTeams={setTeams} setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
