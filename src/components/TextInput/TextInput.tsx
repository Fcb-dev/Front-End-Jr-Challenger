import * as Label from "@radix-ui/react-label";
import * as Tooltip from "@radix-ui/react-tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import styles from "./index.module.css";

interface TextInputProps {
  label: React.ReactNode;
  type: string;
  id: string;
  placeholder: string;
  error: boolean;
  helperText?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  tooltip?: boolean;
  tooltipText?: string;
  disabled?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, type, id, placeholder, error, helperText, value, onChange, tooltip, tooltipText, disabled = false, ...inputProps }, ref) => {
    return (
      <div className={styles.TextInput}>
        <div>
          <Label.Root className={styles.LabelRoot} htmlFor={id}>
            {label}
          </Label.Root>
          {tooltip &&
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className={styles.IconButton}>
                    <InfoCircledIcon />
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.TooltipContent} sideOffset={5}>
                    {tooltipText}
                    <Tooltip.Arrow className={styles.TooltipArrow} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          }
        </div>
        <input
          className={`${styles.Input} ${error ? styles.InputError : ""}`}
          type={type}
          id={id}
          placeholder={placeholder}
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onKeyDown={(e) => {
            if (id === "pages" && !/[0-9]/.test(e.key) && 
                e.key !== "Backspace" && 
                e.key !== "Delete" && 
                e.key !== "ArrowLeft" && 
                e.key !== "ArrowRight") {
              e.preventDefault();
            }
          }}
          {...inputProps}
        />
        {error && helperText && <span className={styles.ErrorText}>{helperText}</span>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";