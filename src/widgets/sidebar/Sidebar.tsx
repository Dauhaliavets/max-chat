import { useCallback, useEffect, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import { useAppContext } from "../../app/contexts/appContext/appContext";
import { FindContactModal } from "../../shared/modals/findContactModal/FindContactModal";
import { SidebarChatItem } from "../sidebarCharItem/SidebarChatItem";
import { CustomButton } from "../../shared/ui/custom-button/CustomButton";
import { getChats } from "../../shared/api/getChats";
import type { IChat } from "../../shared/types";
import styles from "./Sibebar.module.css";

interface ISidebarProps {
  activeChatId?: string;
}

export const Sidebar: FC<ISidebarProps> = ({ activeChatId }) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { credentials } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!credentials) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fetchChats = async () => {
      setIsLoading(true);

      try {
        const { idInstance, apiTokenInstance } = credentials;
        const response = await getChats(
          idInstance,
          apiTokenInstance,
          controller.signal,
        );

        if (!cancelled) {
          setChats(response);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [credentials]);

  const handleSelectChat = useCallback(
    (chatId: string, chatName: string) => {
      if (chatId === activeChatId) {
        return;
      }

      navigate(`/${chatId}`, { state: { chatName } });
    },
    [activeChatId, navigate],
  );

  const onOpenFindContactModal = () => setOpen(true);
  const onCloseFindContactModal = () => setOpen(false);

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Чаты</h3>
        <CustomButton
          icon={<FiPlus size={20} color="white" />}
          onClick={onOpenFindContactModal}
        />
        {open &&
          createPortal(
            <FindContactModal onClose={onCloseFindContactModal} />,
            document.body,
          )}
      </div>

      <div className={styles.chatList}>
        {isLoading && <span>Загрузка чатов...</span>}
        {chats.map((chat) => (
          <SidebarChatItem
            chat={chat}
            isActive={activeChatId === chat.chatId}
            onClick={() => handleSelectChat(chat.chatId, chat.name)}
          />
        ))}
      </div>
    </div>
  );
};
