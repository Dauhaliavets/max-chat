export interface ICredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface IMessageBody {
  typeWebhook: string;
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    chatName: string;
    chatType: string;
    sender: string;
    senderName: string;
    senderType: string;
    senderContactName: string;
    senderPhoneNumber: number;
  };
  messageData: {
    typeMessage: string;
    textMessageData: {
      forwardingScore: number;
      isForwarded: boolean;
      textMessage: string;
    };
  };
}

export interface IChat {
  chatId: string;
  phoneNumber: string;
  name: string;
  type: "user" | "group" | "channel" | "bot";
  unreadCount: number;
}
