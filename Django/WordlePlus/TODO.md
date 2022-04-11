# Wordle+

Launch from rankings page - works
- Avoid "confirm resubmission" message
Confirm the daily/midnight thing works

Redirect localhost/ -> localhost/wordle
After compiting MP -> rankings not hub

Cleaning:
- HTML templates
    - head/body/title/header/etc
    - Use subtemplates (Template inheritance)
- Namings
    - cup vs name, etc
    - upper case vs lower case letters vs snake_case
        - variables/functions start with lower case letter ('Game()' = bad)
- Permissions
    - if user.isAuthenticated for all MP stuff
    - Careful when passing things around between pages
- post/get
    - Try/except around all post/etc
- CSS!
- Trim dictionary
    - Make only reasonable words picked