onNet("SetMapBlips",  async (teams) => {
    for (const key in teams) {
        if(teams[key]["used"]) {
            let team = teams[key]
        
            let blip = AddBlipForCoord(team["spawnpoint"][0], team["spawnpoint"][1], team["spawnpoint"][2])
            AllBlips.push(blip)
            SetBlipSprite(blip, team["blip"]["sprite"])
            SetBlipDisplay(blip, 4)
            SetBlipScale(blip, team["blip"]["scale"])
            SetBlipColour(blip, team["blip"]["color"])
            BeginTextCommandSetBlipName('STRING')
            AddTextComponentSubstringPlayerName(team["blip"]["name"])
            EndTextCommandSetBlipName(blip)
        }
    } 

    let blip = AddBlipForCoord(686.42, 578.11, 130.46)
    AllBlips.push(blip)
    SetBlipSprite(blip, globalSettings["NeutralZone"]["blip"]["sprite"])
    SetBlipDisplay(blip, 4)
    SetBlipScale(blip, globalSettings["NeutralZone"]["blip"]["scale"])
    SetBlipColour(blip, globalSettings["NeutralZone"]["blip"]["color"])
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName(globalSettings["NeutralZone"]["blip"]["name"])
    EndTextCommandSetBlipName(blip)
})

onNet("LeaveArea",  async () => {
    currentTeam = undefined
    exports.spawnmanager.spawnPlayer({
        x: globalSettings["NeutralZone"]["spawnpoint"][0],
        y: globalSettings["NeutralZone"]["spawnpoint"][1],
        z: globalSettings["NeutralZone"]["spawnpoint"][2],
        model: globalSettings["NeutralZone"]["ped_model"]
    });

    for (const key in AllBlips) {
        RemoveBlip(AllBlips[key])
    }
})

onNet("onPlayerDeath", async () => {
    AnimpostfxPlay('DeathFailOut', 0, true)
    if (currentTeam != undefined && globalSettings["teams"]["dropWeapons"] && !countdownActive) {
        for (const key in globalWeapons[currentTeam]) {
            SetPedDropsInventoryWeapon(PlayerPedId(), GetHashKey(globalWeapons[currentTeam][key]), 0.0, 0.0, 0.0, 500)
        }
    }
    await Wait(5000)

    let ped = PlayerPedId()
    let model = GetEntityModel(ped)
    
    teamdata = globalTeams[currentTeam]
    let spawnpoint = teamdata["spawnpoint"]
    
    exports.spawnmanager.spawnPlayer({
        x: spawnpoint[0],
        y: spawnpoint[1],
        z: spawnpoint[2],
        model: model
    });

    await Wait(2000)
    for (const key in globalWeapons[currentTeam]) {
        let playerId = GetPlayerFromServerId(source)
        GiveWeaponToPed(GetPlayerPed(playerId), globalWeapons[currentTeam][key], 500)
    }
    SetEntityMaxHealth(PlayerPedId(), globalSettings["teams"]["health"])
    SetPlayerHealthRechargeMultiplier(PlayerId(), 20.0)
    SetPlayerHealthRechargeLimit(PlayerId(), globalSettings["teams"]["healthLimit"])
    SetPedArmour(PlayerPedId(), globalSettings["teams"]["armor"])
})

onNet("onPlayerRevive", async () => {
    AnimpostfxStop('DeathFailOut')
})

onNet("SyncData", async (teams, players, settings, weapons, targets) => {
    globalTeams = teams
    globalPlayers = players
    globalSettings = settings
    globalWeapons = weapons
    globalTargets = targets
})
onNet("StartCountdown", async (sec, min) => {
    await Wait(1000)
    countdownActive = true

})

