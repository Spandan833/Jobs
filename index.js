if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const { Job } = require("./models/Job");

mongoose.connect("mongodb+srv://Aizen833:ScarTissue1999@hogyoku.kmr9q.mongodb.net/JobHunter?retryWrites=true&w=majority", () => {
  console.log("connected to mongodb atlas");
});

const jobRouter = require("./routes/jobs");
app.use(methodOverride("_method"));

const port = process.env.PORT || 5000;



const initializePassport = require("./passport-config");

initializePassport(
  passport,
  async (email) => {
    try {
      let user = await User.findOne({ email: email });
      return user;
    } catch (e) {
      console.log(e);
    }
  },
  async (id) => {
    let user = await User.findById(id);
    return user;
  }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

let checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

let checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
app.use("/", jobRouter);

app.get("/", checkAuthentication, async (req, res) => {
  const jobs = await Job.find({});
  res.render("index.ejs", { user: req.user, jobs: jobs });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res, done) => {
  const user = await User.find({ email: req.body.email });
  if (user) {
    res.redirect("/login");
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = new User({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
    });
    newUser = await newUser.save();
    console.log(newUser);
    res.redirect("/login");
  } catch (err) {
    res.redirect('/register')
  }
});
app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
