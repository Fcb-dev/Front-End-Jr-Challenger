import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { TextInput } from "../TextInput/TextInput";
import { Button } from "../Button/Button";
import styles from "./index.module.css";

interface Field {
  name: string;
  label: string;
  type: string;
  validation?: object;
}

interface FormProps {
  onSubmit: (data: FieldValues) => void;
  fields: Field[];
}

export const Form: React.FC<FormProps> = ({ onSubmit, fields }) => {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FieldValues>({
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    const storedBooks = JSON.parse(localStorage.getItem("books") || "[]");

    storedBooks.push(data);
    localStorage.setItem("books", JSON.stringify(storedBooks));

    onSubmit(data);
    reset();
  };

  useEffect(() => {
    setIsFormValid(isValid);
  }, [isValid]);

  return (
    <form className={styles.form}>
      {fields.map((field) => (
        <div key={field.name} className={styles.inputGroup}>
          <TextInput
            label={field.label}
            type={field.type}
            id={field.name}
            error={!!errors[field.name]}
            helperText={String(errors[field.name]?.message)}
            {...register(field.name, field.validation)}
          />
        </div>
      ))}

      <Button
        type="submit"
        onClick={handleSubmit(handleFormSubmit)}
        label="Adicionar"
        variant="success"
        disabled={!isFormValid}
      />
    </form>
  );
};