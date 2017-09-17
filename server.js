var express  = require('express');
var passport = require('passport');
const hbs = require('hbs');
var bodyParser  	= 	require('body-parser');
var session      = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var {Post} = require('./app/models/user');
var {mongoose} = require('./app/dbhandler');

// set up our express application

var app      = express();
var profile = express();
var port     = process.env.PORT || 8080;

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

// GET profile route
app.get('/profile',  function(req, res) {
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

//POST the post
app.post('/postData', (req, res) => {
  var user = new Post({
    text: req.body.postData,
    name: req.body.name
  });
  user.save().then((doc) => {
  });
  res.send();
});

//GET the post
profile.get('/:id', (req, res) => {
  sessionTemp = req.sessionStore.sessions;
  sessionTemp1 = sessionTemp[req.sessionID];
  var temp = JSON.parse(sessionTemp1).passport.user;
    var tempUser = {
      name: temp.name,
      email: temp.email.value
    }
  Post.findById(req.params.id).then((data) => {
    return data;
  }).then((data) => {
    if(data.comment == null)
    {
      res.render('comment.hbs', {
        userName: tempUser.name,
        name: data.name,
        text: data.text,
      });
    }
    var temp = {
      commentName: data.comment.commentName,
      commentData: data.comment.commentData
    }
    res.render('comment.hbs', {
      userName: tempUser.name,
      name: data.name,
      text: data.text,
      data: data.comment
    });

  });
});

//comment on the post
profile.post('/postComment', (req, res) => {
  var temp = {
    commentName: req.body.name,
    commentData: req.body.postComment
  }
  Post.findById(req.body.id).then((doc) => {
    doc.comment.push(temp);
    doc.save().then((data) => {
      res.send();
    });
  });
});
app.listen(port, () => {
  console.log('The magic happens on port ' + port);
});
