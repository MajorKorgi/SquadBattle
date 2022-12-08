var globalTeams2 = []
var globalPlayers2 = []
var globalSettings2 = []
var globalWeapons2 = []
var globalTargets2 = []
var globalMarkers = []


Squad = {}
Squad.Player =  {}

Squad.Settings = {}
Squad.Settings.showStats = true


Squad.Session = {}
Squad.Session.countDown = false
Squad.Session.gameActive = false
Squad.Session.TeamData = []

Squad.Callbacks = []
Squad.CallbackRequestId = []

Squad.initialized = false

Squad.Runtime = {}
Squad.Runtime.Attack = false
Squad.Runtime.Stats = false
Squad.Runtime.neutralArea = false
Squad.Runtime.prepareArea = false

var currentTeam = undefined

let countMinute = 0
let countSecond = 0


let showStats = true
let init = false
let AllBlips =  []

const [plretval, plhash] = AddRelationshipGroup("PLAYER")

Squad.Init = async function() {
    const globalSettings = await Squad.RequestSettings()
    const globalTeams = await Squad.RequestTeams()

    for (const key in globalTeams) {
        console.log(key)
        if (globalTeams[key]["used"])
        Squad.Session.TeamData[key] = {
            players: 0,
            name: globalTeams[key]["blip"]["name"],
            slots: globalSettings["teams"]["slots"]
        }
        console.log(Squad.Session.TeamData[key])
    }
    
    if (Squad.Runtime.Attack) {
        clearInterval(Squad.Runtime.Attack)
        Squad.Runtime.Attack = undefined
    }
    Squad.Runtime.Attack = setInterval(() => {
        let playerPed = GetPlayerPed(-1)
        
        NetworkSetFriendlyFireOption(true)
        SetCanAttackFriendly(playerPed, true, true)
    })

    let source = GetPlayerServerId(GetPlayerIndex())
    exports.spawnmanager.spawnPlayer({
        x: globalSettings["NeutralZone"]["spawnpoint"][0],
        y: globalSettings["NeutralZone"]["spawnpoint"][1],
        z: globalSettings["NeutralZone"]["spawnpoint"][2],
        model: globalSettings["NeutralZone"]["ped_model"]
    });
    emitNet("sb:create_player", (source))
    await Wait(1000)
    StartNeutralAreaRuntime()
}

Squad.RequestCallback = function(name, cb, ...args) {
    Squad.Callbacks[Squad.CallbackRequestId] = cb
    emitNet("sb?triggerServerCallback", name, Squad.CallbackRequestId, ...args)

    Squad.CallbackRequestId = (Squad.CallbackRequestId < 65535) ? Squad.CallbackRequestId + 1 : 0
}

on('playerSpawned', async () => {
    if (Squad.initialized) {return}
    Squad.initialized = true
    Squad.Init()
})

async function SpawnPlayerVehicle(modelName, coords, data, cb) {
    RequestModel(modelName)
    let vehicleName = GetDisplayNameFromVehicleModel(modelName)
    BeginTextCommandBusyspinnerOn('STRING')
    AddTextComponentSubstringPlayerName(`Vehicle: ${vehicleName} is loading, please wait`)
    EndTextCommandBusyspinnerOn(4)
    
    while (HasModelLoaded(modelName) == false) {
        await Wait(1)
    }
    BusyspinnerOff()
    let vehicle = CreateVehicle(modelName, coords[0],coords[1],coords[2], coords[3], true, false)
    let id = NetworkGetNetworkIdFromEntity(vehicle)
    SetNetworkIdCanMigrate(id, true)
    SetEntityAsMissionEntity(vehicle, true, false)
    SetVehicleHasBeenOwnedByPlayer(vehicle, true)
    SetVehicleNeedsToBeHotwired(vehicle, false)
    SetModelAsNoLongerNeeded(modelName)
    SetVehRadioStation(vehicle, 'OFF')
    
    if (cb != undefined) {
        cb(vehicle, id, data)
    }
}

async function ShowMPMessage(message, subtitle, ms) {
    let scaleform = RequestScaleformMovie("mp_big_message_freemode")
    while (!HasScaleformMovieLoaded(scaleform)) {
        await Wait(1)
    }

    BeginScaleformMovieMethod(scaleform, "SHOW_SHARD_WASTED_MP_MESSAGE")
    PushScaleformMovieMethodParameterString(message)
    PushScaleformMovieMethodParameterString(subtitle)
    PushScaleformMovieMethodParameterInt(0)
    EndScaleformMovieMethod()

    for (let i = 0; i < ms; i++) {
        await Wait(0)
        DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255)
    } 
}

