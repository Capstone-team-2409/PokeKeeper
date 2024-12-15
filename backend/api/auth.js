const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const prisma = require("../prisma"); 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

router.use(cors());
router.use(bodyParser.json());


function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
}


router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); 
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


router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    
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
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'Invalid credentials' });
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
