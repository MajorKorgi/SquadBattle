var globalTeams = []
var globalPlayers = []
var globalSettings = []
var globalWeapons = []
var globalTargets = []
var globalMarkers = []

var globalTargetBlipsPeds = []
var globalTargetBlipsVehicles = []
var globalTargetBlipsObjects = []
var currentTeam = undefined

let countMinute = 0
let countSecond = 0

let countdownActive = false
let activeNeutralArea = false
let activePrepareArea = false

let globalCam = undefined
let gloabelTargetPlayer = undefined

let showStats = true

let AllBlips =  []

let tehash
let teretval

const [taretval, tahash] = AddRelationshipGroup("Targets")
const [neretval, nehash] = AddRelationshipGroup("Neutral")


on('onClientMapStart', async () => {
    let source = GetPlayerServerId(GetPlayerIndex())
    exports.spawnmanager.spawnPlayer({
        x: globalSettings["NeutralZone"]["spawnpoint"][0],
        y: globalSettings["NeutralZone"]["spawnpoint"][1],
        z: globalSettings["NeutralZone"]["spawnpoint"][2],
        model: globalSettings["NeutralZone"]["ped_model"]
    });
    emitNet("PushPlayer", (source))
    await Wait(1000)
    activeNeutralArea = true
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