function setRelationshipToEveryone(relationship, hash) {
    SetRelationshipBetweenGroups(relationship, hash, 0x02B8FA80)
    SetRelationshipBetweenGroups(relationship, 0x02B8FA80, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x47033600)
    SetRelationshipBetweenGroups(relationship, 0x47033600, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xA49E591C)
    SetRelationshipBetweenGroups(relationship, 0xA49E591C, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xF50B51B7)
    SetRelationshipBetweenGroups(relationship, 0xF50B51B7, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xA882EB57)
    SetRelationshipBetweenGroups(relationship, 0xA882EB57, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xFC2CA767)
    SetRelationshipBetweenGroups(relationship, 0xFC2CA767, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x4325F88A)
    SetRelationshipBetweenGroups(relationship, 0x4325F88A, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x11DE95FC)
    SetRelationshipBetweenGroups(relationship, 0x11DE95FC, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x8DC30DC3)
    SetRelationshipBetweenGroups(relationship, 0x8DC30DC3, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x0DBF2731)
    SetRelationshipBetweenGroups(relationship, 0x0DBF2731, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x90C7DA60)
    SetRelationshipBetweenGroups(relationship, 0x90C7DA60, hash)
    
    SetRelationshipBetweenGroups(relationship, hash, 0x11A9A7E3)
    SetRelationshipBetweenGroups(relationship, 0x11A9A7E3, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x45897C40)
    SetRelationshipBetweenGroups(relationship, 0x45897C40, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xC26D562A)
    SetRelationshipBetweenGroups(relationship, 0xC26D562A, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x7972FFBD)
    SetRelationshipBetweenGroups(relationship, 0x7972FFBD, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x783E3868)
    SetRelationshipBetweenGroups(relationship, 0x783E3868, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x936E7EFB)
    SetRelationshipBetweenGroups(relationship, 0x936E7EFB, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x6A3B9F86)
    SetRelationshipBetweenGroups(relationship, 0x6A3B9F86, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xB3598E9C)
    SetRelationshipBetweenGroups(relationship, 0xB3598E9C, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x8296713E)
    SetRelationshipBetweenGroups(relationship, 0x8296713E, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x84DCFAAD)
    SetRelationshipBetweenGroups(relationship, 0x84DCFAAD, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xC01035F9)
    SetRelationshipBetweenGroups(relationship, 0xC01035F9, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x7BEA6617)
    SetRelationshipBetweenGroups(relationship, 0x7BEA6617, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x229503C8)
    SetRelationshipBetweenGroups(relationship, 0x229503C8, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xCE133D78)
    SetRelationshipBetweenGroups(relationship, 0xCE133D78, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xD9D08749)
    SetRelationshipBetweenGroups(relationship, 0xD9D08749, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x80401068)
    SetRelationshipBetweenGroups(relationship, 0x80401068, hash)
    
    SetRelationshipBetweenGroups(relationship, hash, 0x49292237)
    SetRelationshipBetweenGroups(relationship, 0x49292237, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x5B4DC680)
    SetRelationshipBetweenGroups(relationship, 0x5B4DC680, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x270A5DFA)
    SetRelationshipBetweenGroups(relationship, 0x270A5DFA, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x392C823E)
    SetRelationshipBetweenGroups(relationship, 0x392C823E, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x024F9485)
    SetRelationshipBetweenGroups(relationship, 0x024F9485, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x14CAB97B)
    SetRelationshipBetweenGroups(relationship, 0x14CAB97B, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xE3D976F3)
    SetRelationshipBetweenGroups(relationship, 0xE3D976F3, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x522B964A)
    SetRelationshipBetweenGroups(relationship, 0x522B964A, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xEB47D4E0)
    SetRelationshipBetweenGroups(relationship, 0xEB47D4E0, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0xB0423AA0)
    SetRelationshipBetweenGroups(relationship, 0xB0423AA0, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x7EA26372)
    SetRelationshipBetweenGroups(relationship, 0x7EA26372, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x72F30F6E)
    SetRelationshipBetweenGroups(relationship, 0x72F30F6E, hash)

    SetRelationshipBetweenGroups(relationship, hash, 0x31E50E10)
    SetRelationshipBetweenGroups(relationship, 0x31E50E10, hash)
}

//STATS
async function StartStatsRuntime() {
    Squad.Runtime.Stats = setInterval(() => {
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
            for (const key in Squad.Session.TeamData) {
                textTeams = textTeams + `\n - [${key}] ${Squad.Session.TeamData[key].name} Slots: ${Squad.Session.TeamData[key].players}/${Squad.Session.TeamData[key].slots}`
            }
            AddTextComponentString(textTeams)
        } else {
            for (const key in globalPlayers2) {
                if (globalPlayers2[key]["team"] == currentTeam) {
                    textPlayers = textPlayers + `\n - [${globalPlayers2[key]["id"]}] ${globalPlayers2[key]["name"]}`
                }
            }
            AddTextComponentString(textPlayers)
        }
        EndTextCommandDisplayText(0.8, 0.005)
    });
}

