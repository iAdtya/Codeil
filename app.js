const express = require("express");
const client = require("prom-client")
const responseTime = require("response-time");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expresslayouts = require("express-ejs-layouts");
const { db, mongoURL } = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-startegy");
const MongoStore = require("connect-mongo");
const { options } = require("./routes");
const flash = require("connect-flash");
const customMware = require("./config/middleware");


const collectDefaultMetrics = client.collectDefaultMetrics;

const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "this tells how much time is taken by req and res",
  labelNames:["method","route","status_code"],
  buckets: [1, 5, 15, 50, 100, 500 ,1000,2000]
});

const totalRequests = new client.Counter({
  name:'total_requests',
  help:'this tells the total number of requests',
})

//? middleware to parse the form data
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static("./assets"));

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

app.use(responseTime((req, res, time) => {
  totalRequests.inc();
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    })
    .observe(time);
}));

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});


// todo try creating a form for comment with each posts and getting the data back to the controller and saving it in the db 