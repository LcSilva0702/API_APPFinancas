# Api para Apps de Finanças

Seu papel é construir uma RESTful API que permita:

1. Cadastrar Usuário
2. Fazer Login
3. Detalhar Perfil do Usuário Logado
4. Editar Perfil do Usuário Logado
5. Listar categorias
6. Detalhar categoria
7. Cadastrar categoria
8. Editar categoria
9. Remover categoria
10. Listar transações
11. Detalhar transação
12. Cadastrar transação
13. Editar transação
14. Remover transação
15. Obter extrato de transações
16. Filtrar transações por categoria

**Importante: Lembre-se sempre que cada usuário só pode ver e manipular seus próprios dados e suas próprias transações. Não atender a este pré-requisito é uma falha de segurança gravíssima!**

**Importante 2: O diretório ".github" e seu conteúdo não podem ser alterados e muito menos excluídos.**

**Importante 3: Sempre que a validação de uma requisição falhar, responda com código de erro e mensagem adequada à situação, ok?

## Banco de dados

Você precisa criar um Banco de Dados PostgreSQL chamado dindin contendo as seguintes tabelas e colunas:

### Tabela "usuarios"
- id
- nome
- email (campo único)
- senha

### Tabela "categorias"
- id
- usuario_id
- descricao

### Tabela "transacoes"
- id
- descricao
- valor
- data
- categoria_id
- usuario_id
- tipo

**IMPORTANTE: Deverá ser criado no projeto o(s) arquivo(s) SQL que deverá ser o script que cria as tabelas corretamente.**

## Requisitos obrigatórios

A API a ser criada deverá acessar o banco de dados a ser criado "dindin" para persistir e manipular os dados de usuários, categorias e transações utilizados pela aplicação.

O campo id das tabelas no banco de dados deve ser auto incremento, chave primária e não deve permitir edição uma vez criado.

Seu código deverá estar organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, é esperado que ele tenha, no mínimo:
- Um arquivo index.js
- Um arquivo conexao.js
- Um arquivo de rotas
- Um pasta com controladores

Qualquer valor monetário deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000).

Evite códigos duplicados. Antes de copiar e colar, pense se não faz sentido esse pedaço de código estar centralizado numa função.

## Status Codes

Abaixo, listamos os possíveis status codes esperados como resposta da API:

- 200 (OK) = requisição bem sucedida
- 201 (Created) = requisição bem sucedida e algo foi criado
- 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
- 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
- 401 (Unauthorized) = o usuário não está autenticado (logado)
- 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
- 404 (Not Found) = o servidor não pode encontrar o recurso solicitado

## Endpoints

### Cadastrar usuário
**POST** /usuario

Essa é a rota que será utilizada para cadastrar um novo usuário no sistema.

**Requisição**
Sem parâmetros de rota ou de query.
O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

- nome
- email
- senha

**Resposta**
Em caso de sucesso, deveremos enviar no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo id e excluindo a senha criptografada. Em caso de falha na validação, a resposta deverá possuir status code apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade mensagem que deverá possuir como valor um texto explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Validar os campos obrigatórios: nome, email, senha
- Validar se o e-mail informado já existe
- Criptografar a senha antes de persistir no banco de dados
- Cadastrar o usuário no banco de dados

**Exemplo de requisição**

```json
POST /usuario
{
  "nome": "João da Silva",
  "email": "joao.silva@email.com",
  "senha": "123456"
}
```

### Fazer Login
**POST** /auth

Essa rota permite que um usuário registrado faça login no sistema.

**Requisição**
Sem parâmetros de rota ou de consulta.
O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- email
- senha

**Resposta**
Em caso de sucesso, a resposta deve conter um token JWT (JSON Web Token) no corpo (body). Em caso de falha na autenticação, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o email do usuário existe no banco de dados.
- Comparar a senha fornecida com a senha armazenada no banco de dados após a descriptografia.
- Emitir um token JWT após a autenticação bem-sucedida.

**Exemplo de requisição**

```json
POST /auth
{
  "email": "joao.silva@email.com",
  "senha": "123456"
}
```

### Detalhar Perfil do Usuário Logado
**GET** /perfil

Essa rota permite que um usuário autenticado obtenha detalhes de seu próprio perfil.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição.

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes do perfil do usuário logado, excluindo a senha. Em caso de falha na autenticação (token inválido ou expirado), a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence a um usuário registrado no sistema.

**Exemplo de requisição**

