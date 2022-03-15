# TODO

Delta time fixed?

Lives system
    - Immunity on rez
    - Every Xk points gain live?
    - And/or live pick ups?

efficeny: only check things that make sense
- LoS doesn't need to check all buildings, etc

Mario Kart speed ups?
Pickup buffs?
    - perment speed
    - longer stun protection
    - lives
    - improved HUD

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
- avoid using 'new laser' just for the ms
    - save it in a calc somewhere else
- General:
    - Simply lines
    - duplicate code -> function
    - can use 'a = b = 0'

Redo any art?
- tanks
- demensions of the textures
Update HitBoxes to match the art
- cars, tanks, ufos

Update directions
Update README