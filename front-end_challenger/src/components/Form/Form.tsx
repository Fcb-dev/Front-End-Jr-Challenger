import { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues, Path } from "react-hook-form";
import { TextInput } from "../TextInput/TextInput";
import { Button } from "../Button/Button";
import styles from "./index.module.css";
import { Pencil2Icon } from "@radix-ui/react-icons";

interface Field<T> {
  name: Path<T>;
  label: string;
  type: string;
  validation?: object;
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
