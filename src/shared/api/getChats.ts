import type { IChat } from "../types";
import { baseRequest } from "./baseRequest";

const getChats = async (
  idInstance: string,
  apiTokenInstance: string,
  signal?: AbortSignal,
): Promise<IChat[]> => {
  const path = `/waInstance${idInstance}/getChats/${apiTokenInstance}`;

  const response = await baseRequest(path, "GET", null, signal);
  const json = (await response.json()) as IChat[];

  return json;
};

export { getChats };
