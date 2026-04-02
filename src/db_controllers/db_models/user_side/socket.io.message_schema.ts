import mongoose, { Schema } from "mongoose";

interface message {
  sender: string;
  name: string;
  message: string;
  chatType: string;
  department: any;
  group:any
  time: string;
}

const message_schemas = new Schema<message>(
  {
    sender: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chatType: {
      type: String,
      enum: ["department", "group"],
      required: true,
    },
    department: {
      type: String,
      default:null,
      validate:{
        validator:function(v:any){
            if(this.chatType==="department")return !!v;
            return true
        },
        message:"plz provide deparment name"
      }
    },
    group: {
        type: String,
        ref:"Group",
        default:null,
        validate:{
          validator:function(v:any){
              if(this.chatType==="group")return !!v;
              return true
          },
          message:"plz provide group id"
        }
      },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const message_model = mongoose.model("messages", message_schemas);
export default message_model;
