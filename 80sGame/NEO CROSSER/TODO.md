# TODO

Typescript:
- to compile: tsc game.ts classes.ts
- Use types better

Bugs:
- Cars getting stuck in walls/buildings
    - (twitching back and forth)

Make game easier
    - Getting past 6k is too hard
        - Shift to 8k

display restore touch directions
display use w/s up/down to change the selected save

mouse hover over buttons in restore screen

"Clean" code
- New instances of things do not create new audio things
    - Just create 1 on load, and play it
- LET
    - scope
- stun protection
- Delta time
    - Make sure it works
    - Make sure everything uses it
- Pause menu
    - consistent about what pauses
- animation code
- shooting code
    - optimize
- restores bugtest
    - restore w/h?
        - update hb with w/h
    - use super.restore to improve
- softCap
- General:
    - Simplify lines
    - duplicate code -> function
    - can use 'a = b = 0'
- Constructors for classes
    - what is already global var
- Remove touch code
- Set textOpacity to 1 when reused
    - new screen
    - new landslide
    - game over
    - etc

Clarity
- General colors/hitboxes
- Stun protection/dead protection

Redo art:
- tanks
- demensions of the textures
Update HitBoxes to match the art
- cars, tanks, ufos
- Multipart hitboxes?

Possible addition features:
- Let user scroll through all scores (like saves)? (rather than top 10?)
- Mario Kart speed ups
- On Demand Scaling
    - on restore
    - on screen change size
- Make Thing extend HB
- efficeny: only check things that make sense
    - LoS doesn't need to check all buildings, etc
- Settings Screen
    - toggle ufos
        - and if they can shoot
    - toggle tanks/buses
    - landslides
    - softcap
    - only set leaderboard if on default settings

Final:
- Update directions
- Update README