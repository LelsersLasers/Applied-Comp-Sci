# NEO CROSSER

Features/Design Choices:
- Visually Clarity
    - Hand Drawn (mouse drawn) pixel art
    - No 'overlapping' colors
    - No pointless effects
        - No particles, everything drawn has effect
    - Clean Edges
        - Rectangles with clear hitboxes
    - Animated Player
        - Animation changes only when moving
        - Changes color on death
        - Teleport leaves a trail from where you teleported to make it clear what happened
- Simple Gameplay
    - Move just up/down/left/right (no diagonal)
    - Abilites are relativly straightforward to use
    - Because of simplicity, the player has freedom to do anything
        - (not you can only R when on the left side of the screen, etc)
        - Player can use multiple abilites and move at the same time
        - (Ex: press W then A/D, now you can use Q/E either left/right while moving up)
- Keyboard Support
    - W/A/S/D or Arrow Keys to move
    - Q/E/R or 1/2/3 for abilites
    - Enter to continue/move between screens (mouse click also works)
- ??TOUCH SUPPORT??
- SOUND
    - Less 'clear' than visuals
    - Focus on many sounds at once
        - (Ex: R fire sound, multiple laser hits at once, while Q teleport sound finishes)
    - High Tempo (180 BPM) background music
        - no lyrics
    - Lack of clarity + high tempo = chaotic enviroment
        - Creates a sense of pressure to do something
- Everything is scaled with canvas.width or canvas.height
    - Designed around 900x700 px screen, but looks/works completely fine on any resonable screen size
    - The player and the ability buttons are sqaures, and they scale off the hieght
        - (player is technically 10:11, but to keep the ratio both numbers have to scale off of 1 number) 

Other Things:
- 'Screens'
    - Welcome/Directions/Main Game
    - Flashing text
- Bars on sides to give the impression the player is moving up and down, not the cars/waters
- Cars will bounce off the edges and the water blocks
    - 'Safe zones' on the other sides of water blocks
- Stunned cars will still hurt the player