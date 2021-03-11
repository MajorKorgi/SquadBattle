var vehicles = require('./config/vehicles.json')
var teams = require('./config/teams.json')
var weapons = require('./config/weapons.json')
var settings = require('./config/settings.json')
var targets = require('./config/targets.json')

var currActivePlayers = []

var TargetSessions = []

var GameIsActive = false
var PrepareTeams = false

function PushPlayer(source) {
    currActivePlayers.push({id: source, name: GetPlayerName(source), active: false, dead: false, team: undefined})
}

function GetPlayers() {
    return currActivePlayers
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

