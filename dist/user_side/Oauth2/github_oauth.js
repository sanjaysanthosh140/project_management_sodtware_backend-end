"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const dotenv_1 = __importDefault(require("dotenv"));
const user_auth_1 = require("../user_auth");
const oauth_schema_1 = __importDefault(require("../../db_controllers/db_models/task_schemas/oautg_schemas/oauth_schema"));
const oauth_token_1 = __importDefault(require("../../web_tokens/oauth_token"));
dotenv_1.default.config({ path: "../env" });
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: oauth_token_1.default[1].git_hub_client_id,
    clientSecret: oauth_token_1.default[1].git_hub_client_secret,
    callbackURL: "http://localhost:8080/git_hub/oauth/callback",
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    (0, user_auth_1.getGithubEmail)(accessToken).then((data) => {
        //console.log("github email",data[0].email);
        // console.log("github profile", profile.id, profile.username, profile.photos[0].value);
        const authObj = new oauth_schema_1.default({
            googleId: profile.id,
            displayName: data[0].email,
            profileUrl: profile.photos[0].value || "",
        });
        authObj
            .save()
            .then((data) => {
            console.log("github oauth user saved:", data);
            done(null, data);
        })
            .catch((error) => {
            console.log(error);
        });
    });
    // console.log("profile", profile);
}));
passport_1.default.serializeUser((user, done) => {
    // console.log("serialize user:", user);
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    oauth_schema_1.default
        .findById(id)
        .then((user) => {
        done(null, user);
    })
        .catch((error) => {
        done(error, null);
    });
});
exports.default = passport_1.default;
