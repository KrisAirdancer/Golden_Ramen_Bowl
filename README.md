# Golden_Ramen_Bowl

A website where my wife and I document our travels.

The current version of this site is built using Wordpress and can be viewed [here](https://www.goldenramenbowl.com).

This site might eventually replace the current one and be hosted on our Raspberry Pi instead of on Bluehost.

# Setting up this project for development

- 1. Clone the repository to local.
- 2. Run 'npm install' in the terminal to download all of the requried dependencies.
    - The required dependencies are listed in the projects.json file and will be downloaded by this command.
- 3. The project can now be run using either,
    - 'nodemon app' to run using Nodemon
    - 'node app' to run using vanilla Node.js

# Git SOP

- When pulling changes down to the Pi, pull them onto an "upgrading" branch and then merge that branch into the main branch.
- [This](https://stackoverflow.com/questions/62653114/how-can-i-deal-with-this-git-warning-pulling-without-specifying-how-to-reconci) might help with the below error.
- Look into how best to handle this error:
hint: Pulling without specifying how to reconcile divergent branches is
hint: discouraged. You can squelch this message by running one of the following
hint: commands sometime before your next pull:
hint:
hint:   git config pull.rebase false  # merge (the default strategy)
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.

# Features

**Minimum Features**

- Post writing interface w/ ability to...
    - Add new posts
    - Schedule posts to be released at a certain date and time
    - Update posts that have already been posted
    - Delete posts (remove them from the blog and database)
    - Unpublish posts
    - Write posts in either markdown or HTML
    - Add tags to posts
    - Add categories to posts
    - Insert images and align them left, right, or center
- Admin Login Page
    - Post writing interface and schdeuling pages are hidden behind this admin login page
- Blog homepage displays a set number of posts and allows users to scroll through "pages" of posts.
    - Posts are ordered from newest (on first page) to oldest (on last page).
    - Start with 5 posts per page.
- Posts are saved
    - Posts should be saved to either a database or to local (XML, JSON, etc.)

**Upgrades**

- Image gallery (side scrolling image panel) in post writing interface
- Image collage (a group of images clustered together) in post writing interface

# Outline

**Database Setup**

- Store post objects (and all other objects) in a MongoDB database
    - The HTML files referenced by the post objects should also be stored in a separate container in the same MongoDB database.
- See if we can run MongoDB locally on the Pi.
- Collections
    - Posts
    - Users
    - HTML Pages

**Admin Interface**

- Make a "hidden" admin page that has a login on it.
- The admin page will have a simple interface for creating new posts.
    - Allows new posts to be made.
        - Add title, tags, categories, everything except the body of the post.
        - When a new post is made, a new Post object will be created on the backend along with its associated HTML page.
        - The created HTML page will be a skeleton post page. As the user, we will then go write the post in that HTML (.ejs) file on the backend. When we the post is fully written, we can use this admin page to schedule a time for it to be posted.
    - Allows posts to be scheduled.
        - All posts will default to "draft" status until changed by the user.
    - Allows posts to be updated.
        - The user will be able to select a post. When they do, they will be taken to a page that allows them to make changes to all but the HTML information associated with that post. When they click "Save" the post object will be updated in the database.
        - Additionally, when the "save" button is clicked on the update page, the HTML page will be re-uploaded to the database. This way, the user can change the HTML on the backend and then come to the admin page and have the post be updated in the database easily.
        - Make sure to include a "back" button on the updates page that exits the updates page and doesn't save any of the data.
            - Should have a warning about the data not being saved when this button is clickd. A popup alert with a confirm button.

**Objects**

- Post Objects
    - Properties/Fields
        - Updated Array
            - An array field that keeps a running list of the dates and times that that post was updated.
            - Each time a post is updated, a timestamp will be added to this list.
- User Objects

**Other**

- Tags
- Categories

**Eventually/Upgrades**

- Setup a recurring backup system to save all of the blog information to a separate cloud storage service.
    - Do this manually (copy & paste style) until this is setup.

# Resources

- This [source code](https://github.com/kunaal438/blogging-site) and associated [YouTube tutorial](https://www.youtube.com/watch?v=AWHGQfzfHxI) may be helpful in getting this project outlined.
    - It would be worth downloading the source code and starting it up to see how it works.
- This [YouTube tutorial](https://www.youtube.com/watch?v=1NrHkjlWVhM&t=1739s) shows how to build a blog site that allows you to write posts in markdown.
    - It might be worth considering using the markdown interface. It looks easy to implement. (see ~29:00)
    - Here is the [source code](https://github.com/WebDevSimplified/Markdown-Blog) for the tutorial project.
- Will want to use something like Mongoose if we go with a database.
    - "Mongoose is an Object Document Mapper (ODM). This means that Mongoose allows you to define objects with a strongly-typed schema that is mapped to a MongoDB document." That is, you can define the structure of how an object will be stored in a database. This definition is called a Schema and Mongoose allows you do do this easily.
    - Read more on this [here](https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527)

# Development Stages

**Stage 1** - Setup server

- Build a basic Node.js server with an index.html (or .ejs) page.

**Stage 2** - Basic Routing

- Create additional filler pages (.html or .ejs with a header) for,
    - About
    - 404
- Setup routing between the new pages

**Stage 3** - Add post objects and storage

- Create an object to represent a blog post.
    - May wan to do this using a Mongoose schema. (if using MongoDB)
- Setup MongoDB database to store the posts
    - See if MongoDB can be hosted on local (on linux - Debian)
    - Or, instead of MongoDB, store posts to local using JSON.

**Stage 4** - Create basic post creation interface

- Make a page create.ejs (or similar) with a form for creating posts.
    - Basic fields for now. Similar to the one I made in the Node.js tutorial.
- Connect the post submission form to the MongoDB database.
    - Posts are saved to MongoDB when "Submit" is clicked.

**Stage 5** - Sort posts on homepage

- Pull posts from database (or JSON file), sort them from newest (on top) to oldest, and list them on the homepage.

**Stage 6** - Hyperlink posts on homepage to link to actual post pages

- Hyperlink the posts in the post list on the homepage
- Setup the system to generate an HTML page for a post when a user visits that post's URL. Such as via the new hyperlinks.

**Stage 7** - Create post pages on homepage

- Setup the homepage to show only the 5 most recent posts

**Stage 8** - Make older posts available on homepage

- Add "older" and "newer" links to homepage to allow users to scroll through posts, 5 at a time, starting with the newest posts.
- "newer" button should only appear when there is a page of newer posts ahead of the current page.
- "older" button should only appear when there is a page of older posts ahead of the current page.

**Stage 9** - ...


# Thinking...

- Use nodejs-crash-course/views/posts/details.ejs as an example of how to make a post page.
    - This project generated a post's page using this template and the data it pulled from the MongoDB database. See line 10, `<p><%= post.body %></p>` where the `body` field from the object in the database is inserted intot the HTML using EJS.
    - We could store HTML in the `body` field of a `Post` object and then insert that here. Just exclude the surrounding `<p>` tags.