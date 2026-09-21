import type { IMessageBody } from "../types";
import { baseRequest } from "./baseRequest";

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: IMessageBody;
}

const receiveNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiveTimeout = 10,
): Promise<ReceiveNotificationResponse | null> => {
  const path = `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  const response = await baseRequest(path, "GET");

  const text = await response.text();
  if (!text || text.trim() === "" || text === "null") {
    return null;
  }

  // На всякий случай: сервер может ответить 200 с мусором.
  // Тогда лучше вернуть null, чем падать ниже по стеку.
  try {
    const parsed = JSON.parse(text) as ReceiveNotificationResponse;
    if (!parsed || typeof parsed.receiptId !== "number" || !parsed.body) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export { receiveNotification };
