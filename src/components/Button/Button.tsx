import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  type: "button" | "submit";
  error?: boolean; // Novo prop para passar o erro
  icon?: React.ReactNode; // Novo prop para o ícone
  iconPosition?: "left" | "right"; // Posição do ícone
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      onClick,
      variant = "primary",
      size = "medium",
      disabled = false,
      type,
      error = false, // Usar prop error
      icon,
      iconPosition = "left", // Posição do ícone padrão
    },
    ref
  ) => {
    const variantClass = styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`];
    const sizeClass = styles[size];
    const buttonClasses = `${styles.button} ${variantClass || ""} ${sizeClass || ""} ${error ? styles.errorButton : ""}`;

    return (
      <button
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled || error} // Desabilitar caso haja erro
        type={type}
        ref={ref} // Encaminha o ref para o elemento botão
      >
        {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
        <span>{label}</span>
        {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";