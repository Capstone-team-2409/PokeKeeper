import { useEffect, useState } from "react"

import { useNavigate, Link } from "react-router-dom";


const HoennDex = () => {
  const [pokemon, setPokemon] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemon = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=251&limit=135`);
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

  return (
    <section id="national-dex">

      <h2>National Dex</h2>


      <section id="pokemon151">
        {
          (typeof pokemon === "undefined" || pokemon.length === 0) ? (
            <p>Loading Pokemon...</p>
          ) : (
            pokemon.map((singlePokemon) => {
              return (
                <div key={singlePokemon.name}>
                  <img src={singlePokemon.sprite} alt={singlePokemon.name}
                    onClick={() => { navigate(`/NationalDex/${singlePokemon.name}`)} } />
                  <h3>{singlePokemon.name[0].toUpperCase() + singlePokemon.name.slice(1)}</h3>
                </div>
              )
            })

          )
        }

      </section>
    </section>
  )
}

export default HoennDex
