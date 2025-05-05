# 📩 Message Service Backend

Um backend Node.js para um app de mensagens em tempo real, construído com Express.js e MongoDB.

---

## 🚀 Features

- Autenticação de usuários com JWT  
- Gerenciamento de mensagens  
- API RESTful completinha  
- Suporte a CORS  
- Integração com MongoDB  

---

## 📦 Pré-requisitos

- Node.js (v14 ou superior)  
- MongoDB (v4.4 ou superior)  
- npm ou yarn como gerenciador de pacotes  

---

## 🛠️ Instalação

1. Clone o repositório:  
   ```bash
   git clone <seu-repo-url>
   ```
2. Acesse o diretório do backend:  
   ```bash
   cd backend
   ```
3. Instale as dependências:  
   ```bash
   npm install
   ```

---

## ⚙️ Configuração

O servidor tá configurado pra:

- Rodar na porta `3000` por padrão  
- Conectar no MongoDB em `mongodb://127.0.0.1:27017/MyMongoDB`  
- Aceitar requisições CORS do frontend Angular em `http://localhost:4200`  

---

## 🌐 Rotas Disponíveis

### 🔐 Autenticação

- `POST /signup` - Criação de conta  
- `POST /login` - Login de usuário  

### 💬 Mensagens

- `POST /mensagem` - Criar nova mensagem (requer login)  
- `GET /mensagens` - Listar todas mensagens  
- `PUT /mensagem/:id` - Atualizar mensagem (requer login)  
- `DELETE /mensagem/:id` - Deletar mensagem (requer login)  

---

## ▶️ Rodando a Aplicação

Inicie o servidor de desenvolvimento com hot-reload:

```bash
npm run start:server
```

---

## 🔐 Segurança da API

- Autenticação com JWT  
- Criptografia de senhas com bcrypt  
- Proteção CORS  
- Limites no tamanho do corpo das requisições  

---

## 📚 Dependências

- **express**: Framework web  
- **mongoose**: Modelagem de dados com MongoDB  
- **jsonwebtoken**: Autenticação com JWT  
- **bcrypt**: Hash de senhas  
- **cors**: Middleware CORS  
- **body-parser**: Parser de requisições  
- **nodemon**: Dev server com hot-reload  

---

## 🗂️ Estrutura do Projeto

```plaintext
backend/
├── bin/
│   └── server.js           # Configuração do servidor
├── models/
│   ├── user.model.js       # Esquema de usuário
│   └── message.model.js    # Esquema de mensagens
├── routes/
│   ├── UserRoutes.js       # Rotas de autenticação
│   └── MessageRouter.js    # Rotas de mensagens
├── middlewares/
│   └── AuthMiddleware.js   # Middleware de autenticação
├── app.js                  # Arquivo principal da aplicação
└── package.json            # Dependências do projeto
```

---

## ❗ Tratamento de Erros

- Conexão com o banco  
- Falhas de autenticação  
- Requisições inválidas  
- Erros de servidor  

---

## 🤝 Contribuindo

1. Faça um fork do repositório  
2. Crie sua branch: `git checkout -b feature/AmazingFeature`  
3. Commit suas mudanças: `git commit -m 'Add some AmazingFeature'`  
4. Push pra sua branch: `git push origin feature/AmazingFeature`  
5. Abra um Pull Request  

---

## 📝 Licença

ISC License
