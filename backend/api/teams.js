const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      where: { ownerId: req.user.id },
   });
    res.json(teams);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
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

 router.delete("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
   const team = await prisma.team.findUniqueOrThrow({
     where: { id: +id },
     include: { pokemon: true },
   });
   if (team.pokemon) {
      team.pokemon.map(async (indPkmn) => {
        await prisma.pokemon.delete({ where: { id: +indPkmn.id } });
      })
   }
   if (!team) {
    return next({ status: 404,message: `Team with id ${id} does not exist.` });
   }
   if (team.ownerId !== req.user.id) {
     next({ status: 403, message: "This is not your team" });
   }
   await prisma.team.delete({ where: { id: +id } });
   res.sendStatus(204);
   }
  catch (e) {
   next(e)
  }
 })