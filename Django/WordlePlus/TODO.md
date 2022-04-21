# Todo for Wordle<sup>+</sup>

- Avoid "confirm resubmission" message?
- After compiting MP -> rankings not hub
- CSS
- Hide html/JS inputs
- Keyboard shown in game

# Cleaning:
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
        - variables/functions start with lower case letter ('Game()' = bad)
    - fix all js/html form names
        - forms, post, js, etc
    - Make sure everything is spellled right
        - "sucess"
- HTML
    - Templates
- - Make sure redirects work correctly (and url looks good)
- Permissions
    - if user.isAuthenticated for all MP stuff
    - Careful when passing things around between pages
        - +Hidden JS fields (so word isn't given away)
- post/get
    - Try/except around all post/etc
- Clean urls/paths
    - Maybe instead of 'wordle/rankings' -> 'wordle/rankings/{{ cup }}>'
- CSS
    - Dynamic
- Dictionary?
    - 2nd dictionary with only common words?
    - Make only reasonable words picked
- Reset database
    - Rebuilt dictionary