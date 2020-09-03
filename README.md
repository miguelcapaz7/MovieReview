# MovieReview

## Description
A movie review application built with Node.js and a MongoDB backend. Users can register an account and login to rate a movie. They can write a written review of the movie and rate it out of 5, where the average is calculated. Reviews can be viewed by any user, and each signed in user can manage their written reviews such as editing or deleting it.

## Technologies Used
  - HTML/EJS
  - Node.js
  - MongoDB
  - Visual Studio Code
  
## Prerequisites
The following are **required** to install:
  - [NodeJS](https://nodejs.org/en/)
  - [MongoDB](https://www.mongodb.com/try/download/community)
  
**Dependencies**

Navigate the folder where app.js is located in and run `npm install express --save` to install EJS.

## Usage
You must create a database in MongoDB in order to allow the data from the application to be stored.

Navigate to the Mongo bin folder -> `C:\Program Files\MongoDB\Server\4.2\bin`

Next, type the following commands to create the database: 

```
mongod
mongo
use movieDB
```

**Note:** The database must be named **movieDB**.

Now we need to add the movies to the database...

```
db.movies.insert(
    [
        { _id:1, movieName:'Kiss of the Spiderwoman' },
        { _id:2, movieName:'Jaws IV'  },
        { _id:3, movieName:'Cats' },
        { _id:4, movieName:'Star Wars'  },
    ]
)
```

You can now run the app where the app.js folder is in by using your IDE or by using `node app.js`. Then go to localhost:1337 in your browser to view the application.

This is a project from the Developing Web Applications course at BCIT.
