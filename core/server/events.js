on("playerConnecting",async (name, setKickReason, deferrals) => {
    /* deferrals.defer()

    deferrals.update(`Willkommen ${name}.`)
    await Wait(5000)
    deferrals.done()
    CancelEvent() */
})

onNet("PushPlayer", (source) => {
    PushPlayer(source)
    const isadmin = Squad.isAdmin(source)
    emitNet("sb:isadmin", source, isadmin)
})

on("playerDropped", (reason) => {
    for (const key in Squad.Players) {
        if (Squad.Players[key]["id"] == source) {
            let team = Squad.Players[key]["team"]
            teams[team]["active"] -= 1
            Squad.Players.splice(key, 1)
        }
    }
});

onNet("VehicleWasSpawned", async (currentTeam, target, key) => {
    vehicles[currentTeam][key]["spawned"] += 1
})

onNet("syncTargets", async (globalTargets, team) => {

    TargetSessions.push(globalTargets)
    TeamTargets.push(team)
    
    let players = GetPlayers()

    for (const key in players) {
        for (const key2 in globalTargets) {
            await Wait(500)
            if (players[key]["team"] == globalTargets[key2]["team"] || globalTargets[key2]["team"] == "global") {
                emitNet("setTargetBlips", players[key]["id"], globalTargets[key2])
            } else {
                emitNet("setTargetBlipsFriendly", players[key]["id"], globalTargets[key2])
            }
        }
    }
})

onNet("sb:jointeam", (team) => {
    let players = GetPlayers()
    if (!Squad.Session.Active) {
        for (const key in players) {
            if (players[key]["id"] == source && players[key]["active"] == false) {
                players[key]["active"] = true
                let player = source
    
    
                for (const key2 in teams) {
                    if (team == key2 && (teams[key2]["active"] != settings["teams"]["slots"]) && teams[key2]["used"]) {
                        players[key]["team"] = key2
                        emitNet("SetHudInfo", player, key2)
                        teams[key2]["active"] = teams[key2]["active"] + 1
                    }
                }
                emitNet("SetMapBlips", player, teams)
            }
        }
    } else {
        //emitNet("ShowMessage", source, "Game is currently active, you can't join a team")
    }
})

onNet("sb:leaveteam", () => {
    let player = source
    let players = GetPlayers()

    for (const key in players) {
        
        if (players[key]["id"] == player) {
            for (const key2 in teams) {
                if (players[key]["team"] == key2) {
                    teams[key2]["active"] = teams[key2]["active"] - 1
                }
            }
            players[key]["active"] = false
            players[key]["team"] = undefined
            emitNet("LeaveArea", player)
        }
    }
})

onNet("sb:endgame", (source) => {
    if (Squad.isAdmin(source)) {
        Squad.Session.Active = false
        emitNet("LeaveArea", -1)
        let players = GetPlayers()
        for (const key in players) {
            players[key]["active"] = false
            players[key]["team"] = undefined
        }
        for (const key2 in teams) {
            teams[key2]["active"] = 0
        }
    }
})

onNet("sb:reloadAll", (source) => {
    console.log(source)
    if (Squad.isAdmin(source)) {
        emitNet("reloadAll", -1)
    }
})