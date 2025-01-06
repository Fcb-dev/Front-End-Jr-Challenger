import React, { useState } from "react";
import { Button } from "../Button/Button";
import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
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

export const Table = <T extends Record<string, React.ReactNode>>({
  data,
  columns,
  storageKey,
  onDataChange,
}: TableProps<T>) => {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  const handleRowClick = (row: T) => {
    setSelectedRow(row);
  };

  const handleDelete = () => {
    if (!selectedRow) return;

    const storedData: T[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const books: T[] = JSON.parse(localStorage.getItem("books") || "[]");

    const isAuthor = storageKey === "authors";

    if(isAuthor) {
      // Verificar se o autor selecionado está associado a algum livro
      const isAuthorLinkedToBook = books.some(
        (book) => book.author_id == selectedRow.id// Supondo que o campo seja `authorId`
      );
  
      if (isAuthorLinkedToBook) {
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
  };

  const openAlertDialog = () => {
    setIsAlertOpen(true);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.customTable}>
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
              <td colSpan={columns.length} className={styles.noDataMessage}>
                Nenhum dado disponível.
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
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.dialogTitle}>Detalhes do Livro</Dialog.Title>
            {selectedRow && (
              <div className={styles.dialogRowContent}>
                {columns.map((column) => (
                  <p key={String(column.accessor)}>
                    <strong>{column.label}:</strong> {selectedRow[column.accessor]}
                  </p>
                ))}
              </div>
            )}
            <div className={styles.footer}>
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
          <AlertDialog.Overlay className={styles.dialogAlertOverlay} />
          <AlertDialog.Content className={styles.dialogContent}>
            <AlertDialog.Title className={styles.dialogTitle}>
              Tem certeza que deseja excluir?
            </AlertDialog.Title>
            <div className={styles.boxIconAlert}>
              <ExclamationTriangleIcon className={styles.iconAlert}/>
            </div>
            <AlertDialog.Description className={styles.dialogAlertDescription}>
              Essa ação não pode ser desfeita.
            </AlertDialog.Description>
            <div className={styles.dialogAlertFooter}>
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

      <Toast.Provider swipeDirection="right">
        <Toast.Root className={styles.ToastRoot} open={openToast} onOpenChange={setOpenToast}>
          <Toast.Title className={styles.ToastTitle}>Erro ao excluir</Toast.Title>
          <Toast.Description className={styles.ToastDescription}>
            Não é possível excluir esse autor, pois ele está associado a um ou mais livros!
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className={styles.ToastViewport} />
      </Toast.Provider>
    </div>
  );
};

