# Desculp.AI

Desculp.AI é um backend desenvolvido em Node.js que utiliza o Prisma para gerenciar o banco de dados e o Express para gerenciar as rotas. O objetivo do projeto é permitir a criação, atualização, exclusão e votação de pedidos de desculpa, utilizando inteligência artificial para gerar desculpas personalizadas.

## Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Desculp.AI
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente, incluindo a chave do Google Generative AI.
   - Execute as migrações do Prisma:
     ```bash
     npx prisma migrate dev
     ```

## Uso

Para iniciar o servidor em modo de desenvolvimento, execute:
```bash
npm start
```
O servidor estará disponível em `http://localhost:3001`.

Para produção, utilize:
```bash
npm run build
npm run start:prod
```

## Endpoints da API

| Método | Endpoint           | Descrição                                      |
|--------|--------------------|------------------------------------------------|
| POST   | `/gerar`           | Gera um pedido de desculpa usando IA.          |
| POST   | `/`                | Cria um novo pedido de desculpa (autenticação).|
| PUT    | `/:id`             | Atualiza um pedido de desculpa pelo ID.        |
| DELETE | `/:id`             | Exclui um pedido de desculpa pelo ID.          |
| POST   | `/:id/votar`       | Vota em um pedido de desculpa pelo ID.         |
| GET    | `/`                | Retorna todos os pedidos de desculpa.          |
| GET    | `/:id`             | Retorna um pedido de desculpa específico.      |
| GET    | `/ranking`         | Retorna o ranking dos pedidos de desculpa.     |

## Validação e Autenticação

As requisições são validadas usando o middleware `validateRequest`, que verifica se os campos obrigatórios estão presentes e retorna erros apropriados. A autenticação é gerenciada pelo middleware `authMiddlewares`, que verifica o token JWT.

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
