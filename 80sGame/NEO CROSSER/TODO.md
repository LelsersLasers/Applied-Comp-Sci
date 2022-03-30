# TODO

# Main ideas
3.0) Redo HBs
    - Bug test
    - Tweak make sure it all looks good
5.0) Electron
4.0) Cleaning
6.0) Final

# Balance
- Harder around 6k
- Easier around 10k (by a little)
To change
- Teleport distance is independent MS
Check
- Ufos always lways the same speed
- Ufos higher delay between shots
- Tanks lower delay between shots


# Details
Typescript:
- to compile: tsc game.ts classes.ts
- Use types better

Bugs:
- FIXED?: Write scores hitting unexpected ':' when name = '   '
- FIXED?: Cars getting stuck in walls/buildings
    - (twitching back and forth)

Small Features:
- Display restore touch directions
- Display use w/s up/down to change the selected save
- Mouse hover over buttons in restore screen

Electron:
- Figure out how to put it in github
- Window refresh
    - location.reload() does not work
    - use instead: 'mainWindow.reload()'
- Screen size
    - Does not start in correct demenions
- Font?
    - Pick more specific font than 'monospace'?

"Clean" code
- use fractions everywhere
    - prefre x/2 over x * 1/2
- getName() in game.ts
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
