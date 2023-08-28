const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expresslayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-startegy');
const MongoStore = require('connect-mongo');
const { options } = require('./routes');



app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expresslayouts); 
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);



//* setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//todo mongo store is used to store the session cookie in the db

app.use(session({
    name:'codeial',
    //todo change the secret before deployment
    secret:'blahsomething',
    resave: false,             // Add this line
    saveUninitialized: false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/codeil_development',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`)
});



