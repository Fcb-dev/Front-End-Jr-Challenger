import * as Label from "@radix-ui/react-label";
import * as Tooltip from "@radix-ui/react-tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import styles from "./index.module.css";

interface TextInputProps {
  label: React.ReactNode;
  type: string;
  id: string;
  error: boolean;
  helperText?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  tooltip?: boolean;
  tooltipText?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, type, id, error, helperText, value, onChange, tooltip, tooltipText, ...inputProps }, ref) => {
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
          ref={ref}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
        {error && helperText && <span className={styles.errorText}>{helperText}</span>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
