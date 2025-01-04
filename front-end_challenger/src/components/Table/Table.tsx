import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./index.module.css";

interface Book {
  id: number;
  name: string;
  author: string;
  year: number;
}

interface TableProps {
  data: Book[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Estado para armazenar o livro selecionado

  const handleRowClick = (book: Book) => {
    setSelectedBook(book); // Atualiza o estado com o livro selecionado
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.customTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} onClick={() => handleRowClick(row)}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.author}</td>
              <td>{row.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog de detalhes do livro */}
      <Dialog.Root open={!!selectedBook} onOpenChange={() => setSelectedBook(null)} modal={true}>
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
            <Dialog.Description className={styles.dialogDescription}>
              {selectedBook && (
                <div>
                  <p><strong>ID:</strong> {selectedBook.id}</p>
                  <p><strong>Título:</strong> {selectedBook.name}</p>
                  <p><strong>Autor:</strong> {selectedBook.author}</p>
                  <p><strong>Ano:</strong> {selectedBook.year}</p>
                </div>
              )}
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Table;