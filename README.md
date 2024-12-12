# Around the World Cuisine API

## Overview
The **Around the World Cuisine API** allows users to:
- Search for recipes by ingredients and region.
- Manage user accounts with signup and login functionality.
- Favorite recipes and retrieve a list of user favorites.
- Explore various regions and their associated recipes.

This API is built with **Node.js**, **Express**, **Objection.js**, and **Knex**, and **MySQL** includes Swagger documentation for easy interaction and testing.

---

## Features
### Recipe Management
- **Search Recipes by Ingredients:** Find recipes using a list of ingredients and optionally filter by region.
- **Get Recipe Details:** Fetch detailed information for a specific recipe, including its ingredients and associated region.

### User Management
- **Signup:** Create a user account with a username and password.
- **Login:** Authenticate users with their credentials.
- **Favorite Recipes:** Add recipes to a user's favorites list.
- **View Favorites:** Retrieve a user's list of favorite recipes.

### Region Exploration
- **List Regions:** Get a list of all available regions.
- **Recipes by Region:** Fetch recipes associated with a specific region.

---

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Git](https://git-scm.com/)
- [Knex CLI](https://knexjs.org/)
- [MySQL](https://www.mysql.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the database:
   - Create a MySQL database.
   - Update the `knexfile.js` with your database credentials.

4. Run migrations to set up the database schema:
   ```bash
   npx knex migrate:latest
   ```
5. Seed the database with sample data (optional):
   ```bash
   npx knex seed:run
   ```
6. Start the server:
   ```bash
   npm start
   ```
7. Access the API:
   - Swagger Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
   - API Root: [http://localhost:5000](http://localhost:5000)

---

## API Endpoints

### Recipe Endpoints
- **GET /recipes/search**: Search recipes by ingredients and region.
- **GET /recipes/:id**: Fetch recipe details by ID.
- **GET /recipes/region/:region**: Get recipes by region.

### User Endpoints
- **POST /signup**: Create a new user account.
- **POST /login**: Log in a user.
- **PUT /favorite**: Add a recipe to favorites.
- **GET /favorites**: Retrieve a user's favorite recipes.

### Region Endpoints
- **GET /regions**: List all regions.

---

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building REST APIs.
- **Objection.js**: ORM for managing database models and relations.
- **Knex.js**: SQL query builder for migrations and database interaction.
- **Swagger**: Auto-generated API documentation.
- **MySQL**: Relational database.

## Authors
- [Starlee Jiles](https://github.com/starles-barkley)
- [Cody Walenciak](https://github.com/Cody-j-w)
