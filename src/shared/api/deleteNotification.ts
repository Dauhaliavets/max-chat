import { baseRequest } from "./baseRequest";

const deleteNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number,
) => {
  const path = `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  const response = await baseRequest(path, "DELETE");

  return response;
};

export { deleteNotification };