function StartNeutralAreaRuntime() {
    Squad.Runtime.neutralArea = setInterval(async () => {
        let ped = PlayerPedId()
        let coords = GetEntityCoords(ped)
        let model = GetEntityModel(ped)
    
        ClearArea(coords[0], coords[1], coords[2], 50, false, false, false, false)
            
        if (!IsEntityInArea(ped, globalSettings2["NeutralZone"]["spawnpoint"][0] -130, globalSettings2["NeutralZone"]["spawnpoint"][1] -130, globalSettings2["NeutralZone"]["spawnpoint"][2] - 10, globalSettings2["NeutralZone"]["spawnpoint"][0] + 130, globalSettings2["NeutralZone"]["spawnpoint"][1] + 130, globalSettings2["NeutralZone"]["spawnpoint"][2] + 50)) {
            exports.spawnmanager.spawnPlayer({
                x: globalSettings2["NeutralZone"]["spawnpoint"][0],
                y: globalSettings2["NeutralZone"]["spawnpoint"][1],
                z: globalSettings2["NeutralZone"]["spawnpoint"][2],
                model: model
            });
            await Wait(2000)
        }

        DrawMarker(1, globalSettings2["NeutralZone"]["spawnpoint"][0], globalSettings2["NeutralZone"]["spawnpoint"][1], globalSettings2["NeutralZone"]["spawnpoint"][2] - 10, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 270, 270, 150, 255, 255, 255, 180, false, false, 2, false, undefined, undefined, false)
        SetEntityInvincible(PlayerPedId(), true)
    
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
        
            AddTextComponentString(`Countdown\n${countMinute}:${countSecond}`)
        
            EndTextCommandDisplayText(0.5, 0.1)
        }
    })
    
    
}

function StartPrepareAreaRuntime() {
    Squad.Runtime.prepareArea = setInterval(async () => {
        let ped = PlayerPedId()
        let pedVehicle = undefined
        
        if (!IsEntityInArea(ped, globalTeams2[currentTeam]["spawnpoint"][0] -130, globalTeams2[currentTeam]["spawnpoint"][1] -130, globalTeams2[currentTeam]["spawnpoint"][2] - 10,  globalTeams2[currentTeam]["spawnpoint"][0] + 130,  globalTeams2[currentTeam]["spawnpoint"][1] + 130,  globalTeams2[currentTeam]["spawnpoint"][2] + 50)) {
            if (IsPedInAnyVehicle(ped)){
                pedVehicle = GetVehiclePedIsIn(ped)
                SetEntityAsMissionEntity(pedVehicle, false, true)
                DeleteVehicle(pedVehicle)
            }
            exports.spawnmanager.spawnPlayer({
                x: globalTeams2[currentTeam]["spawnpoint"][0],
                y: globalTeams2[currentTeam]["spawnpoint"][1],
                z: globalTeams2[currentTeam]["spawnpoint"][2],
                model: globalTeams2[currentTeam]["ped_model"]
            });
            await Wait(2000)
        }

        for (const key in globalTeams2) {
            if (globalTeams2[key]["used"]) {
                DrawMarker(1, globalTeams2[key]["spawnpoint"][0], globalTeams2[key]["spawnpoint"][1], globalTeams2[key]["spawnpoint"][2] - 10, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 270, 270, 50, 255, 255, 255, 100, false, false, 2, false, undefined, undefined, false)
            }
        }
        SetEntityInvincible(PlayerPedId(), true)
        
        
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
        
            AddTextComponentString(`Prepare for Battle\n${countMinute}:${countSecond}`)
        
            EndTextCommandDisplayText(0.5, 0.1)
        }
    })
}

StartStatsRuntime()

setTick(async () => {
    if (!Squad.Session.gameActive && !Squad.Runtime.prepareArea) {return}
    for (const key in globalMarkers) {
        const coord = globalMarkers[key]
        DrawMarker(2,coord[0],coord[1],coord[2] + 4, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 2.0, 2.0, 2.0, 50, 50, 204, 255, true, false, 2, true, undefined, undefined, false)
        DrawMarker(1,coord[0],coord[1],coord[2] - 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 6.0, 3.0, 50, 50, 204, 100, false, false, 2, true, undefined, undefined, false)
    }
})




Squad.RequestSettings = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestSettings", (obj) => {
            if (obj == undefined) {reject("Settings not found")}
            resolve(obj)
        })
    })
}

Squad.RequestTeams = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestTeams", (obj) => {
            if (obj == undefined) {reject("Teams not found")}
            resolve(obj)
        })
    })
}

Squad.RequestVehicles = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestVehicles", (obj) => {
            if (obj == undefined) {reject("Vehicles not found")}
            resolve(obj)
        })
    })
}

Squad.RequestWeapons = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestWeapons", (obj) => {
            if (obj == undefined) {reject("Weapons not found")}
            resolve(obj)
        })
    })
}

Squad.RequestTargets = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestTargets", (obj) => {
            if (obj == undefined) {reject("Targets not found")}
            resolve(obj)
        })
    })
}

Squad.RequestPlayers = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestPlayers", (obj) => {
            if (obj == undefined) {reject("Players not found")}
            resolve(obj)
        })
    })
}

Squad.RequestPlayerData = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requetPlayer", (obj) => {
            if (obj == undefined) {reject("Playerdata not found")}
            resolve(obj)
        })
    })
}

Squad.RequestAdminStatus = () => {
    return new Promise((resolve, reject) => {
        Squad.RequestCallback("sb?requestAdmin", (obj) => {
            if (obj == undefined) {reject("Adminstatus not found")}
            resolve(obj)
        })
    })
}