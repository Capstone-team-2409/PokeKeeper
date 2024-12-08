import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NationalDex from "./components/NationalDex.jsx";
import SelectedPokemon from "./components/SelectedPokemon.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import Home from "./components/Home.jsx";

const App = () => {
  return (
    <>
      <h1>PokeKeeper</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/NationalDex" element={<NationalDex />} />
        <Route path="/NationalDex/:id" element={<SelectedPokemon />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} /> {/* Protect this route if needed */}
      </Routes>

    </>
   
  );
};

export default App;