```http
GET /perfil
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "nome": "João da Silva",
  "email": "joao.silva@email.com"
}
```

### Editar Perfil do Usuário Logado
**PUT** /perfil

Esta rota permite que um usuário autenticado edite suas informações de perfil.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- nome (opcional)
- senha (opcional)

**Resposta**
Em caso de sucesso, a resposta deve conter as informações atualizadas do perfil do usuário. Em caso de falha na autenticação (token inválido ou expirado), a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Permitir que o usuário atualize seu nome e/ou senha, se desejado.
- Atualizar as informações no banco de dados.

**Exemplo de requisição**

```http
PUT /perfil
Authorization: Bearer seu-token-jwt-aqui
```

```json
{
  "nome": "Novo Nome de Usuário",
  "senha": "novasenha456"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "nome": "Novo Nome de Usuário",
  "email": "joao.silva@email.com"
}
```

### Listar Categorias
**GET** /categorias

Esta rota permite que um usuário autenticado liste todas as categorias associadas à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição.

**Resposta**
Em caso de sucesso, a resposta deve conter uma lista de categorias associadas ao usuário logado. Cada categoria deve conter seu ID e descrição. Em caso de falha na autenticação (token inválido ou expirado), a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Recuperar as categorias associadas ao usuário no banco de dados.

**Exemplo de requisição**

```http
GET /categorias
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
[
  {
    "id": 1,
    "descricao": "Alimentação"
  },
  {
    "id": 2,
    "descricao": "Transporte"
  }
]
```

### Detalhar Categoria
**GET** /categorias/{id}

Esta rota permite que um usuário autenticado obtenha detalhes de uma categoria específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da categoria desejada.

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da categoria, incluindo seu ID e descrição. Em caso de falha na autenticação (token inválido ou expirado) ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a categoria pertence ao usuário logado.

**Exemplo de requisição**

```http
GET /categorias/1
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Alimentação"
}
```

### Cadastrar Categoria
**POST** /categorias

Esta rota permite que um usuário autenticado cadastre uma nova categoria associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O corpo (body) da solicitação deve conter um objeto com a seguinte propriedade:

- descricao

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da categoria recém-criada, incluindo seu ID e descrição. Em caso de falha na autenticação (token inválido ou expirado) ou validação da descrição da categoria, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar se a descrição da categoria foi fornecida.
- Cadastrar a nova categoria no banco de dados associando-a ao usuário logado.

**Exemplo de requisição**

```json
POST /categorias
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Lazer"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 3,
  "descricao": "Lazer"
}
```

### Editar Categoria
**PUT** /categorias/{id}

Esta rota permite que um usuário autenticado edite uma categoria específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da categoria que deseja editar. O corpo (body) da solicitação deve conter um objeto com a seguinte propriedade:

- descricao

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da categoria após a edição, incluindo seu ID e descrição atualizada. Em caso de falha na autenticação (token inválido ou expirado), validação da descrição da categoria ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar se a descrição da categoria foi fornecida.
- Verificar se a categoria pertence ao usuário logado.
- Atualizar a descrição da categoria no banco de dados.

**Exemplo de requisição**

```http
PUT /categorias/3
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Entretenimento"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 3,
  "descricao": "Entretenimento"
}
```

### Remover Categoria
**DELETE** /categorias/{id}

Esta rota permite que um usuário autenticado remova uma categoria específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da categoria que deseja remover.

**Resposta**
Em caso de sucesso, a resposta deve ter o status code 204 (No Content) indicando que a categoria foi removida com sucesso. Em caso de falha na autenticação (token inválido ou expirado) ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a categoria pertence ao usuário logado.
- Remover a categoria do banco de dados.

**Exemplo de requisição**

