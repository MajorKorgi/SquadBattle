setTick(async () => {
    await Wait(500)

    const players = GetPlayers()

    if (players.length != 0) {
        for (const key in players) {
         if (players[key]["active"]) {
             let source = players[key]["id"]
             let ped = GetPlayerPed(source)
             let health = GetEntityHealth(ped)

             if (health == 0 && players[key]["dead"] == false && DoesEntityExist(ped)) {
                players[key]["dead"] = true
                emitNet("onPlayerDeath", source)
             }

             if (health > 0 && players[key]["dead"] == true && DoesEntityExist(ped)) {
                players[key]["dead"] = false
                emitNet("onPlayerRevive", source)
            }
         }
        }
    }
    
})

setTick(async () => {
    await Wait(1000)
    emitNet("SyncData", -1, teams, currActivePlayers, settings, weapons, targets)
})

setTick(async () => {
    let playersInTeam = false
    let amountofteamsplayers = 0
    let amountofteams = 0
    for (const key in teams) {
        if (teams[key]["used"]) {
            amountofteams = amountofteams + 1
            amountofteamsplayers = amountofteamsplayers + teams[key]["active"]
        }
        
        if (teams[key]["active"] >= settings["countdown"]["MinPlayersToStart"] && teams[key]["used"]) {
            playersInTeam = true
        } else if (teams[key]["used"]) {
            playersInTeam = false
            break
        }
        

        
    }
    amountofteamsplayers = amountofteamsplayers / amountofteams

    
    if (playersInTeam && !GameIsActive) {
        let tempMinute = settings["countdown"]["Minutes"]
        let tempSecond = settings["countdown"]["Seconds"]

        emitNet("StartCountdown", -1, tempMinute, tempSecond)
        let fulltime = tempMinute*60+tempSecond
        for (let i=0; i<fulltime; i++) {
            if (!GameIsActive && playersInTeam && amountofteamsplayers<settings["teams"]["slots"]) {
                if (tempSecond <= 0 && tempMinute != 0) {
                    tempSecond = 59;
                    tempMinute = tempMinute - 1
                    await Wait(1000)
                } else if (tempSecond != 0){
                    tempSecond--;
                    await Wait(1000)
                }

                emitNet("UpdateCountdown", -1, tempMinute, tempSecond)
            }
            amountofteams = 0
            amountofteamsplayers = 0
            for (const key in teams) {
                if (teams[key]["used"]) {
                    amountofteams = amountofteams + 1
                    amountofteamsplayers = amountofteamsplayers + teams[key]["active"]
                }
                
                if (teams[key]["active"] >= settings["countdown"]["MinPlayersToStart"] && teams[key]["used"]) {
                    playersInTeam = true
                } else if (teams[key]["used"]) {
                    playersInTeam = false
                    break
                }
            }
            amountofteamsplayers = amountofteamsplayers / amountofteams
        }

        await Wait(1000)
        emitNet("CountDownFinished", -1)
        GameIsActive = true
        PrepareTeams = true
    }
})

setTick(async () => {
    if (GameIsActive && PrepareTeams) {
        let tempMinute = settings["countdown"]["PreMinutes"]
        let tempSecond = settings["countdown"]["PreSeconds"]

        emitNet("StartCountdown", -1, tempMinute, tempSecond)
        let fulltime = tempMinute*60+tempSecond
        for (let i=0; i<fulltime; i++) {
            if (GameIsActive && PrepareTeams) {
                if (tempSecond <= 0 && tempMinute != 0) {
                    tempSecond = 59;
                    tempMinute = tempMinute - 1
                    await Wait(1000)
                } else if (tempSecond != 0){
                    tempSecond--;
                    await Wait(1000)
                }
                emitNet("UpdateCountdown", -1, tempMinute, tempSecond)
            }
        }

        await Wait(1000)
        emitNet("PreCountDownFinished", -1)
        GameIsActive = true
        PrepareTeams = false
    }
})

