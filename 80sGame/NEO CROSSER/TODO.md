# TODO

# Main ideas
2.0) Bug test current
3.0) Redo HBs
    - Things extend HB or Things.hb = []
    - Allow hitboxes to be more custom to the class and match art
    - 'Dynamic HB'
        - Use normal HB for walls/buildings
        - Smaller for hit against enemy
    - - Make Thing extend HB
4.0) Cleaning
5.0) Electron
6.0) Final


# Details
Typescript:
- to compile: tsc game.ts classes.ts
- Use types better

Bugs:
- FIXED?: Cars getting stuck in walls/buildings
    - (twitching back and forth)

display restore touch directions
display use w/s up/down to change the selected save

mouse hover over buttons in restore screen

ELECTRON

"Clean" code
- LET
    - scope
- stun protection
- Delta time
    - Make sure it works
    - Make sure everything uses it
- Pause menu
    - consistent about what pauses
- restores bugtest
    - restore w/h?
        - update hb with w/h
    - use super.restore to improve
- softCap
    - Make sure everything uses it
    - Tune/balance
- General:
    - Simplify lines
    - duplicate code -> function
    - can use 'a = b = 0'
- Set textOpacity to 1 when landslide comes onto screen
- Constructors for classes
    - what is already global var
- Remove touch code
    - Delete on restore screen?

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