```http
DELETE /categorias/3
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```http
204 No Content
```

### Listar Transações
**GET** /transacoes

Esta rota permite que um usuário autenticado liste todas as transações associadas à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição.

**Resposta**
Em caso de sucesso, a resposta deve conter uma lista de transações associadas ao usuário logado. Cada transação deve conter seu ID, descrição, valor, data, categoria e tipo. Em caso de falha na autenticação (token inválido ou expirado), a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Recuperar as transações associadas ao usuário no banco de dados.

**Exemplo de requisição**

```http
GET /transacoes
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
[
  {
    "id": 1,
    "descricao": "Restaurante",
    "valor": 2500,
    "data": "2023-08-15",
    "categoria": "Alimentação",
    "tipo": "Despesa"
  },
  {
    "id": 2,
    "descricao": "Salário",
    "valor": 50000,
    "data": "2023-08-30",
    "categoria": "Trabalho",
    "tipo": "Receita"
  }
]
```

### Detalhar Transação
**GET** /transacoes/{id}

Esta rota permite que um usuário autenticado obtenha detalhes de uma transação específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da transação desejada.

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da transação, incluindo seu ID, descrição, valor, data, categoria e tipo. Em caso de falha na autenticação (token inválido ou expirado) ou se a transação não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a transação pertence ao usuário logado.

**Exemplo de requisição**

```http
GET /transacoes/1
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Restaurante",
  "valor": 2500,
  "data": "2023-08-15",
  "categoria": "Alimentação",
  "tipo": "Despesa"
}
```

### Cadastrar Transação
**POST** /transacoes

Esta rota permite que um usuário autenticado cadastre uma nova transação associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- descricao
- valor
- data
- categoria_id
- tipo

**Resposta**
Em caso de sucesso, a resposta deve conter o conteúdo da transação cadastrada, incluindo seu ID. Em caso de falha na autenticação (token inválido ou expirado), validação dos campos da transação ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar os campos obrigatórios: descricao, valor, data, categoria_id e tipo.
- Verificar se a categoria pertence ao usuário logado.
- Cadastrar a transação no banco de dados.

**Exemplo de requisição**

```json
POST /transacoes
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Restaurante",
  "valor": 2500,
  "data": "2023-08-15",
  "categoria_id": 1,
  "tipo": "Despesa"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Restaurante",
  "valor": 2500,
  "data": "2023-08-15",
  "categoria": "Alimentação",
  "tipo": "Despesa"
}
```

### Editar Transação
**PUT** /transacoes/{id}

Esta rota permite que um usuário autenticado edite uma transação específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da transação que deseja editar. O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- descricao
- valor
- data
- categoria_id
- tipo

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da transação após a edição, incluindo seu ID. Em caso de falha na autenticação (token inválido ou expirado), validação dos campos da transação ou se a transação não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar os campos obrigatórios: descricao, valor, data, categoria_id e tipo.
- Verificar se a transação pertence ao usuário logado.
- Atualizar os campos da transação no banco de dados.

**Exemplo de requisição**

```http
PUT /transacoes/1
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Restaurante Italiano",
  "valor": 3000,
  "data": "2023-08-20",
  "categoria_id": 1,
  "tipo": "Despesa"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Restaurante Italiano",
  "valor": 3000,
  "data": "2023-08-20",
  "categoria": "Alimentação",
  "tipo": "Despesa"
}
```

### Remover Transação
**DELETE** /transacoes/{id}

Esta rota permite que um usuário autenticado remova uma transação específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da transação que deseja remover.

**Resposta**
Em caso de sucesso, a resposta deve ter o status code 204 (No Content) indicando que a transação foi removida com sucesso. Em caso de falha na autenticação (token inválido ou expirado) ou se a transação não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a transação pertence ao usuário logado.
- Remover a transação do banco de dados.

**Exemplo de requisição**

```http
DELETE /transacoes/1
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```http
204 No Content
```

### Cadastrar Transação
**POST** /transacoes

Esta rota permite que um usuário autenticado cadastre uma nova transação associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- descricao
- valor
- data
- categoria_id
- tipo

**Resposta**
Em caso de sucesso, a resposta deve conter o conteúdo da transação cadastrada, incluindo seu ID. Em caso de falha na autenticação (token inválido ou expirado), validação dos campos da transação ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar os campos obrigatórios: descricao, valor, data, categoria_id e tipo.
- Verificar se a categoria pertence ao usuário logado.
- Cadastrar a transação no banco de dados.

**Exemplo de requisição**

```json
POST /transacoes
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Restaurante",
  "valor": 2500,
  "data": "2023-08-15",
  "categoria_id": 1,
  "tipo": "Despesa"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Restaurante",
  "valor": 2500,
  "data": "2023-08-15",
  "categoria": "Alimentação",
  "tipo": "Despesa"
}
```

### Editar Transação
**PUT** /transacoes/{id}

Esta rota permite que um usuário autenticado edite uma transação específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da transação que deseja editar. O corpo (body) da solicitação deve conter um objeto com as seguintes propriedades:

- descricao
- valor
- data
- categoria_id
- tipo

