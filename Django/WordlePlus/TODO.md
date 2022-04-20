# Wordle+

Avoid "confirm resubmission" message
- Launch from rankings page - works

Make sure redirects work correctly (and url looks good)
- EX: after setting change
After compiting MP -> rankings not hub

Cleaning:
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
        - variables/functions start with lower case letter ('Game()' = bad)
    - fix all js and html names, files too
        - forms, post, js, etc
- HTML
    - Templates
- Permissions
    - if user.isAuthenticated for all MP stuff
    - Careful when passing things around between pages
        - Hidden JS fields (so word isn't given away)
- post/get
    - Try/except around all post/etc
- Clean urls/paths
    - Maybe instead of 'wordle/rankings' -> 'wordle/rankings/{{ cup }}>'
- CSS?
- Dictionary?
    - 2nd dictionary with only common words?
    - Make only reasonable words picked
- Reset database
    - Rebuilt dictionary