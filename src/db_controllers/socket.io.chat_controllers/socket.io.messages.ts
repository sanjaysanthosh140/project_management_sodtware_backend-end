import jwt from "jsonwebtoken";
export const chat_controllers = (modules: any) => {
  return {
    store_messages: async (authToken: string, message_data: any) => {
      try {
        console.log("from chat controller", authToken);
        console.log("from chat controller", authToken, message_data);
        let decodedToken: any = jwt.verify(authToken, "secret_key");
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
      } catch (error) {
        console.log(error);
      }
    },
  };
};
