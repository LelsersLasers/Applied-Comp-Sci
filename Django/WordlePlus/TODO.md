# Todo for Wordle<sup>+</sup>

Rebuild dictionary (for common words)

Verify:
- midnight thing works

Templates:
- block.super

Other:
- Avoid "confirm resubmission" message?
- CSS
    - in game css
        - make it look good
    - Make sure rankings look fine when there are a lot of them
    - Personal rankings seperated by mini headers per cup
- Hide html/JS inputs
- Prepare for full release
    - HTTPS, debug mode off, etc
- Phone support?
    - Keyboard shown in game
    - Dynamic CSS/layouts

Cleaning:
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
        - variables/functions start with lower case letter ('Game()' = bad)
    - fix all js/html form names
        - forms, post, js, etc
    - Make sure everything is spellled right
    - Wordle+ -> Wordle<sup>+</sup>
- HTML
    - Templates (inheritance)
- Permissions
    - if user.isAuthenticated for all MP stuff
    - Careful when passing things around between pages
        - +Hidden JS fields (so word isn't given away)
    - post/get
        - Try/except around all post/etc
    - "Auto back path" on fail of post/get or authentication
    - When to check isAuthenticated and not needed
- Clean urls/paths
    - Maybe instead of 'wordle/rankings' -> 'wordle/rankings/{{ cup }}>'
    - remove the "display_"
    - Make sure redirects work correctly (and url looks good) -> use request.session
        - only "display_" returns a html page
            - Everything else redirect
            - Every template can only be returned by 1 function
- CSS
    - Dynamic?
    - Inheritance matches templates?
- Reset database
    - (Rebuilt dictionary)