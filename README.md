# HomeBook

**Versão:** 1.0  
**Data de Criação:** 05/01/2025  

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
    - **Nome** (string, obrigatório)
    - **ID Autor** (número, obrigatório)
    - **Páginas** (número, opcional) - (A não inserção de algum valor, resultada em "-")

  - Modal para inserção de livro.
    - **ID** (número, obrigatório)
    - **Nome** (string, obrigatório)
    - **Email** (string, opcional) - (A não inserção de algum valor, resultada em "-")

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
  - `hooks/` - Hooks personalizados usados para gerenciamento de estado e lógica.
  - `services/` - Camada de comunicação com Local Storage.
  - `styles/` - Estilos globais e específicos do projeto.
  - `utils/` - Funções utilitárias e helpers.
- `public/` - Contém arquivos públicos como favicon, imagens e outros assets estáticos.
- `node_modules/` - Dependências instaladas pelo gerenciador de pacotes.

### Dependências
- React
- Radix UI (opcional)
- React Hook Form ou Formik (opcional)

## Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Yarn ou NPM instalado

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/homebook.git