onNet("CountDownFinished", async () => {
    
    countdownActive = false
    activeNeutralArea = false
    activePrepareArea = true
    teamdata = globalTeams[currentTeam]
    let spawnpoint = teamdata["spawnpoint"]
    let pedmodel = teamdata["ped_model"]

    exports.spawnmanager.spawnPlayer({
        x: spawnpoint[0],
        y: spawnpoint[1],
        z: spawnpoint[2],
        model: pedmodel
    });

    exports.spawnmanager.setAutoSpawn(false)
    
    await Wait(3000)
    for (const key in globalWeapons[currentTeam]) {
        let playerId = GetPlayerFromServerId(source)
        GiveWeaponToPed(GetPlayerPed(playerId), globalWeapons[currentTeam][key], 500)
    }

    for (const key in globalPlayers) {
        if (globalPlayers[key]["team"] == currentTeam && globalPlayers[key]["id"] != source) {
            let ped = GetPlayerPed(globalPlayers[key]["id"])
            let blip = AddBlipForEntity(ped)

            SetBlipColour(blip, globalTeams[currentTeam]["blip"]["color"])
        }
    }
})


onNet("UpdateCountdown", async (min, sec) => {
    countMinute = min
    countSecond = sec
})

onNet('PreCountDownFinished', async () => {
    countdownActive = false
    activePrepareArea = false
    
   
    SetEntityMaxHealth(PlayerPedId(), globalSettings["teams"]["health"])
    SetPlayerHealthRechargeMultiplier(PlayerId(), 20.0)
    SetPlayerHealthRechargeLimit(PlayerId(), globalSettings["teams"]["healthLimit"])
    SetPedArmour(PlayerPedId(), globalSettings["teams"]["armor"])


    for (const key in globalTargets) {
        let vehicleTargetName = "Fahrzeugziel"
        let pedTargetName = "Personenziel"
        let objectTargetName = "Objektziel"


        if (globalTargets[key]["team"] == currentTeam) {
            vehicleTargetName += " (hasserfüllt)"
            pedTargetName += " (hasserfüllt)"
            objectTargetName += " (hasserfüllt)"
        } else {
            vehicleTargetName += " (freundlich)"
            pedTargetName += " (freundlich)"
            objectTargetName += " (freundlich)"
        }
        let target = globalTargets[key]
    
        let blip = AddBlipForCoord(target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2])
        
        if (target["type"] == "vehicle") {
            target["blip"] = {"sprite": 1, "color": 27, "scale": 1.0, "name": vehicleTargetName}
        } else if (target["type"] == "object") {
            target["blip"] = {"sprite": 478 , "color": 21, "scale": 1.0, "name": objectTargetName}
        } else if (target["type"] == "ped") {
            target["blip"] = {"sprite": 1, "color": 73, "scale": 1.0, "name": pedTargetName}
        } else {
            console.log(`TARGET: ${target["object_name"]} has no type`)
        }
        
        AllBlips.push(blip)
        SetBlipSprite(blip, target["blip"]["sprite"])
        SetBlipDisplay(blip, 4)
        SetBlipScale(blip, target["blip"]["scale"])
        SetBlipColour(blip, target["blip"]["color"])
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName(target["blip"]["name"])
        EndTextCommandSetBlipName(blip)
        
    } 
})

onNet("SetHudInfo", async (teamname) => {
    currentTeam = teamname
    let ped = PlayerPedId()
    let coords = GetEntityCoords(ped)

    exports.spawnmanager.spawnPlayer({
        x: coords[0],
        y: coords[1],
        z: coords[2],
        model: globalTeams[currentTeam]["ped_model"]
    });

    [teretval, tehash] = AddRelationshipGroup(teamname)
    setRelationshipToEveryone(1, tehash)
})

onNet("SpawnVehicle", async (target, key) => {
    if (!IsAnyVehicleNearPoint(target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2], 10) && target["spawned"] < target["limit"]) {
        let vehmodel = target["spawnname"]
        SpawnPlayerVehicle(vehmodel, target["spawnpoint"])
        emitNet("VehicleWasSpawned", currentTeam, target, key)
    }
})

