import passport from "passport";
import { UsersManagerDB } from "./DAL/dao/mongoDao/users.dao.mongo.js"
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { hashData, compareData } from "./utils/utils.js";
import { objConfigEnv } from "./config/config.js";
import { cartManagerBD } from "./DAL/dao/mongoDao/carts.dao.mongo.js";
import { UsersRequestDto } from "./DAL/dtos/users-request.dto.js";
import { CustomError } from "./errors/error.generator.js";
import { errorsMessages } from "./errors/errors.enum.js";
import { findByEmailServ } from "./services/users.service.js";

const usersManagerDB = new UsersManagerDB();


const SECRETJWT = objConfigEnv.secret_jwt;

passport.use("signup", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, email, password, done) => {


    const { name, last_name } = req.body

    if (!email || !password || !name || !last_name) {

        return done(null, false, { message: 'All fields are required' })

    }

    try {

        const hashedPassword = await hashData(password);

        let correoAdmin = "administradorCAA@coder.com";

        const createdCart = await cartManagerBD.createOne()

        //ACA DTO
        const userDtoReq = new UsersRequestDto({ ...req.body, cart: createdCart._id, password: hashedPassword })
        let createUser;

        if (email === correoAdmin) {

            createUser = await usersManagerDB.createOne({ ...userDtoReq, roles: "admin" });
            return done(null, createUser)
        }


        createUser = await usersManagerDB.createOne(userDtoReq);

        done(null, createUser)


    } catch (error) {


        done(error)
    }
}))


passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {


    try {

        if (!email || !password) {


            return done(null, false, { message: "All fields are required LOGIN" })

        }


        const user = await usersManagerDB.findByEmail(email);

        if (!user) {

            return done(null, false, { message: "Incorrect email or password" })
        }


        const passwordValdHash = await compareData(password, user.password);

        if (!passwordValdHash) {


            return done(null, false, { message: "Incorrect email or password" })

        }

        //console.log( user);

        done(null, user)

    } catch (error) {

        console.log("LOCAAAAAA");
        done(error)
    }
}))



//NUEVO JWT
/*
const fromCookies = (req) => {
   

    if (!req.cookies.token) {

       // console.log('ACA REQ',req.cookies);

     console.log("ERROR ACA EN PASSPORT.JS"); 

     return CustomError.generateError(errorsMessages.USER_NOT_LOGGED_IN, 401)

      

    }

   

    return req.cookies.token

}
*/

const fromCookies = (req) => {
    let token = null;
    if (req?.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
/*
passport.use("current", new JWTStrategy(

    {

        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: SECRETJWT,

    },

    

    (jwt_payload, done) => {

        done(null, jwt_payload)

    }


))

*/


// current descrifra el token, busca el usurio por el mail que me esta llegando y lo devuelve

passport.use("current",
    new JWTStrategy(

        {

            jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
            secretOrKey: SECRETJWT,

        },

        async (jwt_payload, done) => {
            try {
                const user = await findByEmailServ(jwt_payload.email);
                if (!user) {
                    return done(null, false);
                }
                if (user) {
                    return done(null, user);
                }
            } catch (error) {
                return done(error, false);
            }
        })
);



passport.use("github", new GitHubStrategy({
    clientID: 'Iv1.15e1a8911be07618',
    clientSecret: 'bc029f89fd4e4db369b04da8b6d31623b1476e53',
    callbackURL: "http://localhost:8080/api/sessions/callback",
    scope: ["user:email"]
},
    async (accessToken, refreshToken, profile, done) => {



        try {

            const userDB = await usersManagerDB.findByEmail(profile.emails[0].value)

            //login

            if (userDB) {
                if (userDB.isGithub) {

                    return done(null, userDB);

                } else {

                    return done(null, false);
                }

            }

            //signup

            const infoUser = {

                name: profile._json.name.split(' ')[0],

                last_name: profile._json.name.split(' ')[1],

                email: profile.emails[0].value,

                password: " ",

                isGithub: true
            }

            const createdUser = await usersManagerDB.createOne(infoUser);

            done(null, createdUser)

        } catch (error) {

            done(error)

        }


    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})


passport.deserializeUser(async (id, done) => {

    try {

        const user = await usersManagerDB.findById(id)

        done(null, user)

    } catch (error) {

        done(error)

    }


})