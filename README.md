# HomeBook

**Versão:** 1.0  
**Data de Criação:** 06/01/2025  

## Descrição

O **HomeBook** é um sistema simples para gerenciar livros e autores. Ele permite cadastrar, listar e visualizar informações detalhadas de livros e seus autores, garantindo regras relacionais e de integridade para manter a consistência dos dados. 

## Funcionalidades

- **Tabela de Livros**
  - Listagem de livros com as seguintes colunas:
    - **ID**
    - **Nome**
    - **ID Autor**
    - **Páginas**

- **Tabela de Autores**
  - Listagem de autores com as seguintes colunas:
    - **ID**
    - **Nome**
    - **Email**

- **Modais**
  - Modal para inserção de autor.
     - **ID** (número, obrigatório)
    - **Nome** (string, obrigatório) - input
    - **ID Autor** (número, obrigatório) - select
    - **Páginas** (número, opcional) - (A não inserção de algum valor, resultada em "-") - input

  - Modal para inserção de livro.
    - **ID** (número, obrigatório)
    - **Nome** (string, obrigatório) - input
    - **Email** (string, opcional) - (A não inserção de algum valor, resultada em "-") -input

## Regras de Negócio

1. **Inserção de Livros**  
   - Um livro só pode ser cadastrado se houver ao menos um autor existente para ser associado.
   - Caso contrário, o sistema exibirá um erro e não permitirá o cadastro.

2. **Exclusão de Autores**  
   - Um autor não pode ser excluído se houver livros associados a ele.
   - Caso o usuário tente excluir um autor com livros vinculados, o sistema exibirá um erro e a exclusão não será realizada.

## Estrutura do Projeto

### Diretórios Principais
- `src/` - Contém os arquivos de código-fonte do projeto.
  - `components/` - Componentes reutilizáveis, incluindo tabelas e modais.
- `index.css` - Estilos globais e variáveis.
- `node_modules/` - Dependências instaladas pelo gerenciador de pacotes.

### Dependências
- React
- Radix UI
- React Hook Form
- Typescript

## Configuração

### Pré-requisitos
- Yarn

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Fcb-dev/Front-End-Jr-Challenger
   
2. Após clonar o projeto, rode os comandos:

   yarn install (Instalar todas as dependências do projeto)
   yarn dev (Rodar o projeto)
   
