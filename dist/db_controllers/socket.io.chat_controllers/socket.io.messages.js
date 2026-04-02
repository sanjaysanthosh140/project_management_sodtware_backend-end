"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat_controllers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chat_controllers = (modules) => {
    return {
        store_messages: async (authToken, message_data) => {
            try {
                console.log("from chat controller", authToken);
                console.log("from chat controller", authToken, message_data);
                let decodedToken = jsonwebtoken_1.default.verify(authToken, "secret_key");
                console.log(message_data);
                console.log(decodedToken.id);
                const messages = await new modules({
                    sender: decodedToken.id,
                    name: message_data.from,
                    message: message_data.text,
                    chatType: message_data.chatType,
                    department: message_data.room,
                    group: message_data.room,
                    time: message_data.time,
                });
                let data = await messages.save();
                console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        },
    };
};
exports.chat_controllers = chat_controllers;
