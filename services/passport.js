const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    User.findById(id).then(
        user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
    clientID:keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({googleID:profile.id})
    // .then((user) => console.log(user))
    // .catch((err)=>console.log(err));
    // console.log(user.id);
    .then((existingUser)=> {
        if (existingUser){
            console.log("Profile already exists");
            done(null,existingUser);
        }
        else {
            new User({ googleID: profile.id}).save().then(user => done(null, user));
        }
    })
})
);