"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_authorization = exports.user_auth = void 0;
exports.getGithubEmail = getGithubEmail;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let hash2password;
const user_auth = (name, email, department, password) => {
    return new Promise((resolver, reject) => {
        //create account  & sign-up
        if (name && email && department && password) {
            // console.log(name, email, password);
            let saltrount = 10;
            let salt = bcrypt_1.default.genSaltSync(saltrount);
            let hash2 = bcrypt_1.default.hashSync(password, salt);
            const user_obj = new user_schema_1.default({
                name: name,
                email: email,
                department: department,
                password: hash2,
                active: true,
            });
            user_obj
                .save()
                .then((data) => {
                if (data)
                    resolver(true);
            })
                .catch((error) => {
                reject(error);
            });
        }
    });
};
exports.user_auth = user_auth;
const user_authorization = (email, password) => {
    // login
    return new Promise((resolve, reject) => {
        let token = null;
        user_schema_1.default
            .find({ email: email })
            .then((data) => {
            if (data.length > 0) {
                let id = data[0]._id;
                const token = jsonwebtoken_1.default.sign({ id }, "secret_key");
                let hash = data[0].password;
                let res = bcrypt_1.default.compareSync(password, hash);
                res ? resolve(token) : reject(false);
            }
            else {
                resolve(false);
            }
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.user_authorization = user_authorization;
//  custom api call to get read user sensetive datas
function getGithubEmail(accessToken) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch("https://api.github.com/user/emails", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "your-app-name", // GitHub REQUIRES this
            },
        });
        if (!response.ok) {
            reject(`GitHub API error: ${response.status}`);
        }
        const emails = await response.json();
        console.log("emails", emails);
        resolve(emails);
        // if (emails) {
        //     const response = await fetch(
        //         'https://api.github.com/user/repos?visibility=private',
        //         {
        //             method: 'GET',
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //                 Accept: 'application/vnd.github+json',
        //                 'User-Agent': 'your-app-name' // GitHub REQUIRES this
        //             }
        //         }
        //     );
        //     if (!response.ok) {
        //         reject(`GitHub API error: ${response.status}`)
        //     }
        //     const repos = await response.json();
        //     //  console.log("repose",repos);
        //     resolve(repos);
        // }
    });
}
