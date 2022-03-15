# Wordle+

Launch from rankings page - works
- Avoid "confirm resubmission" message
Confirm the daily/midnight thing works
Time driven events ("sprint")
Multiword events

SP:
- If signed in: save/restore the game automatically
    - field in the model?

MP:
- Tourements?
    - 7 days long, 1 round per day
    - Custom/challenging rules
- Save/restore progress
    - field in the model?
- Custom "lobbies"/rounds/tourements?
- Some rounds have double letters? some don't?

Oragnization:
- Save model?
    - title, current guesses, tries, time, etc
    - 1 to many? (account to saves)

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