import { baseRequest } from "./baseRequest";

interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache: boolean;
}

const checkAccount = async (
  idInstance: string,
  apiTokenInstance: string,
  body: { phoneNumber: number; force?: boolean },
): Promise<CheckAccountResponse | null> => {
  const path = `/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;

  const response = await baseRequest(path, "POST", body);

  if (response.ok) {
    const data = (await response.json()) as CheckAccountResponse;

    return data;
  }

  return null;
};

export { checkAccount };
