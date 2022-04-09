var vehicles = require('./config/vehicles.json')
var teams = require('./config/teams.json')
var weapons = require('./config/weapons.json')
var settings = require('./config/settings.json')

var targets = []
var pedtargets = require('./config/targets/pedtargets.json')
var vehtargets = require('./config/targets/vehicletargets.json')

var Squad = new Object()

Squad.Session = new Object()
Squad.Session.Active = false
Squad.Session.Preparing = false

Squad.Session.Targets = new Object()
Squad.Session.Targets.Ped = []
Squad.Session.Targets.Vehicle = []
Squad.Session.Targets.Object = []

Squad.Players = []

var TargetSessions = []
var TeamTargets = []

for (const key in pedtargets) {
    targets.push(pedtargets[key])
}
for (const key in vehtargets) {
    targets.push(vehtargets[key])
}

Squad.isAdmin = function(plsource) {
    for (const key in settings["admins"]) {
        if (GetPlayersIdentifier(plsource, "fivem:") == settings["admins"][key]["identifier"] || GetPlayersIdentifier(plsource, "steam:") == settings["admins"][key]["identifier"]) {
            return true
        }
   }
   return false
}

Squad.getPlayer = function(plsource) {
    for (const i in Squad.Players) {
        if (Squad.Players[i].id == plsource) {
            return Squad.Players[i]
        }
    }
    return
}

Squad.getAllPlayers = function() {
    return Squad.Players
}


Squad.removePlayer = function(plsource) {
    for (const key in Squad.Players) {
        if (Squad.Players[key].id == plsource) {
            Squad.Players.splice(key, 1)
        }
    }
}

Squad.removeEntity = async function(netid) {
    const entity = NetworkGetEntityFromNetworkId(netid)
    while (DoesEntityExist(entity)) {
        await Wait(100)
        if (DoesEntityExist(entity)) {DeleteEntity(entity)}
    }
}

Squad.endGame = async function() {
    Squad.Session.Active = false
    Squad.Session.Preparing = false
    emitNet("LeaveArea", -1)
    for (const key in Squad.Players) {
        Squad.Players[key].setActive(false)
        Squad.Players[key].setTeam(undefined)
    }
    for (const key2 in teams) {
        teams[key2]["active"] = 0
    }
    emitNet("reloadAll", -1)

    for (const k in TargetSessions) {
        const val = TargetSessions[k]
        for (const t in val) {
            const obj = val[t]

            if (obj["Nid"]) {
                Squad.removeEntity(obj["Nid"])
            }
        }
    }

    for (const team in vehicles) {
        for (const veh in vehicles[team]) {
            if (vehicles[team][veh]["Nid"]) {
                const obj = vehicles[team][veh]["Nid"]
                Squad.removeEntity(obj)
            }
        }
    }
}



function PushPlayer(source) {
    const pl = new xPlayer(source, GetPlayerName(source))
    Squad.Players.push(pl)
}

function GetPlayers() {
    return Squad.Players
}

async function SpawnTargets(target, player, targetId) {
    if (target["type"] == "vehicle") {
        emitNet('SpawnVehicleTarget',player["id"], target, targetId)
        target["spawned"] = true
    
    } else if (target["type"] == "ped") {
        emitNet('SpawnPedTarget',player["id"], target, targetId)
        target["spawned"] = true
    
    } else if (target["type"] == "object") {
        emitNet('SpawnObjectTarget',player["id"], target, targetId)
        target["spawned"] = true
    
    } else {
        console.log(`TARGET: ${target["object_name"]} has no or unknown team`)
        target["spawned"] = true
    }
}

function GetDistanceBetweenCoords(x1,y1,z1,x2,y2,z2) {
    const dx = x1 - x2
    const dy = y1 - y2
    const dz = z1 - z2
    return Math.sqrt( dx * dx + dy * dy + dz * dz)
}

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

