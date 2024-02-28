import { io } from "socket.io-client";
import { messagesStore } from "../state/messages";

const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log("Successfully connected to socket");
});

socket.on("messages", (messages) => {
  if (!Array.isArray(messages)) {
    return;
  }

  let limitedMessages = messages.filter((_, index) => {
    return index < 25;
  });

  messagesStore.set(limitedMessages);
});

export function sendMessage(content, id) {
  return new Promise((resolve, reject) => {
    socket.emit("message", content, id, (response) => {
      const error = response.error;

      if (error) {
        if (typeof error !== "string") {
          reject({ error: "Error sending message" });

          return;
        }

        reject({ error });

        return;
      }

      const message = response.message;

      if (!message || typeof message !== "string") {
        reject({ error: "Unexpected result from server" });

        return;
      }

      resolve({ message });
    });
  }
  );
}
