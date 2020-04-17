# Backend Northcoders News API

[Project hosted on Heroku](https://nc-news-voltreffer.herokuapp.com/api/)

An Express server that provides data to the frontend of my reddit-style App. The full App will be a reddit clone with users/topics/articles/comments and the ability to up and downvote. The project uses a SQL database that interacts with Postgres. Knex has been used to build the avaible queries.

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

Produce an initial GET request to /api/ for a list of available endpoints and their behaviours.
The following endpoints are available

## /api/

```http
GET /api/
```

## /api/topics

```http
GET /api/topics
```

```http
POST /api/topics
```

## /api/articles

```http
GET /api/articles
```

```http
POST /api/articles
```

```http
GET /api/articles/:article_id
```

```http
PATCH /api/articles/:article_id
```

```http
DELETE /api/articles/:article_id
```

```http
GET /api/articles/:article_id/comments
```

```http
POST /api/articles/:article_id/comments
```

## /api/comments

```http
PATCH /api/comments/:comment_id
```

```http
DELETE /api/comments/:comment_id
```

## /api/users

```http
POST /api/users
```

```http
GET /api/users
```

```http
GET /api/users/:username
```

## Running the tests

A full TTD test suite in avaiable with the following commands:

```http
npm test
```

```http
npm run test-utils
```

## Author

Niels de Visser

## Built With

- [Node.JS](https://nodejs.org)
- [Express](https://expressjs.com/)
- [Knex.js](https://knexjs.org)
- [PostgreSQL](https://www.postgresql.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)
- [SuperTest](https://github.com/visionmedia/supertest)

## Acknowledgements

Based on the Northcoders excercise
