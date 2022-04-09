on("playerConnecting",async (name, setKickReason, deferrals) => {
    /* deferrals.defer()

    deferrals.update(`Willkommen ${name}.`)
    await Wait(5000)
    deferrals.done()
    CancelEvent() */
})

onNet("sb:create_player", (source) => {
    PushPlayer(source)
    const isadmin = Squad.isAdmin(source)
    emitNet("sb:isadmin", source, isadmin)
})

on("playerDropped", (reason) => {
    let source = global.source
    let players = GetPlayers()
    const pl = Squad.getPlayer(source)
    
    if (!pl) {return}
    Squad.removePlayer(source)
    players = GetPlayers()

    if (!teams[pl.team]) {return}
    teams[pl.team]["active"] -= 1
});

onNet("sb:sync_teamvehicles", async (currentTeam, target, key, Nid) => {
    vehicles[currentTeam][key]["spawned"] += 1
    vehicles[currentTeam][key]["Nid"] = Nid
})

onNet("syncTargets", async (globalTargets, team) => {

    TargetSessions.push(globalTargets)
    TeamTargets.push(team)
    
    let players = Squad.getAllPlayers()

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
    let player = Squad.getPlayer(source)
    if (player.active) {return}
    if (Squad.Session.Active) {return}

    player.setActive(true)

    for (const t in teams) {
        if (team == t && (teams[t]["active"] != settings["teams"]["slots"]) && teams[t]["used"]) {
            player.setTeam(t)
            emitNet("SetHudInfo", player.id, t)
            teams[t]["active"] = teams[t]["active"] + 1
        }
    }
    emitNet("SetMapBlips", player, teams)
    
    //emitNet("ShowMessage", source, "Game is currently active, you can't join a team")

})

onNet("sb:leaveteam", () => {
    let player = Squad.getPlayer(source)
    if (!player) {return}

    for (const t in teams) {
        if (player.team == t) {
            teams[t]["active"] = teams[t]["active"] - 1
        }
    }

    player.setActive(false)
    player.setTeam(undefined)
    emitNet("LeaveArea", player.id)
})

onNet("sb:endgame", (source) => {
    if (Squad.isAdmin(source)) {
        Squad.endGame()
    }
})

onNet("sb:reloadAll", (source) => {
    if (Squad.isAdmin(source)) {
        emitNet("reloadAll", -1)
    }
})

onNet("sb?triggerServerCallback", (name, requestId, ...args) => {
    let source = global.source

    Squad.RequestCallback(name, requestId, source,  function(...args) {
        emitNet("sb?serverCallback", source, requestId, ...args)
    }, ...args)
})