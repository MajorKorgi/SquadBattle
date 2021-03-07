RegisterCommand("getAllPlayers", function(source, args, rawcommand) {
    let players = GetPlayers()
    console.log(players)
})

RegisterCommand("join", function(source, args, rawcommand) {
    let players = GetPlayers()
    for (const key in players) {
        if (players[key]["id"] == source && players[key]["active"] == false) {
            players[key]["active"] = true
            let player = source
            let team = args[0]


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
})

RegisterCommand("leave", function(source, args, rawcommand) {
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

function GetPlayersIdentifier(source, identifier) {
    let numIdentifers = GetNumPlayerIdentifiers(source)
    let plid = undefined
    for (let i=0;i<numIdentifers;i++) {
        let playerIdentifier = GetPlayerIdentifier(source, i)
        if (playerIdentifier.substr(0, identifier.length) == identifier) {
            plid = playerIdentifier
        }
    }
    return plid
}

RegisterCommand("EndGame", function(source){
   for (const key in settings["admins"]) {
        if (GetPlayersIdentifier(source, "fivem:") == settings["admins"][key]["identifier"] || GetPlayersIdentifier(source, "steam:") == settings[key]["admins"][key]["identifier"]) {
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
        if (GetPlayersIdentifier(source, "fivem:") == settings["admins"][key]["identifier"] || GetPlayersIdentifier(source, "steam:") == settings[key]["admins"][key]["identifier"]) {
            emitNet("reloadAll", -1)
        } else {
            console.log("You are not an Admin!")
        }
   }
})