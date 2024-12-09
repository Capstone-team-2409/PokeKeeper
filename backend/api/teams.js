const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
<<<<<<< HEAD
    const teams = await prisma.reservation.findMany({
      where: { userd: req.user.id },
      include: { teams: true },
    });
=======
    const teams = await prisma.team.findMany({
      where: { ownerId: req.user.id },
   });
>>>>>>> 29de420c758534c7889b482e9c66ee4f558cd733
    res.json(teams);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
<<<<<<< HEAD
  const { name, pokemon } = req.body;
  try {
    const pokemon = pokemon.map((id) => ({ id }));
    const team = await prisma.playlist.create({
      data: {
        name,
        pokemon,
        userId : req.user.id,
        tracks: { connect : tracks }
      },
    });
    res.status(201).json(playlist);
=======
  const { name } = req.body;
  try {
    //const pokemon = pokemon.map((id) => ({ id }));
    const team = await prisma.team.create({
      data: {
        name: name,
        //pokemon,
        ownerId : req.user.id,
        //tracks: { connect : tracks }
      },
    });
    res.status(201).json(team);
>>>>>>> 29de420c758534c7889b482e9c66ee4f558cd733
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
   const team = await prisma.team.findUniqueOrThrow({
     where: { id: +id },
     include: { pokemon: true },
   });
  //  if (team.ownerId !== req.user.id) {
  //    next({ status: 403, message: "This is not your team" });
  //  }
    res.json(team)
   }
  catch (e) {
   next(e)
  }
 })