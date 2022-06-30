# nodejs-crash-course

My code from following The Net Ninja's YouTube tutorial [Node.js Crash Course](https://www.youtube.com/watch?v=zb3Qk8SG5Ms&amp;list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&amp;index=1). 

99% of the code in this project was developed by The Net Ninja. I modified it slightly and added comments to help me learn from the tutorial videos.

## Demonstration

<img src="demo_content/NodeJS Project Demo.gif" alt="a gif recording of my project in use" width="100%">




## Setting up this project

- 1. Clone the repository to local.
- 2. Run 'npm install' in the terminal to download all of the requried dependencies.
    - The required dependencies are listed in the projects.json file and will be downloaded by this command.
- 3. The project can now be run using either,
    - 'nodemon app' to run using Nodemon
    - 'node app' to run using vanilla Node.js


## Notes

- The package-lock.json file keeps track of the different dependency versions for our project.
- The package.json file keeps track of details regarding our project.
    - This includes scripts that can be run for our project.
    - keeps track of our project's dependencies.
    - The package.json file can be generated automatically using the terminal command 'npm init' and then answering the questions when prompted. The answers to those questions are placed in the package.json file and can thus be changed there later.
    - The package.json file makes sharing the project easier.
        - The node_modules file could be huge b/c of many dependencies. The package.json file allows us to specify the required dependencies so we can share only the project code, and not the node_modules folder with all of the dependency code, which saves bandwidth and cloud storage space when sharing the project.
        - If we download a project, we can run the 'npm install' command and it will parse the packages.json file and install all of the specified dependencies for us.
- View engines are used to add dynamic content to webpages.
    - We can use HTML syntax, but include variables that get filled from something like a database before sending the HTML to the browser.
    - Some options for view engines inclue Express Handlebars, Pug, or EJS (the one we are using in this tutorial).
- Middleware
    - Code that runs on the server between the server receiving a request and sending a response is middleware.
        - ex. Server gets a request > middleware runs to do something > server sends a response
    - Middleware is generally run using the .use() function.
    - We can have many different middleware running.
    - ex. The .get() function is middleware.
    - Middleware runs top to bottom in the code and will keep running unitl it completes or we tell it to stop.
    - Middleware can be used for...
        - Logging
        - Authentication
        - Parsing JSON requests
        - Returning 404 pages
        - And much, much more!
- MongoDB
    - A NoSQL database.
    - Collections
        - Like tables in SQL databases.
        - Store a specific type of data.
        - Contain only one kind of data.
        - Can make more than one collection.
    - Documents
        - The data stored by collections.
        - Store key-value pairs (This is the actual data. The document is just the container for the data.)
    - Collections are containers collections of (containers for) Documents and Documents are collections of key-value pairs (data).
    - Installing MongoDB
        - Can install locally or on a cloud service.
- Mongoose
    - Mongoose is an ODM library: Object Document Mapping library
    - It provides an easier way to interact with a database.
    - It makes queries, etc. for us.
    - Uses schemas & models
        - Schemas define how a type of data is structured. Such as a blog post always has a title, a snippet, and a body.
        - Models define how an application communicates with a database.
            - Has functions for carrying out operations to read, write, and perform other actions on the database.
- Request Types for REST/CRUD
    - **GET:** Requests to get a resource.
    - **POST:** Requests to create new data (eg. a new blog post).
    - **DELETE:** Requests to delete data (eg. remove a blog post).
    - **PUT:** Requests to update data (eg. change a blog post).
- Route Parameters
    - Route parameters are the parts of a route that can change
    - eg. localhost:3000/posts/:id --- The :id is a variable
    - eg. localhost:3000/posts/50 --- The 50 is a variable
- Express Router
    - The Express Router is a package that comes with Node.js.
    - Express allows us to group routes into groups of related routes.
        - eg. All of the '/posts/...' routes can be grouped so that there aren't a bunch of route calls in the app.js file itself. Instead, we only need one.
    - This makes the code cleaner and easier to maintain and develop.
    - It is good practice to organize the routes into a directory called routes. Wherein there are files that define the routes.
- MVC
    - Model View Controller.
    - Models are how the data structures are defined (databases, etc.).
    - Views are the HTML templaes and CSS.
    - Controllers link the Model and View.
        - These are the route handlers.
        - Using MVC, we will pull the route handlers out of the code and put them into their own file.
>>>>>>> tutorial-11-express-and-MVC
