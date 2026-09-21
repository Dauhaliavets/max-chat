import { baseRequest } from "./baseRequest";

const getSettings = async (idInstance: string, apiTokenInstance: string) => {
  const path = `/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

  const response = await baseRequest(path);

  return response;
};

export { getSettings };
