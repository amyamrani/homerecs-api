# HomeRecs API

Server API interface for storing and delivering data to HomeRecs application

## Introduction

Connect with friends and family to share the products you love so everyone can feel confident about the products they buy.

## Live App
https://homerecs.vercel.app

## Client Repo
https://github.com/amyamrani/homerecs

## API Endpoints

### Sign Up: `POST /api/users/signup`

Adds new user credentials to database and returns a JWT as long as the email is unique

**Sample Request Body**

```
{
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@gmail.com",
  "password': "Password123"
}
```

**Sample Response Body**

```
{
  "id": 16,
  "group_id": null,
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@gmail.com",
  "token": "tHiSisASaMpLEjWtAUthToKEN",
  "date_created": "2020-12-19T15:43:10.889Z"
}
```

### Login: `POST /api/users/login`

Validates the login credentials against the database and returns a JWT

**Sample Request Body**

```
{
  "email": "newuser@gmail.com",
  "password": "Password123"
}
```
**Sample Response Body**

```
{
  "id": 16,
  "group_id": null,
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@gmail.com",
  "token": "tHiSisASaMpLEjWtAUthToKEN",
  "date_created": "2020-12-19T15:43:10.889Z"
}
```

### Add a New Product: `POST /api/products`

Creates a product for the logged in user

**Sample Request Body**

```
{
  "name": "TV",
  "url": "https://www.bestbuy.com",
  "comments":"Great sound and picture quality!",
  "category":"Living Room"
}
```

**Sample Response Body**

```
{
  "id": 18,
  "user_id": 16,
  "name":"TV",
  "url":"https://www.bestbuy.com",
  "comments":"Great sound and picture quality!",
  "category":"Living Room","date_created":"2020-12-19T15:57:01.353Z"
}
```

### Get a User's Products: `GET /api/products`

Retrieves the products for a given user

**Sample Query String Parameters**

```
?user_id=16
```

**Sample Response Body**

```
[
  {
    "id": 18,
    "user_id": 16,
    "name": "TV",
    "url": "https://www.bestbuy.com",
    "comments": "Great sound and picture quality!",
    "category": "Living Room",
    "date_created": "2020-12-19T15:57:01.353Z"
  },
  {
    "id": 19,
    "user_id": 16,
    "name": "Mirror",
    "url": "https://www.target.com",
    "comments": "Beautiful piece and matches any decor.",
    "category": "Bedroom",
    "date_created": "2020-12-19T16:17:04.163Z"
  }
]
```

### Update a Product: `PATCH /api/products/:id`

Updates a user's product and returns a `204 No Content`

**Sample Request Body**

```
{
  "name": "Sony TV",
  "url": "https://www.bestbuy.com",
  "comments": "Great sound and picture quality!",
  "category": "Living Room"
}
```

### Delete a Product: `DELETE /api/products/:id`

Deletes a product for a given user and returns a `204 No Content`

### Add a New Group: `POST /api/groups`

Creates a new group and returns an auto-generated invite code

**Sample Request Body**

```
{"name": "Best Friends"}
```

**Sample Response Body**

```
{
  "id": 38,
  "name": "Best Friends",
  "code": "K1KhdJu"
}
```

### Get a Group: `GET /api/groups/:id`

Retrieves a given group

**Sample Response Body**

```
{
  "id": 38,
  "name": "Best Friends",
  "code": "K1KhdJu"
}
```

### Update a Group: `PATCH /api/groups/:id`

Updates a group and returns a `204 No Content`

**Sample Request Body**

```
{"name": "Best Friends!"}
```

### Leave a Group: `PATCH /api/users/:id`

Updates the user's group_id to null

**Sample Request Body**

```
{"group_id": null}
```

**Sample Response Body**

```
{
  "id": 16,
  "group_id": null,
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@gmail.com",
  "token": "tHiSisASaMpLEjWtAUthToKEN",
  "date_created": "2020-12-19T15:43:10.889Z"
}
```

### Join a Group: `PATCH /api/users/:id`

Updates the user's group_id

**Sample Request Body**

```
{"code": "K1KhdJu"}
```

**Sample Response Body**

```
{
  "id": 16,
  "group_id": 38,
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@gmail.com",
  "token": "tHiSisASaMpLEjWtAUthToKEN",
  "date_created": "2020-12-19T15:43:10.889Z"
}
```

### Get a User: `GET /api/users/:id`

Retrieves a given user

**Sample Response Body**

```
{
  "id": 17,
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### Get Group Users: `GET /api/users`

Retrieves the users in a given group

**Sample Query String Parameters**

```
?group_id=38
```

**Sample Response Body**

```
[
  {
    "id": 16,
    "first_name": "New",
    "last_name": "User"
  },
  {
    "id": 17,
    "first_name": "Jane",
    "last_name": "Smith"
  },
  {
    "id": 18,
    "first_name": "Greg",
    "last_name": "Brown"
  }
]
```

## Technologies Used
**Back End**
- Node and Express
  - JWT and bcrypt
- Testing
  - Mocha
  - Chai and Supertest
- Database
  - PostgreSQL
  - Knex.js

**Production**
- Deployed via Heroku


