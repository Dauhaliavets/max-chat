import { baseRequest } from "./baseRequest";

interface IGetAvatarResponse {
  urlAvatar: string;
}

const getAvatar = async (
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
): Promise<IGetAvatarResponse | null> => {
  const path = `/waInstance${idInstance}/getAvatar/${apiTokenInstance}`;

  const response = await baseRequest(path, "POST", { chatId });

  if (response.ok) {
    const json = (await response.json()) as IGetAvatarResponse;

    return json;
  }

  return null;
};

export { getAvatar };
