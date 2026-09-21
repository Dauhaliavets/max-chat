import { baseRequest } from "./baseRequest";

const sendMessage = async (
  idInstance: string,
  apiTokenInstance: string,
  body: {
    chatId: string;
    message: string;
    typingTime?: number;
    quotedMessageId?: string;
  },
) => {
  const path = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

  const response = await baseRequest(path, "POST", body);

  return response;
};

export { sendMessage };
