var express  = require('express');
var app      = express();
var profile = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
const hbs = require('hbs');
var bodyParser  	= 	require('body-parser');
var session      = require('express-session');
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var {Post} = require('./app/models/user');
var {mongoose} = require('./app/dbhandler');

// set up our express application

app.set('view engine', 'hbs');
// required for passport
app.use(passport.initialize());
app.use(session({ secret: 'secret',saveUninitialized: true,resave: true })); // session secret
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// route for home page
app.use('/', express.static('./'));
app.use('/profile', profile);

function getPost() {
  return Post.find().then((docs) => {
    resolve(docs);
  });
}

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  console.log('serialize');
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  console.log('deserialize');
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

    process.nextTick(function() {
      console.log("hello");
      var user = {
        name: profile.displayName,
        email: profile.emails[0]
      }
      return done(null, user);
});

}));
// route for login form
// route for processing the login form
// route for signup form
// route for processing the signup form

// route for showing the profile page
app.get('/profile',  function(req, res) {
  console.log('in GET /profile');
  sessionTemp = req.sessionStore.sessions;
  sessionTemp1 = sessionTemp[req.sessionID];
  var temp = JSON.parse(sessionTemp1).passport.user;
    var tempUser = {
      name: temp.name,
      email: temp.email.value
    }
    Post.find().then((docs) => {
      return docs;
    }).then( (docs) => {
        res.render('profile.hbs', {
          name: tempUser.name,
          data: docs
        });
    });
});

// route for logging out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

app.post('/postData', (req, res) => {
  console.log(req.body);
  var user = new Post({
    text: req.body.postData,
    name: req.body.name
  });
  user.save().then((doc) => {
    console.log(doc);
  });
  res.send();
});
app.get('/comment', (req, res) => {
  console.log('in comment');
  console.log(req.query);
    Post.findById("59bcf71a124a863b54f1ca87").then((data) => {
      return data;
    }).then((data) => {
      console.log('in render');
      res.render('comment.hbs', {
        name: data.name,
        text: data.text
      });
    });
});

app.listen(port, () => {
  console.log('The magic happens on port ' + port);
});