setTick(async () => {
    const players = GetPlayers()
    for(const key in players) {
        for (const key2 in teams) {
            for (const key3 in vehicles[key2]) {
                try {if ((typeof players[key]["id"]) == 'number') {
                    const ped = GetPlayerPed(players[key]["id"])
                    let Distance = 9999
                    if (ped != 0 && players[key]["active"] == true && teams[key2]["used"]) {
                        const pedCoords = GetEntityCoords(ped)
                        const vehCoords = vehicles[key2][key3]["spawnpoint"]
                        if (pedCoords != undefined && vehCoords != undefined) {
                            Distance = GetDistanceBetweenCoords(pedCoords[0], pedCoords[1], pedCoords[2], vehCoords[0], vehCoords[1], vehCoords[2])
                        }
                        
                        if (Distance <= 200) {
                            emitNet('SpawnVehicle', players[key]["id"], vehicles[key2][key3], key3)
                            await Wait(1000)
                        }
                    } 
                    
                }}
                catch(err) {
                }
            }
        }

    }
})
setTick(async () => {
    let players = GetPlayers()
    for (const key in targets) {
        if (targets[key]["spawned"] == false) {
            for (const key2 in players) {
                const ped = GetPlayerPed(players[key2]["id"])
                const pedCoords = GetEntityCoords(ped)
                const tarCoords = targets[key]["spawnpoint"]
    
                let Distance = 9999
                if (pedCoords != undefined && tarCoords != undefined) {
                    Distance = GetDistanceBetweenCoords(pedCoords[0], pedCoords[1], pedCoords[2], tarCoords[0], tarCoords[1], tarCoords[2])
                }
    
                if (Distance <= 50 && targets[key]["spawned"] == false) {
                    SpawnTargets(targets[key], players[key2], key)
                    
                }
                await Wait(500)
            }
            
        }
    }
})

setTick(async () => {
    for (const key in TargetSessions) {
        for (const key2 in TargetSessions[key]) {
            let Nid = TargetSessions[key][key2]["Nid"]
            let team = TargetSessions[key][key2]["team"]

            let entity = NetworkGetEntityFromNetworkId(Nid)
    
            let entityType = GetEntityType(entity)
            let entityHealth = undefined
            if (entityType == 1) {
                entityHealth = GetEntityHealth(entity)
                if (entityHealth <= 0) {
                    emitNet("removeTarget",-1, Nid)
                    TargetSessions[key].splice(key2, 1)
                }
            } else if (entityType == 2) {
                entityHealth = GetVehicleEngineHealth(entity)
                if (entityHealth <= 0) {
                    emitNet("removeTarget",-1, Nid)
                    TargetSessions[key].splice(key2, 1)
                }
            }
            if (TargetSessions[key].length == 0 && team != "global") {
                const players = GetPlayers()
                for (const key3 in players) {

                    if (players[key3]["team"] == team) {
                        emitNet("targetDestroyed", players[key3]["id"])
                        TargetSessions.splice(key, 1)
                        for (const key in TeamTargets) {
                            if (TeamTargets[key] == team) {
                                TeamTargets.splice(key, 1)
                                break
                            }
                        }
                    }
                }
            } else if (TargetSessions[key].length == 0) {
                emitNet("targetDestroyed", -1)
                TargetSessions.splice(key, 1)
                for (const key in TeamTargets) {
                    if (TeamTargets[key] == team) {
                        TeamTargets.splice(key, 1)
                        break
                    }
                }
            }
        }
        
        
    }
})

setTick(async () => {
    for (const key in TeamTargets) {
        if (TeamTargets[key])  {
            
        }
    }
})

setTick(async () => {
    let players = GetPlayers()
    for (const key in players) {
        let markers = []
        for (const key2 in vehicles) {
            for (const key3 in vehicles[key2]) {
                const ped = GetPlayerPed(players[key]["id"])
                const coords = GetEntityCoords(ped)
                const Distance = GetDistanceBetweenCoords(coords[0], coords[1], coords[2], vehicles[key2][key3]["spawnpoint"][0], vehicles[key2][key3]["spawnpoint"][1], vehicles[key2][key3]["spawnpoint"][2])

                if (Distance <= 200) {
                    markers.push(vehicles[key2][key3]["spawnpoint"])
                }
            }
        }
        emitNet("SyncMarkerData", players[key]["id"], markers)
    }
})