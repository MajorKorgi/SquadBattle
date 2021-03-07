on("playerConnecting",async (name, setKickReason, deferrals) => {
    /* deferrals.defer()

    deferrals.update(`Willkommen ${name}.`)
    await Wait(5000)
    deferrals.done()
    CancelEvent() */
})

onNet("PushPlayer", async (source) => {
    PushPlayer(source)
})

on("playerDropped", (reason) => {
    for (const key in currActivePlayers) {
        if (currActivePlayers[key]["id"] == source) {
            let team = currActivePlayers[key]["team"]
            teams[team]["active"] -= 1
            currActivePlayers.splice(key, 1)
        }
    }
});

onNet("VehicleWasSpawned", async (currentTeam, target, key) => {
    vehicles[currentTeam][key]["spawned"] += 1
})

onNet("syncTargets", async (globalTargets) => {

    TargetSessions.push(globalTargets)
    
    let players = GetPlayers()

    for (const key in players) {
        for (const key2 in globalTargets) {
            if (players[key]["team"] == globalTargets[key2]["team"] || globalTargets[key2]["team"] == "global") {
                emitNet("setTargetBlips", players[key]["id"], globalTargets[key2]["Nid"])
            }
        }
    }
})