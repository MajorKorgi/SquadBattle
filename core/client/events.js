onNet("SetMapBlips",  async (teams) => {
    for (const key in teams) {
        if(teams[key]["used"]) {
            let team = teams[key]
        
            let blip = AddBlipForCoord(team["spawnpoint"][0], team["spawnpoint"][1], team["spawnpoint"][2])
            AllBlips.push({"id": blip, "key": key})
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
    AllBlips.push({"id": blip})
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
        const val = AllBlips[key]
        if (val["id"]) {
            RemoveBlip(val["id"])
        }
    }
})

onNet("onPlayerDeath", async () => {
    AnimpostfxPlay('DeathFailOut', 0, true)
    if (currentTeam != undefined && globalSettings["teams"]["dropWeapons"] && !Squad.Session.countDown) {
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
    SetPedRelationshipGroupHash(ped, plhash)
    setRelationshipToEveryone(1, plhash)
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

onNet("SyncMarkerData", async (markers) => {
    globalMarkers = markers
})

onNet("StartCountdown", async (sec, min) => {
    await Wait(1000)
    Squad.Session.countDown = true

})

onNet("CountDownFinished", async () => {
    
    Squad.Session.countDown = false
    Squad.Session.neutralArea = false
    Squad.Session.prepareArea = true
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
    Squad.Session.countDown = false
    Squad.Session.prepareArea = false
    Squad.Session.gameActive = true
    
   
    SetEntityMaxHealth(PlayerPedId(), globalSettings["teams"]["health"])
    SetPlayerHealthRechargeMultiplier(PlayerId(), 20.0)
    SetPlayerHealthRechargeLimit(PlayerId(), globalSettings["teams"]["healthLimit"])
    SetPedArmour(PlayerPedId(), globalSettings["teams"]["armor"])


    for (const key in globalTargets) {
        let vehicleTargetName = "Vehicle target"
        let pedTargetName = "Person target"
        let objectTargetName = "Object target"

        let color = 0
        if (globalTargets[key]["team"] == currentTeam) {
            vehicleTargetName += " (hateful)"
            pedTargetName += " (hateful)"
            objectTargetName += " (hateful)"
            color = 1
        
        } else {
            vehicleTargetName += " (friendly)"
            pedTargetName += " (friendly)"
            objectTargetName += " (friendly)"

            color = 3
        }
        let target = globalTargets[key]
        let blip = AddBlipForCoord(target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2])
        
        switch (target["type"]) {
            case "vehicle":target["blip"] = {"sprite": 1, "color": color, "scale": 1.0, "name": vehicleTargetName};break;
            case "object":target["blip"] = {"sprite": 478 , "color": color, "scale": 1.0, "name": objectTargetName};break;
            case "ped":target["blip"] = {"sprite": 1, "color": color, "scale": 1.0, "name": pedTargetName};break;
        
            default: console.log(`TARGET: ${target["object_name"]} has no type`);break;
        }
        
    
        
        
        SetBlipSprite(blip, target["blip"]["sprite"])
        AllBlips.push({"id": blip, "key": key})
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

    await Wait(2000)
    SetPedRelationshipGroupHash(ped, plhash)
    setRelationshipToEveryone(1, plhash)
})

onNet("SpawnVehicle", async (target, key) => {
    if (!IsAnyVehicleNearPoint(target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2], 10) && target["spawned"] < target["limit"]) {
        let vehmodel = target["spawnname"]
        SpawnPlayerVehicle(vehmodel, target["spawnpoint"], [], async function(vehicle, Nid, data) {
            emitNet("sb:sync_teamvehicles", currentTeam, target, key, Nid)
        })
    }
})

onNet("SpawnVehicleTarget", async (target, id) =>{
        let vehmodel = target["object_name"]
        
        let [retval ,grouphash] = AddRelationshipGroup(id)
        
        if (target["vehicleamount"] <= 1) {
            target["vehicleamount"] = 1
        }
        let time = 500
        for (let i = 0; i < target["vehicleamount"]; i++) {         
            SpawnPlayerVehicle(vehmodel, target["spawnpoint"], target, async function(vehicle, Nid, data) {
                let targetVehicles = []
                let Nid2 = undefined
                SetVehicleDoorsLockedForAllPlayers(vehicle, true)
                if (data["hasDriver"]) {
                    let pedmodel = GetHashKey(data["driver"])

                    RequestModel(pedmodel)
                    while (!HasModelLoaded(pedmodel)) {
                        await Wait(1)
                    }
            
                    let ped = CreatePed(4, pedmodel, data["spawnpoint"][0], data["spawnpoint"][1], data["spawnpoint"][2] + 1, 0, true, true)
                    Nid2 = NetworkGetNetworkIdFromEntity(ped)
                    
                    TaskWarpPedIntoVehicle(ped, vehicle, -1)
                    SetPedRelationshipGroupHash(ped, grouphash)
                    setRelationshipToEveryone(1, grouphash)
                    
                    while (!IsPedInVehicle(ped, vehicle)) {
                        TaskWarpPedIntoVehicle(ped, vehicle, -1)
                        await Wait(1)
                    }
                }
                
                if (target["vehicleamount"] > 1 || target["MovesAround"]) {
                    TaskVehicleDriveWander(ped, vehicle,data["maxSpeed"], data["driveStyle"])
                    time = 3500
                }  
                
                targetVehicles.push({team: target["team"], Nid: Nid, Nid2: Nid2, attack: target["attackTeam"]})
                emitNet("syncTargets", targetVehicles, target["team"])
            })
            for (const key in AllBlips) {
                if (AllBlips[key]["key"] == id) {
                    RemoveBlip(AllBlips[key]["id"])
                }   
            }
            await Wait(time)
        }
})


//Needs to be overthought
/* onNet("SpawnObjectTarget", async (target) =>{
    let object = CreateObject(GetHashKey(target["object_name"]),target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2],true, true, false)
}) */
onNet("SpawnPedTarget", async (target, id) =>{
    let pedmodel = GetHashKey(target["object_name"])
    let targetPeds = []
    let [retval ,grouphash] = AddRelationshipGroup(id)
    
    RequestModel(pedmodel)
    while (!HasModelLoaded(pedmodel)) {
        await Wait(1)
    }
    
    if (target["multipleAmount"] < 1) {
        target["multipleAmount"] = 1
    }
    
    for (let i = 0; i < target["multipleAmount"]; i++) {
        let ped = CreatePed(4, pedmodel, target["spawnpoint"][0], target["spawnpoint"][1], target["spawnpoint"][2] + 1, 0, true, true)
    
        
        if(target["MovesAround"]) {
            TaskWanderStandard(ped, target["WalkArea"], 10)
        }
        if(target["GiveWeapon"]) {
            GiveWeaponToPed(ped, GetHashKey(target["weapon"]), 500, true)
        }

        SetPedRelationshipGroupHash(ped, grouphash)
        setRelationshipToEveryone(1, grouphash)

        

        SetPedCombatAbility(ped, 2)
        SetPedCombatRange(ped, 2)
        SetPedCombatMovement(ped, 2)
        
        let Nid = NetworkGetNetworkIdFromEntity(ped)
        
        targetPeds.push({team: target["team"], Nid: Nid, attack: target["attackTeam"]})
    }
    for (const key in AllBlips) {
        if (AllBlips[key]["key"] == id) {
            RemoveBlip(AllBlips[key]["id"])
        }   
    }

    emitNet("syncTargets", targetPeds, target["team"])
})

onNet("removeTarget", async (Nid) => {
    let entity = NetworkGetEntityFromNetworkId(Nid)
    let blip = GetBlipFromEntity(entity)
    RemoveBlip(blip)
})

onNet("setTargetBlips", async (target) => {
    let ped = NetworkGetEntityFromNetworkId(target["Nid"])
    let blip = AddBlipForEntity(ped)

    let group = GetPedRelationshipGroupHash(ped)
    let type = GetEntityType(ped)
    
    if (type == 2 && target["Nid2"] != undefined) {
        let ped2 = NetworkGetEntityFromNetworkId(target["Nid2"])
        group = GetPedRelationshipGroupHash(ped2)
    }
    if (target["attack"]) {
        SetRelationshipBetweenGroups(5, group, plhash)
        SetRelationshipBetweenGroups(5, plhash, group)
    } else {
        SetRelationshipBetweenGroups(4, group, plhash)
        SetRelationshipBetweenGroups(4, plhash, group)
    }
    
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName("Enemy")
    EndTextCommandSetBlipName(blip)
})

onNet("setTargetBlipsFriendly", async (target) => {
    let ped = NetworkGetEntityFromNetworkId(target["Nid"])
    let blip = AddBlipForEntity(ped)

    let group = GetPedRelationshipGroupHash(ped)
    let type = GetEntityType(ped)
    
    if (type == 2 && target["Nid2"] != undefined) {
        let ped2 = NetworkGetEntityFromNetworkId(target["Nid2"])
        group = GetPedRelationshipGroupHash(ped2)
    }

    SetRelationshipBetweenGroups(1, group, plhash)
    SetRelationshipBetweenGroups(1, plhash, group)

    SetBlipColour(blip, 2)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentSubstringPlayerName("Companion")
    EndTextCommandSetBlipName(blip)
})


onNet("reloadAll", async () => {
    let source = GetPlayerServerId(GetPlayerIndex())
    exports.spawnmanager.spawnPlayer({
        x: globalSettings["NeutralZone"]["spawnpoint"][0],
        y: globalSettings["NeutralZone"]["spawnpoint"][1],
        z: globalSettings["NeutralZone"]["spawnpoint"][2],
        model: globalSettings["NeutralZone"]["ped_model"]
    });
    emitNet("sb:create_player", source)
    await Wait(1000)
    Squad.Session.neutralArea = true
    Squad.Session.gameActive = false
})

onNet("targetDestroyed", async () => {
    await Wait(500)
    ShowMPMessage("~g~EVENT COMPLETED", "Target successfully destroyed", 250)
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

