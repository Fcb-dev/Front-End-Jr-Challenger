import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Table } from "./components/Table/Table";
import { Form } from "./components/Form/Form";
import { Button } from "./components/Button/Button";
import { Toaster } from "./components/Toast/Toast";
import styles from "./app.module.css";

interface BaseBook {
  id: number;
  name: string;
  author_id: number;
  pages?: number;
}

interface BaseAuthor {
  id: number;
  name: string;
  email?: string;
}

type ToastType = "error" | "success";

interface ToastConfig {
  type: ToastType;
  title: string;
  description: string;
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

  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    type: "error",
    title: "",
    description: "",
  });
  
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

  const handleAddBook = (bookData: Omit<BaseBook, 'id'> & { author_id: number }) => {
    if (isAuthorView) return;

    const authorExists = authors.some(author => author.id === Number(bookData.author_id));

    if (!authorExists) {
      setToastConfig({
        type: "error",
        title: "Nenhum autor com esse ID foi encontrado.",
        description: "Cadastre um autor antes de atribuí-lo a um livro!"
      });
      setOpenToast(true)
      return;
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

    setToastConfig({
      type: "success",
      title: "Livro inserido com sucesso!",
      description: "O livro novo já está na sua coleção."
    });
    setOpenToast(true);
  };

  const handleAddAuthor = (authorData: Omit<BaseAuthor, 'id'>) => {
    if (!isAuthorView) return;
    
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

    setToastConfig({
      type: "success",
      title: "Autor inserido com sucesso!",
      description: "O autor novo já está disponível."
    });
    setOpenToast(true);
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsAuthorView(checked);
    setModalRegisterBook(false);
    setModalRegisterAuthor(false);
  };

  return (
    <div className={styles.Container}>
      <div className={styles.w800}>
        <div className={styles.HeaderBetween}>
          <form>
            <div className={styles.BoxHeader}>
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
          <h1 className={styles.Title}>{isAuthorView ? "Listagem de Autores" : "Coleção de Livros"}</h1>
          <div className={styles.ButtonAdd}>
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
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={styles.DialogContent}>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.DialogTitle}>
              Adicione um livro
            </Dialog.Title>
            <Dialog.DialogDescription className={styles.DialogDescription}>
              Mais um livro para sua coleção.
            </Dialog.DialogDescription>
            <Form
              onSubmit={handleAddBook}
              fields={[
                { 
                  name: "name", 
                  label: "Nome do Livro",
                  placeholder: "Digite o nome do livro",
                  type: "text", 
                  validation: { required: "O nome é obrigatório!" }
                },
                { 
                  name: "author_id", 
                  label: "Autor", 
                  type: "select",
                  placeholder: "Selecione um autor",
                  options: authors.length > 0 
                    ? [
                        { label: "Selecione um autor", value: "", disabled: true },
                        ...authors.map((author) => ({
                          label: author.name as string, 
                          value: Number(author.id)
                        }))
                      ]
                    : [{ label: "Nenhum autor cadastrado", value: "", disabled: true }],
                  validation: { required: "O ID do autor é obrigatório!" }
                },
                { 
                  name: "pages", 
                  label: "Páginas",
                  placeholder: "Ex: 1024",
                  type: "number" 
                }
              ]}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={modalRegisterAuthor} onOpenChange={setModalRegisterAuthor}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay} />
          <Dialog.Content className={styles.DialogContent}>
            <Dialog.Close asChild>
              <button className={styles.IconButton} aria-label="Fechar">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <Dialog.Title className={styles.DialogTitle}>
              Adicione um autor
            </Dialog.Title>
            <Dialog.DialogDescription className={styles.DialogDescription}>
              Os criadores das obras de arte.
            </Dialog.DialogDescription>
            <Form
              onSubmit={handleAddAuthor}
              fields={[
                { 
                  name: "name",
                  label: "Nome do Autor",
                  placeholder: "Digite o nome do autor",
                  type: "text",
                  validation: {
                    required: "O nome é obrigatório!"
                  }
                },
                { 
                  name: "email",
                  label: "E-mail",
                  placeholder: "Digite um email",
                  type: "text"
                }
              ]}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Toaster
        open={openToast}
        setOpen={setOpenToast}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
      />

      <div className={styles.MainFooter}>Desenvolvido por <span>Felipe Bernardo.</span></div>
    </div>
  );
}