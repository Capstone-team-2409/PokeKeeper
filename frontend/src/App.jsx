
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import NationalDex from "./components/NationalDex.jsx";
import SelectedPokemon from "./components/SelectedPokemon.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Account from "./components/Account.jsx";

const App = () => {
  // State variables for teamName and teams
  const [teamName, setTeamName] = useState(""); // Team name input
  const [teams, setTeams] = useState({}); // Object holding all teams
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  // Check for token on component mount to maintain session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <h1>PokeKeeper</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/NationalDex" element={<NationalDex />} />
        <Route path="/NationalDex/:id" element={<SelectedPokemon teams={teams} setTeams={setTeams} />} />
        <Route path="/Register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/Account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Account teamName={teamName} setTeamName={setTeamName} teams={teams} setTeams={setTeams} setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
      </Routes>
    </>
  );
};


const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/Login" />;
};


export default App;
