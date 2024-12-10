import { useEffect, useState } from "react"
import { useNavigate,Link } from "react-router-dom";

const NationalDex = () => {
  const navigate = useNavigate();
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



  //------------------------------------RETURN-----------------------------------//


  return (
    <>

      <h2>National Dex</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/Account">Account</Link></li>
        </ul>
      </nav>

      <section id="pokemon151">
        {
          (typeof pokemon === "undefined" || pokemon.length === 0) ? (
            <p>Loading Pokemon...</p>
          ) : (
            pokemon.map((singlePokemon) => {
              return (
                <div key={singlePokemon.name}>
                  <img src={singlePokemon.sprite} alt={singlePokemon.name}
                  onClick={() => { navigate(`/NationalDex/${singlePokemon.id}`)} } />
                  <h3>{singlePokemon.name[0].toUpperCase() + singlePokemon.name.slice(1)}</h3>
                </div>
              )
            })

          )
        }

      </section>
    </>
  )
}

export default NationalDex
