# Wordle<sup>+</sup>

![Welcome Page]()
![Single Player Word Creation]()
![Game]()
![Multiplayer Hub]()
![Multiplayer Rankings]()
![View Personal Scores]()

# Core Features/Assignment Requirements
1) Models
    - Account, Word, Score
2) Relationships
    - 1 to 1: User to Account
    - Many to 1: Score to Word,  Score to Account
3) Multiple views
    - Many different pages and templates
    - Home page is different if the user is logged in or not
4) User created data
    - Submit score for multiplayer
    - Create account
    - Can edit account settings (password, username, display name)
5) Data/some users
    - All users can play the single player
    - Only logged in users can:
        - Multiplayer rankings, play multiplayer and submit scores
6) Template language
    - Used to "restore" a page if a login/submit is unsuccessful
    - Used when looping through data (rankings pages)
    - And other various places
7) Wordle
    - Fulling functioning Wordle game
    - Customizable Settings
        - Word length
        - Number of guesses (can do unlimited)
        - Word difficulty (common, double letters)
    - Multiplayer
        - Different options
        - Daily cups reset at midnight
    - Word passed as base64 so it is harder to cheat
8) Template inheritance + CSS + JS
    - Base views:
        - Base: general look/feel
        - Menus: centered context
        - Rankings:
    - the CSS is rather minimal/static
    - CSS and JS in the HTML, matching the inheritance
        - Often uses block.super to have multi-level inheritance
9) Small touches
    - Password visibility toggle
    - Doesn't crash/404/etc if you navigate incorrectly/with incorrect permissions
        - Try/except around POST
        - Makes sure you are authenticated
    - Error pages for 400/403/404/500
    - Clarity
        - When you have already done a daily cup
        - When you successfully change a setting
        - When you enter incorrect/incomplete data into a form
10) Running online at http://64.98.192.41:8000/wordle/
    - Should be fully functional
    - Uses just django to run!
        - CSS and JS are within the template inheritance
        - The image was converted into base64 so it could be put directly in the HTML
    - It should be firewalled away from the rest of my wifi
        - Please don't hack it or me or anything
    - NOTE: Don't put an actual password in its not secure
        - It uses http (not https)
        - But it will not harm your computer
