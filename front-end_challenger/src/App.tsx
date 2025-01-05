import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import * as Toast from "@radix-ui/react-toast";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Table } from "./components/Table/Table";
import { Form } from "./components/Form/Form";
import { Button } from "./components/Button/Button";
import styles from "./app.module.css";

interface BaseBook {
  id: number;
  name: string;
  author_id: string;
  pages?: number;
}

interface BaseAuthor {
  id: number;
  name: string;
  email?: string;
}

type Book = Record<keyof BaseBook, React.ReactNode>;
type Author = Record<keyof BaseAuthor, React.ReactNode>;

const columnsBooks: Array<{ label: string; accessor: keyof Book }> = [
  { label: "ID", accessor: "id" },
  { label: "Nome", accessor: "name" },
  { label: "ID Autor", accessor: "author_id" },
  { label: "Páginas", accessor: "pages" },
];

const columnsAuthors: Array<{ label: string; accessor: keyof Author }> = [
  { label: "ID", accessor: "id" },
  { label: "Nome", accessor: "name" },
  { label: "E-mail", accessor: "email" },
];

export default function App() {
  const [modalRegisterBook, setModalRegisterBook] = useState(false);
  const [modalRegisterAuthor, setModalRegisterAuthor] = useState(false);
  const [isAuthorView, setIsAuthorView] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  
  const [books, setBooks] = useState<Book[]>(() => {
    const storedBooks = localStorage.getItem("books");
    return storedBooks ? JSON.parse(storedBooks) : [];
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    const storedAuthors = localStorage.getItem("authors");
    return storedAuthors ? JSON.parse(storedAuthors) : [];
  });

  const [nextBookId, setNextBookId] = useState(() => {
    const storedNextBookId = localStorage.getItem("nextBookId");
    return storedNextBookId ? parseInt(storedNextBookId, 10) : 1;
  });

  const [nextAuthorId, setNextAuthorId] = useState(() => {
    const storedNextAuthorId = localStorage.getItem("nextAuthorId");
    return storedNextAuthorId ? parseInt(storedNextAuthorId, 10) : 1;
  });

  const handleAddBook = (bookData: Omit<BaseBook, 'id'>) => {
    if (isAuthorView) return; // Se estiver na view de autores, não adiciona livro

    const authorExists = authors.some(author => author.id === parseInt(bookData.author_id, 10));

    if (!authorExists) {
      setOpenToast(true)
      return; // Não adiciona o livro se o autor não existir
    }
    
    const newBook: Book = {
      id: nextBookId,
      name: bookData.name,
      author_id: bookData.author_id,
      pages: bookData.pages?.toString().trim() || '-'
    };
    
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));

    const updatedNextBookId = nextBookId + 1;
    setNextBookId(updatedNextBookId);
    localStorage.setItem("nextBookId", updatedNextBookId.toString());

    setModalRegisterBook(false);
  };

  const handleAddAuthor = (authorData: Omit<BaseAuthor, 'id'>) => {
    if (!isAuthorView) return; // Se não estiver na view de autores, não adiciona autor
    
    const newAuthor: Author = {
      id: nextAuthorId,
      name: authorData.name,
      email: authorData.email?.trim() || '-',
    };
    
    const updatedAuthors = [...authors, newAuthor];
    setAuthors(updatedAuthors);
    localStorage.setItem("authors", JSON.stringify(updatedAuthors));

    const updatedNextAuthorId = nextAuthorId + 1;
    setNextAuthorId(updatedNextAuthorId);
    localStorage.setItem("nextAuthorId", updatedNextAuthorId.toString());

    setModalRegisterAuthor(false);
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsAuthorView(checked);
    setModalRegisterBook(false);
    setModalRegisterAuthor(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.w800}>
        <div className={styles.headerBetween}>
          <form>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className={styles.LeftLabel} htmlFor="change-table">
                Livros
              </label>
              <Switch.Root
                className={styles.SwitchRoot}
                id="change-table"
                checked={isAuthorView}
                onCheckedChange={handleSwitchChange}
              >
                <Switch.Thumb className={styles.SwitchThumb} />
              </Switch.Root>
              <label className={styles.RightLabel} htmlFor="change-table">
                Autores
              </label>
            </div>
          </form>
          <h1 className={styles.title}>{isAuthorView ? "Listagem de Autores" : "Coleção de Livros"}</h1>
          <div className={styles.buttonAdd}>
            <Button
              type="button"
              onClick={() => isAuthorView ? setModalRegisterAuthor(true) : setModalRegisterBook(true)}
              label={isAuthorView ? "Adicionar autor" : "Adicionar livro"}
              icon={<PlusIcon />}
              iconPosition="left"
            />
          </div>
        </div>

        {isAuthorView ? (
          <Table<Author>
            data={authors}
            columns={columnsAuthors}
            storageKey="authors"
            onDataChange={setAuthors}
          />
        ) : (
          <Table<Book>
            data={books}
            columns={columnsBooks}
            storageKey="books"
            onDataChange={setBooks}
          />
        )}

      </div>

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
              onSubmit={handleAddBook}
              fields={[
                { name: "name", label: "Nome do Livro", type: "text", validation: { required: "O nome é obrigatório!" } },
                { name: "author_id", label: "Autor", type: "number", validation: { required: "O ID do autor é obrigatório!" } },
                { name: "pages", label: "Páginas", type: "number" }
              ]}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={modalRegisterAuthor} onOpenChange={setModalRegisterAuthor}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Close asChild>
              <button className={styles.iconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.dialogTitle}>
              Adicionar Autor
            </Dialog.Title>
            <Form
              onSubmit={handleAddAuthor}
              fields={[
                { name: "name", label: "Nome do Autor", type: "text", validation: { required: "O nome é obrigatório!" } },
                { name: "email", label: "E-mail", type: "email" }
              ]}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Toast.Provider swipeDirection="right">
        <Toast.Root className={styles.ToastRoot} open={openToast} onOpenChange={setOpenToast}>
          <Toast.Title className={styles.ToastTitle}>Nenhum autor com esse ID foi encontrado.</Toast.Title>
          <Toast.Description className={styles.ToastDescription}>
            Cadastre um autor antes de atribuí-lo a um livro! 
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className={styles.ToastViewport} />
      </Toast.Provider>

      <div className={styles.mainFooter}>Desenvolvido por <span>Felipe Bernardo.</span></div>
    </div>
  );
}