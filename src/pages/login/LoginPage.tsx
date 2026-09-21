import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../app/contexts/appContext/appContext";
import { STORAGE_KEY } from "../../app/constants";
import { getSettings } from "../../shared/api/getSettings";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setCredentials } = useAppContext();
  const navigate = useNavigate();

  const handleChangeIdInstance = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }

    setIdInstance(e.target.value);
  };

  const handleChangeApiTokenInstance = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }

    setApiTokenInstance(e.target.value);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!idInstance || !apiTokenInstance) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getSettings(idInstance, apiTokenInstance);

      const credentials = {
        idInstance,
        apiTokenInstance,
      };

      if (response.ok) {
        setCredentials(credentials);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
        navigate("/");
      }

      if (response.status === 401) {
        throw new Error(
          "Unauthorized: Проблема с авторизацией, проверьте корректность указания apiTokenInstance, partnerToken",
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Forbidden: Проблема с аутентификацией, проверьте корректность указания idInstance и адрес запроса",
        );
      }

      if (response.status === 404) {
        throw new Error("Not found: Некорректный метод запроса");
      }
    } catch (error) {
      console.error("error: ", (error as Error).message);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !idInstance || !apiTokenInstance;

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.fieldName}>Введите idInstance</span>
          <input
            className={styles.input}
            type="text"
            value={idInstance}
            onChange={handleChangeIdInstance}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>Введите apiTokenInstance</span>
          <input
            className={styles.input}
            type="text"
            value={apiTokenInstance}
            onChange={handleChangeApiTokenInstance}
          />
        </div>

        {error ? <span className={styles.errorMsg}>{error}</span> : null}
        <button
          className={styles.button}
          type="submit"
          disabled={isSubmitDisabled}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};
