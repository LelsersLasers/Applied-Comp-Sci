# Castle of Lyfe: Ideas

Story:
- ???


Style:
- Castlevania ish
- 2d, side view
- Pixel art
    - Try to only use 16 colors total?
- Animations for everything: idle, attack, run, jump, transition
- Good "feedback" (on hit, etc)
- Minimal ist but polished/smooth

General:
- No mouse support
    - Navigate with WASD/Arrow keys/[k]ey
- Saving:
    - Tomb raider like
    - Auto save to that 'slot'
- Pause game when in inventory/interact
- Scaling:
    - Use delta (relative to 60fps)
    - Fill screen but keep 16:9

Player:
- HP
    - hp regen out of combat
- Lives
    - Pick up extra lives
- XP
    - From: new room, certain interactions, killing enemy, etc
    - Every level up something happens:
        - Increased HP, extra live, new loot, etc

Game Rooms:
- Always the same
    - Hand built
- Camera:
    - Keep player centered
    - Up until the room runs out in that direction
- Features:
    - Enemies
    - Already dropped loot
    - Chests
    - Traps:
        - Spikes, falling stuff, tripwire, etc
    - Possible verticality
        - Ladders, stairs, trap door

Gameplay Controls:
- A/D = Left/Right
- W = Jump/Up
- S = Duck/Down
- Q = attack 1
- E = attack 2
- R = swap weapons
    - cd: medium
- T = use potion
- F = interact
    - Loot
    - Sign
    - Door (between rooms)
- I = inventory

Inventory:
- Hold all items/weapons
- Equip 2 weapons at once
- Equip 1 potion
- 'Console' like movement for equiping/dequiping items

Weapons:
- Sword:
    - Swipe in facing direction
        - cd: low
    - Spin hitting enemies on all sides
        - cd: medium
- Bow
    - Hold to charge, release to fire
        - Max charge 3 sec -> les charge less power
        - Slow down while charging
        - cd: very low
    - Quickly fire 5 shoots
        - uses ammo
        - cd: high
    - Ammo based
        - pick up arrows
        - reuse missed arrows
        - reuse arrows from dead enemy
- Shield
    - Block all damage from direction for 1 sec
        - cd: low
    - Dash a small distance forwarding and stun first target hit
        - cd: low
- Sensor
    - Deactive a trap
        - cd: low
    - Send out a pulse to highlight all traps
        - cd: medium

Enemies:
- Different types
    - Flying, swords, etc
    - Different aggros:
        - Always attack
        - Neutral (attack after attacked)
    - Different 'vision cones'
- Display HP above model

Death:
- Keep inventory = true
- XP reset to 0% of current level
- Some rooms will have 'totems'
    - interact with totem to set respawn point there
