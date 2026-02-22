"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function connect_db() {
    // await mongoose.connect("mongodb://localhost:27017/").then((data) => {
    //   try {
    //     console.log("db conneted");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });
    await mongoose_1.default.connect("mongodb+srv://GodorWhat:sanjuxcode@cluster0.odmsvkv.mongodb.net/?appName=Cluster0").then((data) => {
        console.log("db connected");
    }).catch((error) => {
        console.log(error);
    });
}
exports.default = connect_db;
