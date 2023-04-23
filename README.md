CHAT ROOM APP


API

- REST API With Nestjs
- Swagger documentation, nextjs logger, ...
- Folder Structure, Code Samples

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have these components on your local machine:

- An up-to-date release of [NodeJS](https://nodejs.org/) and YARN
- A SQL database with TYPEORM npm install --save typeorm mysql2 (https://docs.nestjs.com/recipes/sql-typeorm#sql-typeorm)

### 1.2 Project configuration

Start by cloning this project on your local machine.

``` sh
git clone https://github.com/omowonuola/colkiechatroom.git
yarn add to install dependencies
NOTE: The Main branch is the updated branch for the codebase

```
RUN WITH DOCKER

The server project is dockerized, you can run it through the docker-compose file has the necessary environment variables
```sh
# Launch the development server with docker

cd server(To run the server application)
docker-compose up
```
RUN WITH SERVER(Yarn)

The next step will be to install all the dependencies of the project.

```sh
use yarn install for the server dependencies installation
```

For a standard development configuration, you can leave the default values for PORT, which has the default value of 8080.

### 1.3 Launch and discover with YARN

You are now ready to launch the NestJS application using the command below.

```sh

# Launch the development server with yarn command
yarn run start:dev
```

You can now head to `` and see the API Swagger docs. 
The example User API that gets allows user to signup is located at the `` endpoint in the swagger documentation.

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── auth # The folder for all the project authentication api and query
│   ├── guards # The folder containes the jwt implemetation for user authorization
│   ├──├── jwt.passport.ts # The jwt passport file implemets the jwt strategy class for jwt validation
│   ├──├── jwt.payload.ts # The jwt payload file implemets the jwt strategy interface
├── ├──service # The service folder is responsible for data storage and retrieval.
│   ├──├── auth.service.ts # The auth service file is responsible for jwt signing and hash password queries.
│   ├── auth.modules.ts # The mail module file contains the import of the AuthService
├── middleware # The middleware folder contains middleware for auth folder
│   ├── auth.middleware.ts/  # The middleware file contains middleware for auth folder
├── rooms  # The room folder contains the implementations of queries, api for the chat room
│   ├── dto  # The dto folder contains the data validations for the chat room apis
│   ├──├── create.rooms.dto.ts # The create rooms dto file is for validating necessary data for creating a chat room
│   ├── gateway  # The gateway folder contains the websocket implemetations for creating the chat room
│   ├──├── room.gateway.ts # The file is for the websocket implemetations for creating the chat room, adding user, sending messages
│   ├── model  # The model folder contains the database structure implemetations for the chat room
│   ├──├── connected-user.ts # The folder contains the entity and interface implemetations for creating the connected user in a room
│   ├──├──├── connected-user.entity.ts # The entity contains the connected-user database table structure.
│   ├──├──├── connected-user.interface.ts # The interface file contains the connected-user database table data.
│   ├──├── joined-room.ts # The folder contains the entity and interface implemetations for creating the joined-room 
│   ├──├──├── joined-room.entity.ts # The entity contains the joined-room database table structure.
│   ├──├──├── joined-room.interface.ts # The interface file contains the joined-room database table data.
│   ├──├── message.ts # The folder contains the entity and interface implemetations for creating a message 
│   ├──├──├── message.entity.ts # The entity contains the message database table structure.
│   ├──├──├── message.interface.ts # The interface file contains the message database table data.
│   ├──├── rooms.ts # The folder contains the entity and interface implemetations for creating a chat room 
│   ├──├──├── rooms.entity.ts # The entity contains the chat rooms database table structure.
│   ├──├──├── rooms.interface.ts # The interface file contains the rooms database table data.
│   ├──├──page.interface.ts/  # The interface file for pagination
│   ├── service  # The service folder is responsible for data storage and retrieval for the room.
│   ├──├── connected-user.ts # The folder contains the entity and interface implemetations for creating the connected user in a room
│   ├──├──├── connected-user.service.spec.ts # The service spec file contains the unit test for the connected-user apis.
│   ├──├──├── connected-user.service.ts # The service file contains the connected-user data storage and retrieval queries.
│   ├──├── joined-room.ts # The folder contains the service queries for creating the joined-room apis
│   ├──├──├── joined-room.service.spec.ts # The service spec file contains the unit test for the joined-room apis.
│   ├──├──├── joined-room.service.ts # The service file contains the joined-room data storage and retrieval queries.
│   ├──├── message.ts # The folder contains the service queries for creating the message apis
│   ├──├──├── message.service.spec.ts # The service spec file contains the unit test for the message apis.
│   ├──├──├── message.service.ts # The service file contains the message data storage and retrieval queries.
│   ├──├── room.ts # The folder contains the service queries for creating the room apis
│   ├──├──├── room.service.spec.ts # The service spec file contains the unit test for the room apis.
│   ├──├──├── room.service.ts # The service file contains the room data storage and retrieval queries.
│   ├──├──room.module.ts # The module file contains the import of the room services
├── user  # The user folder contains the implementations of queries, api for the user access
│   ├── dto  # The dto folder contains the data validations for the user apis
│   ├──├── create.user.dto.ts # The create user dto file is for validating necessary data for creating a user
│   ├──├── login.user.dto.ts # The login user dto file is for validating necessary data for a user to login
│   ├── model  # The model folder contains the database structure implemetations for the chat room
│   ├──├──user.entity.ts # The entity contains the user database table structure.
│   ├──├──user.interface.ts # The interface file contains the user database table data.
│   ├──user.controller.ts # The user controller file contains the user routes for the apis.
│   ├──user.module.ts # The user module file contains the import of the user services and controller
│   ├──user.repository.ts # The user repository file contains the database queries for users
│   ├──user.service.spec.ts # The user service spec file contains the unit test for user service apis
│   ├──user.service.ts # The user service file contains the data storage and retrieval queries for users
├── app.module.ts # The user service file contains the data storage and retrieval queries for users
├── envsample  # The envsample folder contains the samples of environment variables used in the codebase
├── dockerfile # The dockerfile that has the ports and the command to run the application.
├── package.json # The file contains the dependencies used in the ccodebase.
├── docker-compose.yaml # The docker directory that house the services and the docker environmental variables.
└── main.ts
```

## 3. Default NPM commands

The YARN commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using yarn NodeJS in development
yarn run start:dev (use this to start the application locally)

# Run the project' UNIT TESTS
yarn run test:watch(use this to start the unit testing locally)
```

## 4. Docker Command

The docker commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using npm NodeJS in development
docker-compose up

The docker configuration is in the docker-compose.yaml file

```


## 5. Project goals

The goal of this project is to build a Chat Room that allows user to create room, add users to room, send message and receive message using NestJS.

