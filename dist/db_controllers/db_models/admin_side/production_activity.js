"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const production_activity_modle = new mongoose_2.Schema({
    department: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    floorName: {
        type: String,
        required: false,
    },
    fromTime: {
        type: String,
        require: true,
    },
    toTime: {
        type: String,
        required: true,
    },
    timeIn: {
        type: String,
        required: false,
    },
    timeOut: {
        type: String,
        required: false,
    },
    advance: {
        type: String,
        required: false,
    },
    finalAmount: {
        type: String,
        required: false,
    },
    additionalRequirements: {
        type: String,
        required: false,
    },
    allocatedBy: {
        type: String,
        required: true,
    },
    head_id: {
        type: String,
        required: false,
    },
});
const production_team_model = mongoose_1.default.model("production_activity", production_activity_modle);
exports.default = production_team_model;
