# Wordle<sup>+</sup> (core features)

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
8) Template inheritance
    - Base view
        - General look/feel
    - Base for menus
        - Small centered context
    - Base for rankings page
        - Uses template language to display different formatted lists
9) CSS
    - Rather minimal/static
    - Mostly matches the template inheritance
10) Small touches
    - Password visibility toggle
    - Doesn't crash if you navigate incorrectly
        - Try/except around POST
        - Makes sure you are authenticated
    - Clarity
        - When you have already done a daily cup
        - When you successfully change a setting
        - When you enter incorrect/incomplete data into a form
