"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const oauth_schema_1 = __importDefault(require("../../db_controllers/db_models/task_schemas/oautg_schemas/oauth_schema"));
const oauth_token_1 = __importDefault(require("../../web_tokens/oauth_token"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: oauth_token_1.default[0].GOOGLE_CLIENT_ID,
    clientSecret: oauth_token_1.default[0].GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/oauth2/redirect/google",
}, function (accessToken, refreshToken, profile, done) {
    const oauthObj = new oauth_schema_1.default({
        googleId: profile.id,
        displayName: profile.displayName,
        profileUrl: profile.photos?.[0].value || "",
    });
    console.log(oauthObj);
    oauthObj
        .save()
        .then((data) => {
        console.log("OAuth user saved:", data);
        return done(null, data);
    })
        .catch((error) => {
        console.log(error);
    });
}));
passport_1.default.serializeUser((user, done) => {
    let id = user._id;
    done(null, id);
});
passport_1.default.deserializeUser((id, done) => {
    oauth_schema_1.default.findById(id).then((user) => {
        done(null, user);
    });
});
exports.default = passport_1.default;
