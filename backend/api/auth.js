const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt
const prisma = require("../prisma"); // Import Prisma client

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; // Define salt rounds for bcrypt

router.use(cors());
router.use(bodyParser.json());

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
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log("Hashed Password:", hashedPassword);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
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
    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});


// User details endpoint
router.get("/user", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true, // Include the username field
        teams: true, // Assuming you have a relationship setup for teams
      },
    });
    res.json(user);
  } catch (e) {
    next(e);
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
