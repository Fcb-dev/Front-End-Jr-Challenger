import React, { useState } from "react";
import { Button } from "../Button/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./index.module.css";

// Garantir que 'accessor' é apenas string ou number
interface TableProps<T extends Record<string, React.ReactNode>> {
  data: T[];
  columns: Array<{ label: string; accessor: keyof T }>;
}

export const Table = <T extends Record<string, React.ReactNode>>({ data, columns }: TableProps<T>) => {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleRowClick = (row: T) => {
    setSelectedRow(row);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.customTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)}>{column.label}</th> // Usando String para garantir que seja uma chave válida
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row)}>
              {columns.map((column) => (
                <td key={String(column.accessor)}>{row[column.accessor]}</td> // Usando String para garantir que seja uma chave válida
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog.Root open={!!selectedRow} onOpenChange={() => setSelectedRow(null)} modal={true}>
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
            <Dialog.Description className={styles.dialogDescription}></Dialog.Description>
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
                type="submit"
                onClick={() => {}}
                label="Excluir"
                variant="danger"
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}