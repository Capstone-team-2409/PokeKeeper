const express = require("express");
const cors = require("cors"); // added cors
const bodyParser = require("body-parser"); //body parser
const jwt = require("jsonwebtoken");
const prisma = require("../prisma"); // Import Prisma client

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.use(cors()); // added cors
router.use(bodyParser.json()); // parse JSON bodies

// Function to create JWT token
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
}

// Middleware to authenticate user
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // "Bearer <token>"
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

// Registration endpoint
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password, // In a real-world scenario, you should hash the password before storing it
      },
    });
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    if (e.code === 'P2002') { // Prisma error code for unique constraint violation
      res.status(400).json({ error: 'Username already exists' });
    } else {
      next(e);
    }
  }
});

// Login endpoint
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
    });
    // In a real-world scenario, you should compare the hashed password
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Authentication middleware
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
