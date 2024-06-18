const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport,getUserByEmail,getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if(!user){
            return done(null,false,{message: "Authentication failed"})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user);
            }else{
                return done(null,false,{message: "Incorrect Password"});
            }
        }catch(e){
            return done(e);
        }
    }
    

    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser));
    passport.serializeUser((user,done) => { 
        return done(null,user.id);
    });
    passport.deserializeUser(async (id,done) => {
        let user = await getUserById(id);
        done(null,user)
    });
}

module.exports = initialize