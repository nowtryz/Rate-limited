import passport from 'passport'
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt'
import {JWT_SECRET} from './config.mjs'
import User from './user.mjs'

// Configure passport authentication with jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    session: false,
    // No issuer and audience because, once again, best practice goes brrr :)
}, async (jwtPayload, done) => {
    try {
        const user = await User.findOne({_id: jwtPayload.id})
        console.log(user)
        done(null, user || false)
    } catch (err) {
        return done(err, false)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.toObject());
})

passport.deserializeUser((user, done) => {
    done(null, new User(user));
})

export default passport