onNet("SpawnVehicleTarget", async (target) =>{
        let vehmodel = target["object_name"]
        let targetVehicles = []
        if (target["vehicleamount"] <= 1) {
            target["vehicleamount"] = 1
        }
        for (let i = 0; i < target["vehicleamount"]; i++) {         
            SpawnPlayerVehicle(vehmodel, target["spawnpoint"], target, async function(vehicle, Nid, data) {
                let pedmodel = GetHashKey(data["driver"])
                
                RequestModel(pedmodel)
                while (!HasModelLoaded(pedmodel)) {
                    await Wait(1)
                }
        
                let ped = CreatePed(4, pedmodel, data["spawnpoint"][0], data["spawnpoint"][1], data["spawnpoint"][2] + 1, 0, true, true)
                SetPedRelationshipGroupHash(ped, tahash)
                setRelationshipToEveryone(1, tahash)
                TaskWarpPedIntoVehicle(ped, vehicle, -1)
        
                
                while (!IsPedInVehicle(ped, vehicle)) {
                    TaskWarpPedIntoVehicle(ped, vehicle, -1)
                    await Wait(1)
                }
                    
                TaskVehicleDriveWander(ped, vehicle,data["maxSpeed"], data["driveStyle"])
    
                targetVehicles.push({team: target["team"], Nid: Nid, group: tahash})
            }) 
            await Wait(3500)
        }
    emitNet("syncTargets", targetVehicles)
})


//Needs to be overthought
/* onNet("SpawnObjectTarget", async (target) =>{
    let object = CreateObject(GetHashKey(target["object_name"]),target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2],true, true, false)
}) */
onNet("SetTargetRelationships", async (target) => {
    if (target["team"] == currentTeam) {
        SetRelationshipBetweenGroups(5, tahash, tehash)
        SetRelationshipBetweenGroups(5, tehash, tahash)
    }
})
onNet("SpawnPedTarget", async (target) =>{
    let pedmodel = GetHashKey(target["object_name"])
    let targetPeds = []
    
    RequestModel(pedmodel)
    while (!HasModelLoaded(pedmodel)) {
        await Wait(1)
    }
    
    if (target["multipleAmount"] < 1) {
        target["multipleAmount"] = 1
    }
    
    for (let i = 0; i < target["multipleAmount"]; i++) {
        let ped = CreatePed(4, pedmodel, target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2] + 1, 0, true, true)
        

        SetPedRelationshipGroupHash(ped, tahash)
        setRelationshipToEveryone(1, tahash)
        
        if(target["MovesAround"]) {
            TaskWanderStandard(ped, target["WalkArea"], 10)
        }
        if(target["GiveWeapon"]) {
            GiveWeaponToPed(ped, GetHashKey(target["weapon"]), 500, true)
        }

        SetPedCombatAbility(ped, 2)
        SetPedCombatRange(ped, 2)
        SetPedCombatMovement(ped, 2)
        
        let Nid = NetworkGetNetworkIdFromEntity(ped)
        
        targetPeds.push({team: target["team"], Nid: Nid, group: tahash})
    }

    emitNet("syncTargets", targetPeds)
})

onNet("removeTarget", async (Nid) => {
    let entity = NetworkGetEntityFromNetworkId(Nid)
    let blip = GetBlipFromEntity(entity)
    RemoveBlip(blip)
})

onNet("setTargetBlips", async (Nid) => {
    let ped = NetworkGetEntityFromNetworkId(Nid)
    AddBlipForEntity(ped)
})

onNet("reloadAll", async () => {
    let source = GetPlayerServerId(GetPlayerIndex())
    exports.spawnmanager.spawnPlayer({
        x: globalSettings["NeutralZone"]["spawnpoint"][0],
        y: globalSettings["NeutralZone"]["spawnpoint"][1],
        z: globalSettings["NeutralZone"]["spawnpoint"][2],
        model: globalSettings["NeutralZone"]["ped_model"]
    });
    emitNet("PushPlayer", (source))
    await Wait(1000)
    activeNeutralArea = true
})

onNet("targetDestroyed", async () => {
    await Wait(500)
    ShowMPMessage("~g~EVENT ABGESCHLOSSEN", "Ziel wurde erfolgreich ausradiert", 250)
    AnimpostfxPlay("MP_Celeb_Win", 5000, false)
    SetTimeScale(0.4)
    PlaySoundFrontend(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", 0)
    vehiclespawned = false
    await Wait(5000)
    SetTimeScale(0.6)
    await Wait(500)
    SetTimeScale(0.8)
    await Wait(500)
    SetTimeScale(1.0)
})

