import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "./components/Table/Table";
import { Form } from "./components/Form/Form";
import { Button } from "./components/Button/Button";
import styles from "./App.module.css";

const columns = [
  { label: "ID", accessor: "id" },
  { label: "Nome", accessor: "name" },
  { label: "ID Autor", accessor: "author_id" },
  { label: "Páginas", accessor: "pages" },
];

export default function App() {
  const [modalRegisterBook, setModalRegisterBook] = useState(false);
  const [books, setBooks] = useState(() => {
    const storedBooks = localStorage.getItem("books");
    return storedBooks ? JSON.parse(storedBooks) : [];
  });

  console.log(books)

  const [nextBookId, setNextBookId] = useState(() => {
    const storedNextBookId = localStorage.getItem("nextBookId");
    return storedNextBookId ? parseInt(storedNextBookId, 10) : 1;
  });

  const handleAddBook = (book: { name: string; author_id: string; pages?: number }) => {
    const newBook = { id: nextBookId, ...book };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  
    const updatedNextBookId = nextBookId + 1;
    setNextBookId(updatedNextBookId);
    localStorage.setItem("nextBookId", updatedNextBookId.toString());

    setModalRegisterBook(false);
  };

  return (
    <div className={styles.app}>
      <div className={styles.headerBetween}>
        <form>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label
              className={styles.LeftLabel}
              htmlFor="change-table"
            >
              Livros
            </label>
            <Switch.Root className={styles.SwitchRoot} id="change-table">
              <Switch.Thumb className={styles.SwitchThumb} />
            </Switch.Root>
            <label
              className={styles.RightLabel}
              htmlFor="change-table"
            >
              Autores
            </label>
          </div>
        </form>
        <Button
          type="button"
          onClick={() => setModalRegisterBook(true)}
          label="Adicionar livro"
        />
      </div>

      <Table data={books} columns={columns} />

      <Dialog.Root open={modalRegisterBook} onOpenChange={setModalRegisterBook}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.dialogTitle}>
              Adicionar Livro
            </Dialog.Title>
            <Dialog.DialogDescription className={styles.dialogDescription}>
              Mais um livro para sua coleção.
            </Dialog.DialogDescription>
            <Form
              onSubmit={() => handleAddBook}
              fields={[
                { name: "name", label: "Nome do Livro", type: "text", validation: { required: "O nome é obrigatório!" } },
                { name: "author_id", label: "Autor", type: "number", validation: { required: "O autor é obrigatório!" } },
                { name: "pages", label: "Páginas", type: "number" }
              ]}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}