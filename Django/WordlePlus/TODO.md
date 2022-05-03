# Todo for Wordle<sup>+</sup>

Verify:
- midnight thing works

Changes:
- Avoid "confirm resubmission" message?
- Hide html/JS inputs
- CSS
    - Make sure rankings look fine when there are a lot of them
    - in game css
        - make it look good
    - Dynamic??
- Prepare for full release
    - HTTPS, debug mode off, etc
    - min.js?
    - 404/page not found/user entered bad url
    - Reset database
        - (Rebuilt dictionary)
- Phone support?
    - Keyboard shown in game
    - Dynamic CSS/layouts

Cleaning:
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
    - fix all js/html form names
        - forms, post, js, etc
    - Make sure everything is spellled right
    - Wordle+ -> Wordle<sup>+</sup>
- Permissions
    - if user.isAuthenticated for all MP stuff
        - When to check isAuthenticated and when is it not needed
    - post/get
        - Try/except around all post/etc
    - "Auto back path" on fail of post/get or authentication
- Templates:
    - block.super