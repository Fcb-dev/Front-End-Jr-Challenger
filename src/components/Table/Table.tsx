import React, { useState } from "react";
import { Button } from "../Button/Button";
import { Toaster } from "../Toast/Toast";
import * as Dialog from "@radix-ui/react-dialog";
import { ExclamationTriangleIcon, ResetIcon, TrashIcon } from "@radix-ui/react-icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./index.module.css";

interface TableProps<T extends Record<string, React.ReactNode>> {
  data: T[];
  columns: Array<{ label: string; accessor: keyof T }>;
  storageKey: string;
  onDataChange: (updatedData: T[]) => void;
}

type ToastType = "error" | "success";

interface ToastConfig {
  type: ToastType;
  title: string;
  description: string;
}

export const Table = <T extends Record<string, React.ReactNode>>({
  data,
  columns,
  storageKey,
  onDataChange,
}: TableProps<T>) => {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    type: "error",
    title: "",
    description: "",
  });

  const handleRowClick = (row: T) => {
    setSelectedRow(row);
  };

  const handleDelete = () => {
    if (!selectedRow) return;

    const storedData: T[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const books: T[] = JSON.parse(localStorage.getItem("books") || "[]");

    const isAuthor = storageKey === "authors";

    if(isAuthor) {
      const isAuthorLinkedToBook = books.some(
        (book) => book.author_id == selectedRow.id
      );
  
      if (isAuthorLinkedToBook) {
        setToastConfig({
          type: "error",
          title: "Erro ao excluir",
          description: "Não é possível excluir esse autor, pois ele está associado a um ou mais livros!"
        });
        setOpenToast(true)
        return;
      }
    }
    
    const updatedData = storedData.filter(
      (item) =>
        !columns.every(
          (column) => item[column.accessor] === selectedRow[column.accessor]
        )
    );

    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    onDataChange(updatedData);

    setSelectedRow(null);
    setIsAlertOpen(false);
    if(storageKey === "books"){
      setToastConfig({
        type: "success",
        title: "Excluído com sucesso!",
        description: "O livro foi excluído com sucesso!"
      });
    }else {
      setToastConfig({
        type: "success",
        title: "Excluído com sucesso!",
        description: "O autor foi excluído com sucesso!"
      });
    }
    setOpenToast(true)
  };

  const openAlertDialog = () => {
    setIsAlertOpen(true);
  };

  return (
    <div className={styles.TableContainer}>
      <table className={styles.CustomTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} onClick={() => handleRowClick(row)}>
                {columns.map((column) => (
                  <td key={String(column.accessor)}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.NoDataMessage}>
                Nenhum dado para ser exibido.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog.Root open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <Dialog.Trigger asChild>
          <button style={{ display: "none" }}>Abrir Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={styles.DialogContent}>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.DialogTitle}>{storageKey === "books" ? "Detalhes do livro" : "Detalhes do autor"}</Dialog.Title>
            {selectedRow && (
              <div className={styles.DialogRowContent}>
                {columns.map((column) => (
                  <p key={String(column.accessor)}>
                    <strong>{column.label}:</strong> {selectedRow[column.accessor]}
                  </p>
                ))}
              </div>
            )}
            <div className={styles.Footer}>
              <Button
                type="button"
                onClick={openAlertDialog}
                label="Excluir"
                variant="danger"
                icon={<TrashIcon />}
                iconPosition="left"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog.Root open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.DialogAlertOverlay} />
          <AlertDialog.Content className={styles.DialogContent}>
            <AlertDialog.Title className={styles.DialogTitle}>
              Tem certeza que deseja excluir?
            </AlertDialog.Title>
            <div className={styles.BoxIconAlert}>
              <ExclamationTriangleIcon className={styles.IconAlert}/>
            </div>
            <AlertDialog.Description className={styles.DialogAlertDescription}>
              Essa ação não pode ser desfeita.
            </AlertDialog.Description>
            <div className={styles.DialogAlertFooter}>
              <AlertDialog.Cancel asChild>
                <Button
                  type="button"
                  onClick={() => setIsAlertOpen(false)}
                  label="Cancelar"
                  variant="primary"
                  icon={<ResetIcon />}
                  iconPosition="left"
                />
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  type="button"
                  onClick={handleDelete}
                  label="Deletar"
                  variant="danger"
                  icon={<TrashIcon />}
                  iconPosition="left"
                />
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <Toaster
        open={openToast}
        setOpen={setOpenToast}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
      />
    </div>
  );
};

