import { Hash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import user_model from "../db_controllers/db_models/user_schema";
import jwt from "jsonwebtoken";
let hash2password: any;
export const user_auth = (
  name: string,
  email: string,
  department: string,
  password: string,
) => {
  return new Promise((resolver, reject) => {
    //create account  & sign-up
    if (name && email && department && password) {
      // console.log(name, email, password);
      let saltrount = 10;
      let salt = bcrypt.genSaltSync(saltrount);
      let hash2 = bcrypt.hashSync(password, salt);
      const user_obj = new user_model({
        name: name,
        email: email,
        department: department,
        password: hash2,
        active: true,
      });
      user_obj
        .save()
        .then((data) => {
          if (data) resolver(true);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export const user_authorization = (email: any, password: string) => {
  // login
  return new Promise((resolve, reject) => {
    let token = null;
    user_model
      .find({ email: email })
      .then((data) => {
        if (data.length > 0) {
          let id = data[0]._id;
          const token = jwt.sign({ id }, "secret_key");
          let hash = data[0].password;
          let res = bcrypt.compareSync(password, hash);
          res ? resolve(token) : reject(false);
        }else{
          resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//  custom api call to get read user sensetive datas

export function getGithubEmail(accessToken: any) {
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
