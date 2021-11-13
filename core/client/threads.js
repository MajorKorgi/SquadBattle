//STATS
setTick(async () => {
    if (Squad.Settings.showStats) {
        let textTeams = "TEAMS"
        let ped = PlayerPedId()
        let health = GetEntityHealth(ped)
        let textPlayers = `YOUR HEALTH:${health} \nPLAYERS IN YOUR TEAM`
        
        SetTextFont(0)
        SetTextProportional(1)
        SetTextScale(0.0, 0.4)
        SetTextColour(200, 200, 200, 255)
        SetTextDropshadow(0, 0, 0, 0, 255)
        SetTextEdge(1, 0, 0, 0, 255)
        SetTextDropShadow()
        SetTextOutline()
        SetTextEntry("STRING")
        
        if (currentTeam == undefined) {
            for (const key in globalTeams) {
                if (globalTeams[key]["used"]) {
                    textTeams = textTeams + `\n - [${key}] ${globalTeams[key]["blip"]["name"]} Slots: ${globalTeams[key]["active"]}/${globalSettings["teams"]["slots"] }`
                }
            }
            AddTextComponentString(textTeams)
        } else {
            for (const key in globalPlayers) {
                if (globalPlayers[key]["team"] == currentTeam) {
                    textPlayers = textPlayers + `\n - [${globalPlayers[key]["id"]}] ${globalPlayers[key]["name"]}`
                }
            }
            AddTextComponentString(textPlayers)
        }
        EndTextCommandDisplayText(0.8, 0.005)
    }
}) 

//COUNTDOWN
setTick(async () => {
    if (Squad.Session.countDown) {
        SetTextFont(0)
        SetTextProportional(1)
        SetTextScale(0.0, 1.0)
        SetTextColour(200, 200, 200, 255)
        SetTextDropshadow(0, 0, 0, 0, 255)
        SetTextEdge(1, 0, 0, 0, 255)
        SetTextDropShadow()
        SetTextOutline()
        SetTextCentre(true)
        SetTextEntry("STRING")
        countMinute = countMinute.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

        countSecond = countSecond.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        if (Squad.Session.neutralArea) {
            AddTextComponentString(`Countdown\n${countMinute}:${countSecond}`)
        } else if (Squad.Session.prepareArea) {
            AddTextComponentString(`Prepare for Battle\n${countMinute}:${countSecond}`)
        } else {
            AddTextComponentString(`${countMinute}:${countSecond}`)
        }
    
        EndTextCommandDisplayText(0.5, 0.1)
    }
})

setTick(async () => {
    //const source = GetPlayerServerId(GetPlayerIndex())
    
    let ped = PlayerPedId()
    let coords = GetEntityCoords(ped)
    let model = GetEntityModel(ped)
    let pedVehicle = undefined
    /* if (Squad.Session.neutralArea) {
        ClearArea(coords[0], coords[1], coords[2], 50, false, false, false, false)
        
        if (!IsEntityInArea(ped, globalSettings["NeutralZone"]["spawnpoint"][0] -130, globalSettings["NeutralZone"]["spawnpoint"][1] -130, globalSettings["NeutralZone"]["spawnpoint"][2] - 10, globalSettings["NeutralZone"]["spawnpoint"][0] + 130, globalSettings["NeutralZone"]["spawnpoint"][1] + 130, globalSettings["NeutralZone"]["spawnpoint"][2] + 50)) {
            exports.spawnmanager.spawnPlayer({
                x: globalSettings["NeutralZone"]["spawnpoint"][0],
                y: globalSettings["NeutralZone"]["spawnpoint"][1],
                z: globalSettings["NeutralZone"]["spawnpoint"][2],
                model: model
            });
            await Wait(2000)
        }
    } else if (Squad.Session.prepareArea) {
        if (!IsEntityInArea(ped, globalTeams[currentTeam]["spawnpoint"][0] -130, globalTeams[currentTeam]["spawnpoint"][1] -130, globalTeams[currentTeam]["spawnpoint"][2] - 10,  globalTeams[currentTeam]["spawnpoint"][0] + 130,  globalTeams[currentTeam]["spawnpoint"][1] + 130,  globalTeams[currentTeam]["spawnpoint"][2] + 50)) {
            if (IsPedInAnyVehicle(ped)){
                pedVehicle = GetVehiclePedIsIn(ped)
                SetEntityAsMissionEntity(pedVehicle, false, true)
                DeleteVehicle(pedVehicle)
            }
            exports.spawnmanager.spawnPlayer({
                x: globalTeams[currentTeam]["spawnpoint"][0],
                y: globalTeams[currentTeam]["spawnpoint"][1],
                z: globalTeams[currentTeam]["spawnpoint"][2],
                model: globalTeams[currentTeam]["ped_model"]
            });
            await Wait(2000)
        }
    } */
})

setTick(async () => {
    if (Squad.Session.neutralArea) {
        DrawMarker(1, globalSettings["NeutralZone"]["spawnpoint"][0], globalSettings["NeutralZone"]["spawnpoint"][1], globalSettings["NeutralZone"]["spawnpoint"][2] - 10, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 270, 270, 150, 255, 255, 255, 180, false, false, 2, false, undefined, undefined, false)
        SetEntityInvincible(PlayerPedId(), true)
    } else if (Squad.Session.prepareArea) {
        for (const key in globalTeams) {
            if (globalTeams[key]["used"]) {
                DrawMarker(1, globalTeams[key]["spawnpoint"][0], globalTeams[key]["spawnpoint"][1], globalTeams[key]["spawnpoint"][2] - 10, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 270, 270, 50, 255, 255, 255, 100, false, false, 2, false, undefined, undefined, false)
            }
       }
        SetEntityInvincible(PlayerPedId(), true)
    }
})

setTick(async () => {
    if (!Squad.Session.gameActive && !Squad.Session.prepareArea) {return}
    for (const key in globalMarkers) {
        const coord = globalMarkers[key]
        DrawMarker(2,coord[0],coord[1],coord[2] + 4, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 2.0, 2.0, 2.0, 50, 50, 204, 255, true, false, 2, true, undefined, undefined, false)
        DrawMarker(1,coord[0],coord[1],coord[2] - 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 6.0, 3.0, 50, 50, 204, 100, false, false, 2, true, undefined, undefined, false)
    }
})