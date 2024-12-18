const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");
//Get all pokemon (probably unecessary but good to have)
router.get("/", async (req, res, next) => {
  try {
    const pokemon = await prisma.pokemon.findMany();
    res.json(pokemon);
  } catch (e) {
    next(e);
  }
});
// Create a new pokemon
router.post("/", authenticate, async (req, res, next) => {
  const { name, ability, moves, teamId } = req.body;
  const team = await prisma.team.findUnique({ 
    where: {id: +teamId},
    include: { pokemon: true }
  })
  if (team.pokemon.length >=6){
    next({ status: 400, message: "This team is full" })
  }
  if (!name) {
    next({ status: 400, message: "Name must be provided" })
  }
  if (!sprite) {
    next({ status: 400, message: "Sprite must be provided" })
  }
  if (!ability) {
    next({ status: 400, message: "This pokemon has no ability" })
  }
  if (!teamId) {
    next({ status: 400, message: "A Pokemon must be on a team" })
  }
  if (team.ownerId !== req.user.id) {
    next({ status: 403, message: "This is not your team" })
  }
  try {
    const pokemon = await prisma.pokemon.create({
      data: { 
        name,
        ability,
        sprite,
        teamId : +teamId
       },
    });
    res.status(201).json(pokemon);
  } catch (e) {
    next(e);
  }
});
// Get a specific pokemon
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const pokemon = await prisma.pokemon.findUniqueOrThrow( { where: { id : +id } });
    if (!pokemon) {
      next({ status: 404, message: `pokemon with id ${id} not found` })
    }

    //returns an object with the pokemon and a boolean value of if the user who is viewing it ons it
    const team = await prisma.team.findUnique( { where: { id : pokemon.teamId } });
    const isOwner = (req.user.id === team.ownerId)
    //frontend can handle rendering options
    res.json({ 
      pokemon,
       isOwner 
      } );
  } catch (e) {
    next(e);
  }
});

//Wrote an update pokemon router but I'm not sure we need it, commenting it out in case we do
// router.put("/:id", authenticate, async (req, res, next) => {
//   // const includeReservations = req.user
//   //   ? { where: { customerId: req.customer.id } }
//   //   : false;
  
//   const { id } = req.params;
//   if (!id) {
//     next({ status: 400, message: "You must choose a Pokemon" })
//   }
//   try {
//     const pokemon = await prisma.pokemon.findUnique( { where: { id : +id } });
//     const team = await prisma.team.findUnique( { where: { id : pokemon.teamId } });
//     if (!pokemon) {
//       next({ status: 404, message: `Pokemon with id ${id} not found` })
//     }
//     if (req.user.id !== team.ownerId) {
//       next({ status: 400, message: `This is not your Pokemon` })
//     }
//     const updatedPokemon = await prisma.pokemon.update({
//       where: { id: +id },
//       //data: { name },
//     });
//     res.json(updatedPokemon);
//   } catch (e) {
//     next(e);
//   }
// });

router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user.id

  try {
    // Check if the Pokemon exists
    const pokemon = await prisma.pokemon.findUnique({ where: { id: +id } });
    if (!pokemon) {
      return next({ status: 404,message: `Pokemon with id ${id} does not exist.` });
    }
    const team = await prisma.team.findUnique({ where: {id: +pokemon.teamId}})
    
    if (req.user.id !== team.ownerId) {
      next({ status: 403, message: "This is not your team" })
    }
    await prisma.pokemon.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});