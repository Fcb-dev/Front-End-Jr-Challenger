import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";
import { TextInput } from "../TextInput/TextInput";
import { Button } from "../Button/Button";
import styles from "./index.module.css";
import { Pencil2Icon } from "@radix-ui/react-icons";

interface Option {
  label: string | number | boolean;
  value: string | number;
  disabled?: boolean;
}

interface Field<T> {
  name: Path<T>;
  label: string;
  placeholder: string;
  type: "text" | "select" | "number";
  validation?: object;
  tooltip?: boolean;
  tooltipText?: string;
  options?: Option[];
  disabled?: boolean;
}

interface FormProps<T> {
  onSubmit: (data: T) => void;
  fields: Field<T>[];
}

export const Form = <T extends FieldValues>({ onSubmit, fields }: FormProps<T>) => {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<T>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    onSubmit(data);
    reset();
  };

  useEffect(() => {
    setIsFormValid(isValid);
  }, [isValid]);

  return (
    <form className={styles.Form}>
      {fields.map((field) => (
        <div key={field.name} className={styles.InputGroup}>
          {(field.type === "text" || field.type === "number") ? (
            <TextInput
              label={field.label}
              type={field.type}
              id={field.name}
              placeholder={field.placeholder}
              error={!!errors[field.name]}
              helperText={String(errors[field.name]?.message)}
              tooltip={field.tooltip}
              tooltipText={String(field.tooltipText)}
              disabled={field.disabled}
              {...register(field.name, field.validation)}
            />
          ) : field.type === "select" && field.options ? (
            <div className={styles.InputGroup}>
              <label htmlFor={field.name} className={styles.LabelRoot}>
                {field.label}
              </label>
              <select
                id={field.name}
                className={styles.Input}
                {...register(field.name, field.validation)}
              >
                {field.options.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value} 
                    disabled={option.disabled}
                    className={option.label === "Selecione um autor" ? styles.Placeholder : ""}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors[field.name] && (
                <span className={styles.ErrorText}>
                  {String(errors[field.name]?.message)}
                </span>
              )}
            </div>
          ) : null}
        </div>
      ))}

      <Button
        type="submit"
        label="Adicionar"
        variant="success"
        onClick={handleSubmit(handleFormSubmit)}
        disabled={!isFormValid}
        icon={<Pencil2Icon />}
        iconPosition="left"
      />
    </form>
  );
};