import { useState, type ChangeEvent, type FC } from "react";
import { useLocation, useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdArrowUp } from "react-icons/io";
import { useAppContext } from "../../app/contexts/appContext/appContext";
import type { IMessageBody } from "../../shared/types";
import { CustomButton } from "../../shared/ui/custom-button/CustomButton";
import { sendMessage } from "../../shared/api/sendMessage";
import styles from "./ChatWindow.module.css";

interface IChatProps {
  messages: IMessageBody[];
  chatId?: string;
}

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: IMessageBody;
}

export const ChatWindow: FC<IChatProps> = ({ chatId, messages }) => {
  const { credentials } = useAppContext();
  const [message, setMessage] = useState<string>("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleResetActiveChat = () => navigate("/");

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!credentials || !chatId || !message) {
      return;
    }

    try {
      const { idInstance, apiTokenInstance } = credentials;

      const messageToSend = message;
      setMessage("");

      await sendMessage(idInstance, apiTokenInstance, {
        chatId,
        message: messageToSend,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!chatId) {
    return null;
  }

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <CustomButton
          variant="ghost"
          icon={<FiArrowLeft size={20} color="#7f91a4" />}
          onClick={handleResetActiveChat}
        />
        {state?.chatName ? (
          <div className={styles.chatHeaderInfo}>
            <h3 className={styles.chatTitle}>{state.chatName || ""}</h3>
          </div>
        ) : null}
      </div>

      <div className={styles.messagesArea}>
        <div className={styles.messagesList}>
          {messages.map((msg) => (
            <div key={msg.idMessage} className={styles.messageBubble}>
              <span className={styles.messageText}>
                {msg.messageData.textMessageData?.textMessage}
              </span>
              <div className={styles.messageMeta}>
                <span className={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Сообщение"
            className={styles.messageInput}
            onChange={handleChangeMessage}
          />
          <CustomButton
            icon={<IoMdArrowUp size={20} color="#ffffff" />}
            disabled={!message}
          />
        </form>
      </div>
    </div>
  );
};
