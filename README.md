# Golden_Ramen_Bowl
A scratch built personal website for me and my wife.

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

