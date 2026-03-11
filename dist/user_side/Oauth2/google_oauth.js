"use strict";
// import dotenv from "dotenv";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
Object.defineProperty(exports, "__esModule", { value: true });
// import oauth_module from "../../db_controllers/db_models/task_schemas/oautg_schemas/oauth_schema";
// import keys from "../../web_tokens/oauth_token";
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys[0].GOOGLE_CLIENT_ID,
//       clientSecret: keys[0].GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8080/oauth2/redirect/google",
//     },
//     function (accessToken, refreshToken, profile: any, done) {
//       const oauthObj = new oauth_module({
//         googleId: profile.id,
//         displayName: profile.displayName,
//         profileUrl: profile.photos?.[0].value || "",
//       });
//       console.log(oauthObj);
//       oauthObj
//         .save()
//         .then((data) => {
//           console.log("OAuth user saved:", data);
//           return done(null, data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     },
//   ),
// );
// passport.serializeUser((user: any, done) => {
//   let id = user._id;
//   done(null, id);
// });
// passport.deserializeUser((id: any, done) => {
//   oauth_module.findById(id).then((user: any) => {
//     done(null, user);
//   });
// });
// export default passport;
