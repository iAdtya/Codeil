const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expresslayouts = require("express-ejs-layouts");
const { db, mongoURL } = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-startegy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const { options } = require("./routes");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

//? middleware to parse the form data
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//? middleware to use static files
app.use(express.static("./assets"));

//? make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expresslayouts);
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);

//* setting up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//todo mongo store is used to store the session cookie in the db

app.use(
  session({
    name: "codeial",
    //todo change the secret before deployment
    secret: "blahsomething",
    resave: false, // Add this line
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: mongoURL,
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});


// todo try creating a form for comment with each posts and getting the data back to the controller and saving it in the db