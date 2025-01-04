import * as Label from "@radix-ui/react-label";
import React from "react";
import styles from "./index.module.css";

interface TextInputProps {
  label: React.ReactNode;
  type: string;
  id: string;
  error: boolean;
  helperText?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, type, id, error, helperText, ...inputProps }, ref) => {
    return (
      <div className={styles.TextInput}>
        <Label.Root className={styles.LabelRoot} htmlFor={id}>
          {label}
        </Label.Root>
        <input
          className={`${styles.Input} ${error ? styles.InputError : ""}`}
          type={type}
          id={id}
          ref={ref}
          {...inputProps}
        />
        {error && helperText && <span className={styles.errorText}>{helperText}</span>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
