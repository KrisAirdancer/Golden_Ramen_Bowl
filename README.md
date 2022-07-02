# Golden_Ramen_Bowl

A website where my wife and I document our travels.

The current version of this site is built using Wordpress and can be viewed [here](https://www.goldenramenbowl.com).

This site might eventually replace the current one and be hosted on our Raspberry Pi instead of on Bluehost.

# Setting up this project for development

1. Clone the repository to local.
2. Run 'npm install' in the terminal to download all of the requried dependencies.
    - The required dependencies are listed in the projects.json file and will be downloaded by this command.
3. The project can now be run using either,
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

- Image gallery (side scrolling image panel) in post writing interface.
- Image collage (a group of images clustered together) in post writing interface.
- Add logging to the site.
    - i.e. Error logging, logging requests made to the site, etc.
    - Store these in a separate Collection in MongoDB server. Maybe...(might just want to store these in a text file that gets deleted every few days to prevent a data storage overload issue).

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
- A list of [HTML Tags](https://www.tutorialstonight.com/html-tags-list-with-examples.php#:~:text=%20HTML%20Tags%20List%20%201%20HTML%20Basic,create%20any%20hyperlink%2C%20defining%20connection%20with...%20More%20)
    - Look over section 11, "General Tags"
    - We will likely want to put the central section of the site (post content, the list of posts, etc.) inside a `<main>` tag.

# Development Stages

✔️ **Stage 1** - Setup server

- Build a basic Node.js server with an index.html (or .ejs) page.

✔️ **Stage 2** - Add pages

- Create additional filler pages (.html or .ejs with a header) for,
    - About
    - 404

✔️ **Stage 2.1** - Add Nav Bar

- Add partials to project and make the nav bar (menu) partials.
- Skip footer, header, etc. for now.
- Add Nav Bar to all pages.

✔️ **Stage 2.2** - Basic Routing

- Setup routing between the new pages.
- Routing for,
    - About Us page
    - Homepage
    - 404 not found page

✔️ **Stage 2.3** - Finish adding partials

- See head.ejs in Node.js Crash Course project for how this works.
- Replace the `<head>` tags currently in the page .ejs files with an EJS tag that pulls in the head.ejs.
- Add the rest of the partials for the site:
    - footer.ejs
    - header.ejs
    - sidebar.ejs - just do something basic for this one for now.
- Add EJS "imports" for each of these components to all of the .ejs pages that need them.
    - All pages need all of thse partials (including nav bar).

✔️ **Stage 3** - Add post objects and storage

- Create an object to represent a blog post.
    - Do this using a Mongoose schema. (b/c using MongoDB)
- Setup MongoDB database to store the posts
    - MongoDB has a free plan that will work for our small blog.

✔️ **Stage 4** - Create basic post creation interface

- Make a page create.ejs (or similar) with a form for creating posts.
    - Basic fields for now. Similar to the one I made in the Node.js tutorial.
    - In fact, just pull that one into this project and modify it to fit our needs.
- Connect the post submission form to the MongoDB database.
    - Posts are saved to MongoDB when "Submit" is clicked.

✔️ **Stage 4.1** - Add markdown/html support to post creation page

- Get the post creation page structured to accept markdown for the body of the post.
    - This only needs to be done for the body. All other post elements will be styled using styles.css.
    - Make the markdown an upgrade if it isn't intuitive. Could just type HTML into the text box and have that stored as the body of the text and it just gets injected directly into the page that displays the post.

✔️ **Stage 4.1.1** - Add additional post creation fields

- Add the following,
    - ✔️ Featured image
        - Each post should have a featured image.
        - This could just be a partial that has a variable that gets filled with a path to an image on local using an EJS variable. The path to the image could be stored in the Post Schema on and thus on MongoDB.
    - ✔️ Tags (not adding categories for now)
    - Any images in a given post should be placed in a single resources directory to make referencing them easy.

**Stage 4.2** - Make posts editable

- Add an option to edit the posts.
- Add a small link to the bottom of all posts that leads to the "edit post" page.

**Stage 4.2.1** - Add an image upload field to "Create" and "Edit" pages

- An image upload field.
    - Should allow a user to upload an image.
    - There should be a separate "upload images" option, that doesn't save the post, but does save all of the images to the correct directory. This way it is easy to upload any photos you want in a post as you write the post and know exactly what directory to reference when you add `<img>` tags to the post body.

**Stage 4.3** - Hide edit and create behind admin login

- At the bottom of the site, have an "admin" link.
    - This link will ask for a login.
    - If the correct login is provided, the user will be redirected to a page with two links: "edit" and "new post."
    - If a user tries to access any of the admin pages directly, they will be redirected to the login page.
- When the edit button is clicked, it should ask for a password and username.
    - If vaild credentials are given, the user should be taken to the "edit post" page.
    - If credentials are invalid, redirect the user to the blog homepage and display a notification that their login credentials were incorrect. Just use an `alert()` for this.
- Have a "hidden" page (can only be accessed by typing the direct URL into the browser) (or maybe have a small "admin" link at the bottom of the page) that leads to the a login that works the same as the "edit" button, but when the correct credentials are given, the user is taken to the "create post" page.
- Google/YouTube how to setup a login system.

**Stage 5** - Sort posts on homepage

- Pull posts from database (or JSON file), sort them from newest (on top) to oldest, and list them on the homepage.

**Stage 6** - Hyperlink posts on homepage to link to actual post pages

- Hyperlink the posts in the post list on the homepage
- Setup the system to generate an HTML page for a post when a user visits that post's URL. Such as via the new hyperlinks.

**Stage 7** - Show only 5 posts per page

- Setup the homepage to show only the 5 most recent posts

**Stage 8** - Make older posts available on homepage

- Add "older" and "newer" links to homepage to allow users to scroll through posts, 5 at a time, starting with the newest posts.
- "newer" button should only appear when there is a page of newer posts ahead of the current page.
- "older" button should only appear when there is a page of older posts ahead of the current page.

**Stage 9** - ...

**Stage ??** - Setting up post snippets/"more" divider

- It may be easiest to start by just leaving the snippets field and copy and pasting the first paragraph of the post into that field.
    - If we need to update the post, we just copy and paste into the edit box.
- Figure out how to set up the posts such that when we write a post, we don't have to include a snipped field separate from the post. Instead, we should be able to write the post and have the frontend JavaScript search the post and pull out only the first paragraph and show that on the homepage of the site. This way, we don't have to write that separately or copy and paste it from the actual post into the "snippet" textbox.
    - This might be doable by having the JavaScript parse the HTML tags and find the first set of `<p>` tags in the post and display that text as the post preview.

**Stage ??** - Hide admin pages behind a login

- Remove all links to admin pages (post creation page, etc.)
- Add a login system that is required to access the admin pages.
- Add users accounts.
    - (This should be done on the backend. No need to create a frontend way to do this since we will almost never, if ever, need to add new users.)
    - Vista
    -Chris
    - Golden Ramen Bowl (gneric site management account)

**Stage ??** - Clicking author's name displays all posts by that author

- Each post should have the author's name listed at the bottom. 
- The author's name will be hyperlinked and when it is clicked on, it will take the user to a page that lists all of the posts written by that author.

**Stage ??** - Figure out syntax in 404 handler

- In the 404 handler a "title" property is passed into the .render() call. Figure out what that title is for and what it does.

**Stage ??** - Add 'title' headers

- For each of the responses that we make from app.js (or anywhere that sends stuff to the browser), add a header to the response as is done in the 404 handler in app.js.
- The header should set the title that appears in the tab on the browser. I think...
- Go look in Nodem.js Crash Course udner views/partials/head.js line 4. Figure out where that title variable is being pulled in by EJS. I think that sets the text seen in the browser tab.

**Stage ??** - Add status codes to all .render() calls

- For all calls to .render(), specify the status code to return.
- This is truly optional.
- See the 404 page handler for this in app.js.

**Stage Other** - Additional stuff that doesn't fit in a single stage yet

- Rig the site to show the correct name in the browser tabs/window.
    - This can be done in part by setting the 'title' value in the objects that are passed into .render() in blogController.js.
    - That passed value is passsed as data to the .ejs page for the page being rendered (along with any .ejs pages that are injected into that page, such as header.ejs) and can be used as variables via `<%= variable-name %>`
- Pages to add:
    - A page that lists all of the post titles as hyperlinks automatically.
        - This is the equivalent of the "Super Simple Archive" WordPress plugin we use.
    - Posts by activity type page
    - Posts by year page
    - *Might be able to automate the "posts by..." pages.
        - Activity type uses tags to list them out: 'if tag === hiking, add <h2>Hiking</h2> and list posts with that tag'
        - Same thing for year, but using the year tags.
- Add custom slugs to the webpages (especially the articles that will have a slug that is a random ID)
  - See [this](https://www.youtube.com/watch?v=1NrHkjlWVhM&t=2461s) at ~42:00.
- Once the first complete and usable version of the site is live on the RPI, tag the version that went out as GRBv1.0.
    - Figure out how to get the verison tag to appear on GitHub (because it looks cool).

**Stage Second to Last** - Archive learning material

- Archive all of the tutorials that I've followed to get this stuff setup.

**Stage Last** - Finialize Documentation

- We won't be working with this code often, but we WILL be using the blog and will need to maintain and upgrade it from time to time, so we need to make sure our future selves can understand it.
- Go throgh the entire project and do the following,
    - Add documentation comments anywhere that I haven't already. Fill in the gaps.
        - Over explain if necessary, even if it feels silly. It is easy to forget how this stuff communicates.
    - Add a section to this README that explains (in stepwise fashion) how the entire project runs.
        - How the server is setup.
        - How browser requests are made.
        - How our server responds to requests.
        - How HTML pages are built before being served to the browser.
        - How any JavaScript works/fits into the project.
        - etc. 
        - Explain and document everything.

**Future Upgrades** - Upgrades that might be added in the future

- Consider adding support for markdown in the new post creation editor.
    - Didn't do this initially b/c HTML could be injected raw into the post by EJS which this provided the fastest and easiest route to get images and other HTML-built content into the posts. Additionally, rendering markdown would have requried a package install (marked library), which is one more dependency and therefore more potential maintenance in the future. See [here](https://www.youtube.com/watch?v=1NrHkjlWVhM&t=2461s) at ~42:00 for more on that point.
- Add a list of tags to each post.
    - The tags are hyperlinked and, when clicked, will display all posts with that tag.
- Consider changing from MongoDB to self-hosted JSON Server.
    - See these two tutorials from The Net Ninja: [Part 1](https://www.youtube.com/watch?v=mAqYJF-yxO8&t=1503s) and [Part 2](https://www.youtube.com/watch?v=VF3TI4Pj_kM&t=401s).

**Ongoing Maintenance**

- Each time we add a feature (or remove/update something), add documentation for it.
    - Add a section to the README explaining how it works.
    - Add in-code comments to any new code that explains how that code works.


# Thinking...

- Use nodejs-crash-course/views/posts/details.ejs as an example of how to make a post page.
    - This project generated a post's page using this template and the data it pulled from the MongoDB database. See line 10, `<p><%= post.body %></p>` where the `body` field from the object in the database is inserted intot the HTML using EJS.
    - We could store HTML in the `body` field of a `Post` object and then insert that here. Just exclude the surrounding `<p>` tags.
