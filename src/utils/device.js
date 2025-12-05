import { v4 as uuidv4 } from "uuid";

export function getClientUUID() {
  let uuid = localStorage.getItem("Client-Device-Uuid");

  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem("Client-Device-Uuid", uuid);
  }

  return uuid;
}
