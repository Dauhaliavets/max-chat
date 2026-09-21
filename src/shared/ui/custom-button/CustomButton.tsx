import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react";
import styles from "./CustomButton.module.css";

interface ICustomButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  icon?: ReactNode;
}

export const CustomButton: FC<ICustomButton> = (props) => {
  const { variant = "primary", icon } = props;

  const className =
    variant === "primary"
      ? `${styles.btn} ${styles.primaryBtn}`
      : `${styles.btn}`;

  return (
    <button className={className} {...props}>
      {icon}
    </button>
  );
};
