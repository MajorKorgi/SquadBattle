RegisterCommand("getAllPlayers", function(source, args, rawcommand) {
    let players = GetPlayers()
    console.log(players)
})

RegisterCommand("EndGame", function(source){
   for (const key in settings["admins"]) {
        if (GetPlayersIdentifier(source, "fivem:") == settings["admins"][key]["identifier"] || GetPlayersIdentifier(source, "steam:") == settings["admins"][key]["identifier"]) {
            GameIsActive = false
            emitNet("LeaveArea", -1)
            let players = GetPlayers()
            for (const key in players) {
                players[key]["active"] = false
                players[key]["team"] = undefined
            }
            for (const key2 in teams) {
                teams[key2]["active"] = 0
            }
        } else {
            console.log("You are not an Admin!")
        }
   }
})

RegisterCommand("reloadAll", function(source) {
    for (const key in settings["admins"]) {
        if (GetPlayersIdentifier(source, "fivem:") == settings["admins"][key]["identifier"] || GetPlayersIdentifier(source, "steam:") == settings["admins"][key]["identifier"]) {
            emitNet("reloadAll", -1)
        } else {
            console.log("You are not an Admin!")
        }
   }
})