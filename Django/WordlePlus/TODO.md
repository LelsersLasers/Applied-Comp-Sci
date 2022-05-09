# Todo for Wordle<sup>+</sup>

Verify:
- midnight thing works

Changes:
- Prepare for full release
    - Debug mode off
    - HTTPS
    - Secret key
    - min.js?
    - (python manage.py check --deploy)
    - Reset database
        - (Rebuilt dictionary)
- Apache for static?
- CSS - Dynamic??
- Phone support?
    - Keyboard shown in game
    - Dynamic CSS/layouts

Cleaning:
- Avoid "confirm resubmission" message?
- Hide html/JS inputs
- Namings
    - cup over name, etc
    - snake_case for vars and funtions
    - fix all js/html form names
        - forms, post, js, etc
    - Make sure everything is spelled right
    - Wordle+ -> Wordle<sup>+</sup>
- Permissions
    - if user.isAuthenticated for all MP stuff
        - When to check isAuthenticated and when is it not needed
    - post/get
        - Try/except around all post/etc
    - "Auto back path" on fail of post/get or authentication
- Templates:
    - Use block.super