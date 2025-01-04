import Button from "./components/Button/Button";
import Table from "./components/Table/Table"
import styles from "./app.module.css"

function App() {

  const books = [
    { id: 1, name: "O Senhor dos Anéis", author: "J.R.R. Tolkien", year: 1954 },
    { id: 2, name: "Duna", author: "Frank Herbert", year: 1965 },
    { id: 3, name: "1984", author: "George Orwell", year: 1949 },
    { id: 4, name: "A Culpa é das Estrelas", author: "Clara Almeida", year: 2011 },
    { id: 5, name: "God of War", author: "Santa Mônica", year: 2000 },
  ];

  return (
    <>
      <div className={styles.buttonEnd}>
        <Button label="Adicionar livro" onClick={() => alert("Modal")} variant="primary" size="medium" />
      </div>
      <Table data={books}></Table>
    </>
  )
}

export default App
