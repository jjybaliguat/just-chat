
# Just-Chat

Just-Chat is a simple chat application.
It uses Socket.io for realtime communication and MongoDb for database.

## Tech Stack

**Frontend:** NextJS

**Backend/Server:** Node JS, Express JS

**Database:** Mongo DB

https://just-chat-one.vercel.app/

# How to Run the Project

## Run in Localhost

Clone the project

```bash
  git clone https://github.com/jjybaliguat/just-chat.git
```

Go to the project directory

```bash
  cd just-chat
```

Install dependencies

```bash
  npm install
```

## Starting the Front-end

```bash
  cd front-end/
  npm install
```

```bash
  npm run dev
```
Start the Server

```bash
  //open now terminal
  cd backend
  npm run dev
```

# BACKEND ENVIRONMENT VARIABLES

- PORT (port number ex. 5000)
- MONGO_URI (get the connection url from your mongodb database)
- NODE_ENV (value="development")
- TOKEN_SECRET (any string)
- REFRESH_SECRET (any string)
