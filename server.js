var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
const hbs = require('hbs');
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var User       = require('./app/models/user');
// require('./config/passport')(passport); // pass passport for configuration

// set up our express application

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('view engine', 'hbs');
// required for passport
app.use(passport.initialize());

// route for home page
app.use('/', express.static('./'));

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({

    clientID        : '726634443799-57gq2cpg1gvhfnobtoiudml1esm6tmsg.apps.googleusercontent.com',
    clientSecret    : 'iSUiJIf6VOMNcaMEwRBaCnMA',
    callbackURL     : 'http://localhost:8080/auth/google/callback'

},
function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google

    process.nextTick(function() {
      console.log("hello");
      console.log(profile.displayName);
      return done(null, profile); //akash

});

}));
// route for login form
// route for processing the login form
// route for signup form
// route for processing the signup form

// route for showing the profile page
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.hbs', {
      name: profile.displayName
    });
});

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/google',
passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        }));

app.listen(port, () => {
  console.log('The magic happens on port ' + port);
});
