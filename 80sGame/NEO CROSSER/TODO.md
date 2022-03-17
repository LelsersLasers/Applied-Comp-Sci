# TODO

linearize pickup values

Make game easier
    - Getting past 6k is too hard
        - Shift to 8k

efficeny: only check things that make sense
- LoS doesn't need to check all buildings, etc

Mario Kart speed ups?
Pickup buffs?
    - other buffs:
        - Longer stun protection
        - Etc
    - improved HUD to showcase buffs
    - Collect animation

On Demand Scaling
- on restore
- on screen change size

Make Thing extend HB?

SETTINGS SCREEN
    - toggle ufos
        - and if they can shoot
    - toggle tanks/buses
    - landslides
    - softcap
    - only set leaderboard if on max settings

display restore touch directions
display use w/s up/down to change the selected save

mouse hover over buttons in restore screen

Let user scroll through all scores (like saves)? (rather than top 10?)

Clarity
- General colors/hitboxes
- Stun protection/dead protection

"Clean" code
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
- for var i vs let i
- softCap
- touch code
    - remove/rework inputmode = 'key'
- General:
    - Simply lines
    - duplicate code -> function
    - can use 'a = b = 0'
- Constructors for classes
    - what is already global var

Redo any art?
- tanks
- demensions of the textures
Update HitBoxes to match the art
- cars, tanks, ufos

Update directions
Update README