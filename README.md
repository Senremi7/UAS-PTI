# Life Simulator Game

## Group Members
- **Jeremiah Ephraim Jonathan**
- **Damianus Lowa Mite**
- **Dhimas Alkautsar Putra Alif Viano**

**Link Google Drive:**  
[Video Demo](https://drive.google.com/drive/folders/13jvpeowvMVOfJSSeot8c1iEFrO7USII0?usp=sharing)  
[Google Drive Folder untuk poster](https://drive.google.com/drive/folders/1DbLbVhNI1SUjCbd-fu8OncG7bsUhNqP_?usp=sharing)

**Laporan:**
https://docs.google.com/document/d/19wMLH1VNWLqBQOe35x1l7zoDexshCgCtgQVf9nKOTos/edit?usp=sharing

**GitHub Source:**
https://github.com/Senremi7/UAS-PTI

**Vercel Live Host:**
https://uas-pti-zeta.vercel.app


## Gameplay Rules

### 1. Time System
- 1 real second = 1 game minute
- 24 game hours = 1 game day
- Game starts at 8:00 AM, Day 1
- Time advances automatically and through certain actions (example, sleeping, camping)

### 2. Stat Decay
- Every 5 real seconds (5 game minutes), the following stats decrease:
  - Hunger: -0.5%
  - Energy: -0.3%
  - Hygiene: -0.2%
  - Happiness: -0.4%
- Stats are capped between 0% and 100%

### 3. Critical Warnings
- Alerts appear when:
  - Hunger < 20%
  - Energy < 15%

### 4. Game Over Conditions
- Hunger = 0%: "You starved to death!"
- Energy = 0%: "You ran out of energy!"
- Happiness = 0%: "You became too depressed to continue!"
- Hygiene = 0%: "Your poor hygiene made you sick!"
- Money < $0: "You went bankrupt!"
- After game over, you can restart or quit

### 5. Location-Based Actions

#### Home
- Sleep: +30 Energy, +4 hours
- Eat: +20 Hunger
- Play Games: +20 Happiness, -10 Energy
- Shower: +20 Hygiene
- Remote Work: +$25, -20 Energy, -5 Happiness
- Read Book: +15 Happiness, -5 Energy

#### Lake (Danau)
- Fish: +15 Hunger, +10 Happiness, -10 Energy
- Swim: +15 Hygiene, +10 Happiness, -15 Energy
- Rest: +15 Energy, +1 hour
- Take Nature Photos: +$10, +10 Happiness, -5 Energy

#### Beach (Pantai)
- Swim: +20 Hygiene, +15 Happiness, -10 Energy
- Sunbathe: +20 Happiness, +10 Energy, -5 Hunger
- Build Sandcastle: +25 Happiness, -10 Energy
- Buy Souvenir: -$15, +20 Happiness

#### Mountain (Gunung)
- Hike: +20 Happiness, -20 Energy, -10 Hunger
- Camp: +20 Energy, +15 Happiness, +2 hours
- Find Treasure: +$10–$60 (random), -15 Energy
- Take Mountain Photos: +$5–$25 (random), -10 Energy

#### Temple (Candi)
- Explore: +15 Happiness, -10 Energy, -5 Hunger
- Meditate: +20 Happiness, +15 Energy, +1 hour
- Pray/Offering: -$10, random stat +5–20
- Learn History: +10 Happiness, -5 Energy

### 6. Movement
- WASD or Arrow keys for desktop movement
- On-screen buttons for mobile/touch
- Speed: 8 pixels per move

### 7. Money System
- Start: $100
- Earn: Remote work, selling photos, finding treasure, etc.
- Spend: Souvenirs, temple offerings, etc.

### 8. Character Customization
- Choose your avatar (from a selection)
- Enter your player name

### 9. Game Flow
- Select avatar and name
- Explore locations and perform actions to manage stats
- Avoid letting any stat reach zero or going bankrupt
- Game ends on failure, with options to restart or quit

### 10. Time-Based Effects
- Some actions advance the in-game time (e.g., sleep, rest, camp)
- Greeting messages change based on the time of day

### 11. Visuals & Feedback
- Status bars for all stats (with color coding)
- Animated money display when value changes
- Tooltips for actions showing stat/money effects
- Alerts for critical stat levels
