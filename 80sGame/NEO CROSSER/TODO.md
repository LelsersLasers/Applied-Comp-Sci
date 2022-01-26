# TODO

UFOs shoot lasers when score > 10k (softcap)
- draw lasers at correct angle
    - laser takes in an angle (not dir)
- stun player
    - stop perma stun
- restore ufo lasers
- visual clarity
    - ligher blue
        - same as the red laser (#ff000 -> #ff0055" but for blue)
    - targeting indicator
        - COLOR?
        - only show when not obstructed?

Pick "soft caps" for score to balance:
- "CONST SOFTCAP = {SCORE}"
    - ufo spawn rates
    - ufo speed
    - when ufos start shooting lasers
        - shoot rate
        - laser speed
    - land slide spawn rates
    - land slide speed
    - land slide pull rate
    - car speed

Change updateHB from a player/ufo to a class HitBox
- "useSmallHB()"

LandSlide:
- Texture
- Sound

- E SOUND

- display restore touch directions
- display use w/s up/down to change the selected save

- mouse hover over buttons in restore screen

# 

- "clean" code
    - LET
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