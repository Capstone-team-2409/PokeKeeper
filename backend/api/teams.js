const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      where: { ownerId: req.user.id },
      include: {
        pokemon: true
      }
    });
    res.json(teams);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { name } = req.body;
  try {
    const team = await prisma.team.create({
      data: {
        name: name,
        ownerId: req.user.id,
      },
    });
    res.status(201).json(team);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUniqueOrThrow({
      where: { id: +id },
      include: { pokemon: true },
    });
    if (team.ownerId !== req.user.id) {
      return next({ status: 403, message: "This is not your team" });
    }
    res.json(team);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/pokemon", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { pokemon } = req.body;
  try {
    const newPokemon = await prisma.pokemon.create({
      data: {
        name: pokemon.name,
        ability: pokemon.ability,
        sprite: pokemon.sprite,
        team: {
          connect: { id: +id }
        }
      },
    });
    res.status(201).json(newPokemon);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const team = await prisma.team.findUniqueOrThrow({
      where: { id: +id },
      include: { pokemon: true },
    });
    if (team.pokemon) {
      team.pokemon.map(async (indPkmn) => {
        await prisma.pokemon.delete({ where: { id: +indPkmn.id } });
      });
    }
    if (!team) {
      return next({ status: 404, message: `Team with id ${id} does not exist.` });
    }
    if (team.ownerId !== req.user.id) {
      return next({ status: 403, message: "This is not your team" });
    }
    await prisma.team.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.delete("/:teamId/pokemon/:pokemonId", authenticate, async (req, res, next) => {
  const { teamId, pokemonId } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { id: +teamId },
      include: { pokemon: true }
    });
    if (!team) {
      return next({ status: 404, message: `Team with id ${teamId} does not exist.` });
    }

    if (req.user.id !== team.ownerId) {
      return next({ status: 403, message: "This is not your team" });
    }

    const pokemon = team.pokemon.find(p => p.id === +pokemonId);
    if (!pokemon) {
      return next({ status: 404, message: `Pokemon with id ${pokemonId} does not exist in this team.` });
    }

    await prisma.pokemon.delete({ where: { id: +pokemonId } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
