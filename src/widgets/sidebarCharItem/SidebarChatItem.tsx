import React, { useEffect, useState } from "react";
import { useAppContext } from "../../app/contexts/appContext/appContext";
import { getAvatar } from "../../shared/api/getAvatar";
import type { IChat } from "../../shared/types";
import styles from "./SidebarChatItem.module.css";

interface ISidebarChatItemProps {
  chat: IChat;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarChatItem = React.memo<ISidebarChatItemProps>((props) => {
  const { chat, isActive, onClick } = props;
  const [avatar, setAvatar] = useState("");
  const { credentials } = useAppContext();

  useEffect(() => {
    const fetchAvatar = async () => {
      if (credentials) {
        const { idInstance, apiTokenInstance } = credentials;
        const data = await getAvatar(idInstance, apiTokenInstance, chat.chatId);

        if (data) {
          setAvatar(data.urlAvatar);
        }
      }
    };

    fetchAvatar();
  }, [credentials, chat.chatId]);

  return (
    <div
      key={chat.chatId}
      className={`${styles.chatItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.avatarContainer}>
        {avatar ? (
          <img src={avatar} alt={chat.name} className={styles.avatar} />
        ) : (
          <div className={`${styles.avatar} ${styles.avatarDefault}`}>
            {chat.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.chatInfo}>
        <div className={styles.chatInfoTop}>
          <div className={styles.chatNameWrapper}>
            <span className={styles.chatName}>{chat.name}</span>
          </div>
        </div>
        <div className={styles.chatInfoBottom}>
          <div className={styles.chatStatus}>
            {chat.unreadCount ? (
              <span className={styles.unreadBadge}>{chat.unreadCount}</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
