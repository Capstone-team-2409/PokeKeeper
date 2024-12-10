import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const NationalDex = ({ pokemon }) => {
  const navigate = useNavigate();
  



  //------------------------------------RETURN-----------------------------------//


  return (
    <>
      <h2 className="page-title">National Dex</h2>

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
    </>
  )
}

export default NationalDex
