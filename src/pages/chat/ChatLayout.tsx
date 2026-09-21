import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { ChatWindow } from "../../widgets/chatWindow/ChatWindow";
import { Sidebar } from "../../widgets/sidebar/Sidebar";
import type { IMessageBody } from "../../shared/types";
import { deleteNotification } from "../../shared/api/deleteNotification";
import { receiveNotification } from "../../shared/api/receiveNotification";
import { useAppContext } from "../../app/contexts/appContext/appContext";
import { RECEIVE_TIMEOUT } from "../../app/constants";
import styles from "./ChatLayout.module.css";

export const ChatLayout = () => {
  const [messages, setMessages] = useState<IMessageBody[]>([]);
  const { credentials } = useAppContext();

  const { chatId } = useParams<{ chatId?: string }>();

  const addMessage = useCallback((msg: IMessageBody) => {
    setMessages((prev) => {
      if (prev.some((message) => message.idMessage === msg.idMessage)) {
        return prev;
      }

      return [...prev, msg];
    });
  }, []);

  useEffect(() => {
    if (!credentials) {
      return;
    }

    let cancelled = false;
    const { idInstance, apiTokenInstance } = credentials;

    const pollNotifications = async () => {
      while (!cancelled) {
        try {
          const data = await receiveNotification(
            idInstance,
            apiTokenInstance,
            RECEIVE_TIMEOUT,
          );

          if (cancelled) {
            break;
          }

          if (!data) {
            continue;
          }

          const { receiptId, body } = data;

          if (body.messageData?.typeMessage === "textMessage") {
            addMessage(body);
          }

          await deleteNotification(idInstance, apiTokenInstance, receiptId);
        } catch (error) {
          if (cancelled) {
            break;
          }

          console.error(error);
        }
      }
    };

    pollNotifications();

    return () => {
      cancelled = true;
    };
  }, [credentials, addMessage]);

  const chatMessages = useMemo(
    () => messages.filter((message) => message.senderData?.chatId === chatId),
    [messages, chatId],
  );

  return (
    <div className={styles.chatLayoutWrapper}>
      <Sidebar activeChatId={chatId} />
      <ChatWindow chatId={chatId} messages={chatMessages} />
    </div>
  );
};
