# Backend Northcoders News API

[Project hosted on Heroku](https://nc-news-voltreffer.herokuapp.com/api/)

An Express server that provides data to the frontend of my reddit-style App. The full App will be a reddit clone with users/topics/articles/comments and the ability to up and downvote.

## Copying the project:

Make a clone of project by typing the below in your terminal:

```bash
git clone https://github.com/VoltrefferNL/BENC-News-App
```

Install the project dependencies:

```bash
npm install
```

Run the database install:

```bash
npm run setup-dbs
```

Seed the database with data:

```bash
npm run seed
```

Start the app:

```bash
npm run start
```

You can now find the project running on [http://localhost:9090](http://localhost:9090)

## Using the API

Produce an initial GET request to /api/ for a list of available endpoints.
The following endpoints are available

```http
GET /api
```

--

```http
GET /api/topics
```

---

```http
POST /api/topics
```

---

```http
GET /api/articles
```

---

```http
POST /api/articles
```

---

```http
GET /api/articles/:article_id
```

---

```http
PATCH /api/articles/:article_id
```

---

```http
DELETE /api/articles/:article_id
```

---

```http
GET /api/articles/:article_id/comments
```

---

```http
POST /api/articles/:article_id/comments
```

---

```http
PATCH /api/comments/:comment_id
```

---

```http
DELETE /api/comments/:comment_id
```

---

```http
POST /api/users
```

---

```http
GET /api/users
```

---

```http
GET /api/users/:username
```

---

## Author

Niels de Visser

## Built With

- [Node.JS](https://nodejs.org)
- [generator-knexpress](https://github.com/AnthonyMedina/generator-knexpress)
- [Express](https://expressjs.com/)
- [Knex.js](https://knexjs.org)
- [PostgreSQL](https://www.postgresql.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)
- [SuperTest](https://github.com/visionmedia/supertest)

## Acknowledgements

Based on the Northcoders excercise
