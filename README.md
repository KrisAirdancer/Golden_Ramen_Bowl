# Golden_Ramen_Bowl
A website where me and my wife document our travels.

The current version of this site is built using Wordpress and can be viewed [here](https://www.goldenramenbowl.com).

This site might eventually replace the current one and be hosted on our Raspberry Pi instead of on Bluehost.

## Setting up this project for development

- 1. Clone the repository to local.
- 2. Run 'npm install' in the terminal to download all of the requried dependencies.
    - The required dependencies are listed in the projects.json file and will be downloaded by this command.
- 3. The project can now be run using either,
    - 'nodemon app' to run using Nodemon
    - 'node app' to run using vanilla Node.js

## Git SOP

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

## TODO/OUTLINE

**Database Setup**

- Store post objects (and all other objects) in a MongoDB database
    - The HTML files referenced by the post objects should also be stored in a separate container in the same MongoDB database.
- See if we can run MongoDB locally on the Pi.
- Collections
    - 

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

## Resources

- This [source code](https://github.com/kunaal438/blogging-site) and associated [YouTube tutorial](https://www.youtube.com/watch?v=AWHGQfzfHxI) may be helpful in getting this project outlined.
    - It would be worth downloading the source code and starting it up to see how it works.