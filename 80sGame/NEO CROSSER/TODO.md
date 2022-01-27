# TODO

Restore ufo lasers


Clarity
- targeting indicator for ufos
    - Targeting noise
    - Use different texture rather than than red sqaure for ufo
    - line between ufo and player
        - [X] only show when not obstructed
        - [X] only target when in range
- General colors/hitboxes
    - Check w/ Jerry/Andrew

Pick "soft caps" for score to balance:
- [ ] ufo spawn rates
    - base is 1/15 per car
    - double at softCap
        - not linear
- [ ] ufo speed
    - base ?????
    - double at softCap
        - linear
- [ ] when ufos start shooting lasers
    - start at 1/2 of softCap
- [ ] land slide spawn rates ?
- [ ] land slide speed
- [ ] land slide pull rate ?
- [ ] car speed ?

Change updateHB from a player/ufo to a class HitBox
- "useSmallHB()"

LandSlide:
- Texture
- Sound

E SOUND

TANKS
    - Start at 1/2 softCap
    - Stun imunne
    - Shoots lasers at player
    - Works like the buses
        - use this.type in class Car

On Demand Scaling
- on restore
- on screen change size

- display restore touch directions
- display use w/s up/down to change the selected save

- mouse hover over buttons in restore screen

# 

- "clean" code
    - LET
    - stun protection
    - restores bugtest
        - restore w/h?
            - update hb with w/h
    - duplicate code?
    - for var i vs let i
    - const/let/var
        - scope

- Update directions
- Update README

- Update and redo libary ipad code