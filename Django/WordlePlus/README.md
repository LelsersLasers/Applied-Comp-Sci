# Wordle<sup>+</sup>
<h2>
    All types of Wordle! From online globally ranked cups to custom rules to the original Wordle, this site has it all!
</h2>

Actual Game - (note: I am terrible at this game)
![Actual Game](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/game.PNG)

Helper Tool
![Helper Tool](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/helper_tool.PNG)

Welcome Page
![Welcome Page](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/welcome.PNG)

Single Player Word Creation
![Single Player Word Creation](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/SP_launcher.PNG)

Multiplayer Hub
![Multiplayer Hub](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/MP_hub.PNG)

Global Multiplayer Rankings
![Global Multiplayer Rankings](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/MP_rankings.PNG)

View Personal Scores
![View Personal Scores](https://github.com/Lord-Lelsers/Applied-Comp-Sci/raw/main/Django/WordlePlus/showcase/personal_scores.PNG)

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
        - Color highlighting for wrong, right, and in word
            - Also highlights the on screen keyboard
        - Works the same way as the real Wordle (with the double letters, etc)
    - Customizable Settings
        - Word length
        - Number of guesses (can do unlimited)
        - Word difficulty (common, double letters)
    - Multiplayer
        - Different options
        - Daily cups reset at midnight
    - Word passed to frontend as base64 so it is harder to cheat
8) Template inheritance + CSS + JS
    - Base views:
        - Base: general look/feel
        - Menus: centered context
        - Rankings:
    - The CSS is rather minimal/static
    - CSS and JS in the HTML, matching the inheritance
        - Often uses block.super to have multi-level inheritance
9) Mobile "friendly"
    - Mostly designed for computer
        - The CSS/styles might be a bit small on mobile
        - PLEASE VIEW WITHOUT AN IFRAME!
    - All navigation buttons can be used by touch
    - All text inputs bring up the virtual keyboard when on moblie
    - Wordle keyboard is full featured and works as well as a normal keyboard
10) Small touches
    - Password visibility toggle
    - Doesn't crash/etc if you navigate incorrectly/with incorrect permissions
        - Try/except around POST
        - Makes sure you are authenticated
    - Error pages for 400/403/404/500
    - Clarity
        - When you have already done a daily cup
        - When you successfully change a setting
        - When you enter incorrect/incomplete data into a form
11) Running online at <http://lelserslasers.pythonanywhere.com/wordle/>
    - Should be fully functional
    - Uses just django to run without any relience on static files!
        - CSS and JS are within the template inheritance
        - The image was converted into base64 so it could be put directly in the HTML
12) Helper tool
    - You can enter info to help you narrow down the final word
    - See pictures or <https://github.com/LelsersLasers/NewYorkTimesWordGameHelpers/>
