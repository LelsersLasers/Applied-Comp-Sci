# Wordle+

Launch from rankings page - works
- Avoid "confirm resubmission" message
Confirm the daily/midnight thing works

Redirect localhost/ -> localhost/wordle
After compiting MP -> rankings not hub

back_to_welcome() vs redirect_to_welcome()

Cleaning:
- HTML templates
    - head/body/title/header/etc
    - Use subtemplates (Template inheritance)
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
        - variables/functions start with lower case letter ('Game()' = bad)
    - fix all js and html names too
        - forms, post, js, etc
- Reset database
    - Rebuilt dictionary
    - Do after name tweaks
- Permissions
    - if user.isAuthenticated for all MP stuff
    - Careful when passing things around between pages
        - Hidden JS fields (so word isn't given away)
- post/get
    - Try/except around all post/etc
- CSS!
- Dictionary
    - 2nd dictionary with only common words?
    - Make only reasonable words picked