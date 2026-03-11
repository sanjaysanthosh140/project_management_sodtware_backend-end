// import passport from "passport";
// import { Strategy as GithubStatergy } from "passport-github2";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import { getGithubEmail } from "../user_auth";
// import oauth_module from "../../db_controllers/db_models/task_schemas/oautg_schemas/oauth_schema";
// import keys from "../../web_tokens/oauth_token";

// dotenv.config({ path: "../env" });
// passport.use(
//   new GithubStatergy(
//     {
//       clientID: keys[1].git_hub_client_id,
//       clientSecret: keys[1].git_hub_client_secret,
//       callbackURL: "http://localhost:8080/git_hub/oauth/callback",
//     },
//     function (accessToken: any, refreshToken: any, profile: any, done: any) {
//       console.log(profile);
//       getGithubEmail(accessToken).then((data: any) => {
//         //console.log("github email",data[0].email);
//         // console.log("github profile", profile.id, profile.username, profile.photos[0].value);
//         const authObj = new oauth_module({
//           googleId: profile.id,
//           displayName: data[0].email,
//           profileUrl: profile.photos[0].value || "",
//         });
//         authObj
//           .save()
//           .then((data: any) => {
//             console.log("github oauth user saved:", data);
//             done(null, data);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       });

//       // console.log("profile", profile);
//     },
//   ),
// );
// passport.serializeUser((user: any, done) => {
//   // console.log("serialize user:", user);
//   done(null, user._id);
// });

// passport.deserializeUser((id: any, done) => {
//   oauth_module
//     .findById(id)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((error) => {
//       done(error, null);
//     });
// });

// export default passport;