**Resposta**
Em caso de sucesso, a resposta deve conter os detalhes da transação após a edição, incluindo seu ID. Em caso de falha na autenticação (token inválido ou expirado), validação dos campos da transação ou se a transação não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar os campos obrigatórios: descricao, valor, data, categoria_id e tipo.
- Verificar se a transação pertence ao usuário logado.
- Atualizar os campos da transação no banco de dados.

**Exemplo de requisição**

```http
PUT /transacoes/1
Authorization: Bearer seu-token-jwt-aqui
{
  "descricao": "Restaurante Italiano",
  "valor": 3000,
  "data": "2023-08-20",
  "categoria_id": 1,
  "tipo": "Despesa"
}
```

**Exemplo de resposta de sucesso**

```json
{
  "id": 1,
  "descricao": "Restaurante Italiano",
  "valor": 3000,
  "data": "2023-08-20",
  "categoria": "Alimentação",
  "tipo": "Despesa"
}
```

### Remover Transação
**DELETE** /transacoes/{id}

Esta rota permite que um usuário autenticado remova uma transação específica associada à sua conta.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da transação que deseja remover.

**Resposta**
Em caso de sucesso, a resposta deve ter o status code 204 (No Content) indicando que a transação foi removida com sucesso. Em caso de falha na autenticação (token inválido ou expirado) ou se a transação não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a transação pertence ao usuário logado.
- Remover a transação do banco de dados.

**Exemplo de requisição**

```http
DELETE /transacoes/1
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```http
204 No Content
```

### Obter Extrato de Transações
**GET** /extrato

Esta rota permite que um usuário autenticado obtenha um extrato de suas transações com base em um período especificado.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. A rota aceita parâmetros de consulta (query parameters) para filtrar o extrato por data inicial e data final. Os parâmetros aceitos são:

- `data_inicial` (opcional): Data inicial do período desejado no formato "AAAA-MM-DD".
- `data_final` (opcional): Data final do período desejado no formato "AAAA-MM-DD".

**Resposta**
Em caso de sucesso, a resposta deve conter uma lista de transações que se enquadram no período especificado, incluindo detalhes de cada transação. Em caso de falha na autenticação (token inválido ou expirado) ou se as datas informadas forem inválidas, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Validar as datas fornecidas (se fornecidas) para garantir que estão em um formato válido e correspondem a um período apropriado.
- Recuperar as transações que correspondem ao período informado.

**Exemplo de requisição**

```http
GET /extrato?data_inicial=2023-08-01&data_final=2023-08-31
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
[
  {
    "id": 1,
    "descricao": "Restaurante",
    "valor": 2500,
    "data": "2023-08-15",
    "categoria": "Alimentação",
    "tipo": "Despesa"
  },
  {
    "id": 2,
    "descricao": "Salário",
    "valor": 500000,
    "data": "2023-08-25",
    "categoria": "Salário",
    "tipo": "Receita"
  }
]
```

### Filtrar Transações por Categoria
**GET** /extrato/categoria/{id}

Esta rota permite que um usuário autenticado filtre suas transações por categoria.

**Requisição**
A autenticação do usuário é realizada através do token JWT no cabeçalho (header) da requisição. O parâmetro `id` na rota deve ser substituído pelo ID da categoria pela qual deseja filtrar as transações.

**Resposta**
Em caso de sucesso, a resposta deve conter uma lista de transações associadas à categoria especificada, incluindo detalhes de cada transação. Em caso de falha na autenticação (token inválido ou expirado) ou se a categoria não pertencer ao usuário logado, a resposta deve ter um status code apropriado e um corpo (body) com uma mensagem explicando o motivo da falha.

**REQUISITOS OBRIGATÓRIOS**

- Verificar se o token JWT é válido e pertence ao usuário logado.
- Verificar se a categoria pertence ao usuário logado.
- Recuperar as transações associadas à categoria informada.

**Exemplo de requisição**

```http
GET /extrato/categoria/1
Authorization: Bearer seu-token-jwt-aqui
```

**Exemplo de resposta de sucesso**

```json
[
  {
    "id": 1,
    "descricao": "Restaurante",
    "valor": 2500,
    "data": "2023-08-15",
    "categoria": "Alimentação",
    "tipo": "Despesa"
  },
  {
    "id": 3,
    "descricao": "Lanche",
    "valor": 1500,
    "data": "2023-08-18",
    "categoria": "Alimentação",
    "tipo": "Despesa"
  }
]
```

