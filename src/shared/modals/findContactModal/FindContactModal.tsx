import {
  useState,
  type ChangeEvent,
  type FC,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../../app/contexts/appContext/appContext";
import { checkAccount } from "../../api/checkAccount";
import styles from "./FindContactModal.module.css";

interface FindContactModalProps {
  onClose: () => void;
}

export const FindContactModal: FC<FindContactModalProps> = ({ onClose }) => {
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { credentials } = useAppContext();
  const navigate = useNavigate();

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, "");
    setPhone(sanitizedValue);

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!credentials || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { idInstance, apiTokenInstance } = credentials;

      const response = await checkAccount(idInstance, apiTokenInstance, {
        phoneNumber: Number(phone),
      });

      if (response && response.exist) {
        navigate(`/${response.chatId}`);
        onClose();
        return;
      }

      setError("У номера отсутствует MAX аккаунт");
    } catch (error) {
      console.error("error: ", (error as Error).message);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = phone.length < 11 || isLoading;

  return (
    <div className={styles.wrapper} onClick={handleClickOutside}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h4 className={styles.formTitle}>Найти по номеру</h4>
        <div className={styles.field}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              name="phone"
              type="tel"
              minLength={11}
              maxLength={15}
              placeholder="71234567890"
              value={phone}
              onChange={handleChangePhone}
            />
          </div>
          {error ? <p className={styles.errorText}>{error}</p> : null}
        </div>
        <button
          className={styles.button}
          type="submit"
          disabled={isSubmitDisabled}
        >
          {isLoading ? "Поиск..." : "Найти в MAX"}
        </button>
      </form>
    </div>
  );
};
