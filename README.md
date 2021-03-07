# SquadBattle
 FiveM script/game mode for playing Team deathmatches

## How to join a Team
To join a team, you just need to type the command **/join [team]**
- [team] is the index of your team set up in **teams.json** config file

To leave a team, you just need to type the command **/leave**

As an Admin, you are able to end the game via the **/EndGame** command. 
If you had to restart the resource, but don't want to rejoin, you can just use **/reloadAll**, currently, this is only an admin command.

## Config
### settings
- NeutralZone
  - spawnpoint = *Where all players join when they are joining a server or leaving a team*
  - ped_model = *With what kind of ped they will spawn*
  - blip = *Map marker*

- Countdown
  - Minute = *How long you wait before the game starts (Minutes)*
  - Second = *How long you wait before the game starts (Seconds)*
  - MinPlayersToStart = *The minimum amount of players each team needs, to start a game*
  - PreMinute = *How long you wait to prepare for the game (Minutes)*
  - PreSeconds = *How long you wait to prepare for the game (Seconds)*

- Teams
  - slots = *Amount of Slots each team has*
  - dropweapons = *Turn on/off if players are able to drop weapons when they die*
  - health = *Maximum amount of health each player has*
  - healthLimit = *The recharge health limit of each player (only 0.1 to 0.999...)*
  - armor = *Amount of armor each player has (only 0 to 100)*

- Admins
  - All admins of the game mode, currently only with fivem:XXXXX identifier (other identifiers will be available later on)

### targets
- object_name = *Kind of vehicle/ped*
- type = *If this is a **ped** or a **vehicle***
- spawnpoint = *Where the target will spawn*
- MovesAround = *If the target is moving around*
- team = *Which team is hatefull against this target*

- Type: **PED**
  - WalkArea = *Area where the peds will walk. **MovesAround** need to be activated*
  - multipleAmount = *Amount of peds*
  - GiveWeapon = *Turn on/off if peds gets a weapon when they spawn*
  - weapon = *Which weapon they will get (spawnname)*

- Type: **VEHICLE** 
  - driver = *Ped, which will drive the vehicle*
  - driveStyle = * I guess it's self-explaining whats this does*
  - vehicleamount = *Amount of vehicles which will spawn (if this is grader then 1, vehicles will drive automaticly around)*
  - maxSpeed = *Speed limit of the vehicle (in meters per seconds)*

### teams
-"[team]"
 -  used = *If team is joinable or not*
 -  spawnpoint = *Location where all players will spawn after the fist countdown*
 -  ped_model = *ped_model* *Which kind of ped all players in this team will spawn*
 -  blip = *Map marker of this team*

### vehicles
- "[team]"
 - spawnpoint = *Location where the vehicle will spawn*
 - spawnname = *Which kind of vehicle should spawn*
 - primarycolor = *Currently unused*
 - secondarycolor = *Currently unused*
 - livery = *Currently unused*
 - limit = *Maximum amount of vehicles can spawn*

### weapons
- "[team]"
  - [weapon] = *Which weapon players will get*
