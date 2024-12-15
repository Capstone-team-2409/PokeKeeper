const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const prisma = require("../prisma"); 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SALT_ROUNDS = 10;

router.use(cors());
router.use(bodyParser.json());

function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' }); 
}

function createRefreshToken(id) {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
}


router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; 
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    req.user = user;
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    res.status(201).json({ token, refreshToken });
  } catch (e) {
    if (e.code === 'P2002') { 
      res.status(400).json({ error: 'Username already exists' });
    } else {
      next(e);
    }
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    res.json({ token, refreshToken });
  } catch (e) {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});


router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const { id } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const newToken = createToken(id);
    res.json({ token: newToken });
  } catch (e) {
    console.error(`Failed to verify refresh token`, e);
    return res.sendStatus(403);
  }
});

router.get("/user", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true, 
        teams: true, 
      },
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

module.exports = {
  router,
  authenticate,
};
