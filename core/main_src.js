//import * as Cfx from 'fivem-js';
import {Menu, UIMenuItem, UIMenuCheckboxItem, UIMenuSeparatorItem} from 'fivem-js';


const MainMenu = new Menu("SquadBattle", "PvP / PvE Battle")
const AllTeamsMenu = new Menu("All Teams", "Show all joinable Teams")
const CurrentTeamMenu = new Menu("Current Team", "Show Current Team")
const SettingsMenu = new Menu("Settings", "All Settings")
const AdminMenu = new Menu("Admin", "Adminoptions")
const AdminTeamMenu = new Menu("Team Options", "Administrative team options")
const AdminCreateTeamMenu = new Menu("Create New Team", "Creating a new team")
const AdminRemoveTeamMenu = new Menu("Remove Team", "Removing a team")

const AllTeamItem = new UIMenuItem("All Teams", "Show all joinable Teams")
const CurrentTeamItem = new UIMenuItem("Current Team", "Show Current Team")
const SettingsItem = new UIMenuItem("Settings", "All Settings")
const AdminItem = new UIMenuItem("Admin", "Adminoptions")
const AdminTeamItem = new UIMenuItem("Team Options", "Administrative team options")
const AdminCreateTeamItem = new UIMenuItem("Create New Team", "Creating a new team")
const AdminRemoveTeamItem = new UIMenuItem("Remove Team", "Removing a team")

const TeamMenuJoin = new Menu("Team Options")
const TeamMenuLeave = new Menu("Team Options")

MainMenu.addItem(AllTeamItem)
MainMenu.addItem(CurrentTeamItem)
MainMenu.addItem(SettingsItem)
MainMenu.addItem(AdminItem)

MainMenu.bindMenuToItem(AllTeamsMenu, AllTeamItem)
MainMenu.bindMenuToItem(CurrentTeamMenu, CurrentTeamItem)
MainMenu.bindMenuToItem(SettingsMenu, SettingsItem)
MainMenu.bindMenuToItem(AdminMenu, AdminItem)

//#region Menu Settings (Disable Mouse Control)
MainMenu.Settings.mouseControlsEnabled = false
MainMenu.Settings.mouseEdgeEnabled = false
MainMenu.Settings.resetCursorOnOpen = false
MainMenu.Settings.controlDisablingEnabled = false

AllTeamsMenu.Settings.mouseControlsEnabled = false
AllTeamsMenu.Settings.mouseEdgeEnabled = false
AllTeamsMenu.Settings.resetCursorOnOpen = false
AllTeamsMenu.Settings.controlDisablingEnabled = false

CurrentTeamMenu.Settings.mouseControlsEnabled = false
CurrentTeamMenu.Settings.mouseEdgeEnabled = false
CurrentTeamMenu.Settings.resetCursorOnOpen = false
CurrentTeamMenu.Settings.controlDisablingEnabled = false

SettingsMenu.Settings.mouseControlsEnabled = false
SettingsMenu.Settings.mouseEdgeEnabled = false
SettingsMenu.Settings.resetCursorOnOpen = false
SettingsMenu.Settings.controlDisablingEnabled = false

AdminMenu.Settings.mouseControlsEnabled = false
AdminMenu.Settings.mouseEdgeEnabled = false
AdminMenu.Settings.resetCursorOnOpen = false
AdminMenu.Settings.controlDisablingEnabled = false
//#endregion

MainMenu.menuOpen.on(() => {
    if (currentTeam) {
        AllTeamItem.enabled = false
        CurrentTeamItem.enabled = true
    }

    if (!currentTeam) {
        AllTeamItem.enabled = true
        CurrentTeamItem.enabled = false
    }

    InitializeMenu()
})


const AdminEndGameItem = new UIMenuItem("End Game", "Ends a current running Game-Sesison")
const AdminReloadAllItem = new UIMenuItem("Reload", "Reloads Skript and resets all Players")

AdminMenu.addItem(AdminEndGameItem)
AdminMenu.addItem(AdminReloadAllItem)
//AdminMenu.addItem(AdminTeamItem)

AdminMenu.bindMenuToItem(AdminTeamMenu, AdminTeamItem)

AdminTeamMenu.addItem(AdminCreateTeamItem)
AdminTeamMenu.addItem(AdminRemoveTeamItem)
AdminTeamMenu.bindMenuToItem(AdminCreateTeamMenu, AdminCreateTeamItem)
AdminTeamMenu.bindMenuToItem(AdminRemoveTeamMenu, AdminRemoveTeamItem)

AdminEndGameItem.activated.on(() => {
    emitNet("sb:endgame", GetPlayerServerId(GetPlayerIndex()))
})

AdminReloadAllItem.activated.on(() => {
    emitNet("sb:reloadAll", GetPlayerServerId(GetPlayerIndex()))
})


AdminCreateTeamMenu.menuOpen.on(() => {
    AdminCreateTeamMenu.clear()
    let CreateTeamSpacer0 = new UIMenuSeparatorItem("Settings")
    let CreateTeamName = new UIMenuItem("Name:", "Name des Teams")
    let CreateTeamSpawn = new UIMenuItem("Spawn:", "Spawnlocation")
    let CreateTeamPed = new UIMenuItem("Ped:", "Ped of Team")
    let CreateTeamBlip = new UIMenuItem("Blip:", "Blip of Team")
    let CreateTeamSpacer1 = new UIMenuSeparatorItem("Functions")
    let CreateTeamCreate = new UIMenuItem("Create", "Create Team")
    let CreateTeamReset = new UIMenuItem("Reset", "Reset settings")

    CreateTeamName.RightLabel = "Undefined"
    CreateTeamSpawn.RightLabel = "Undefined"
    CreateTeamPed.RightLabel = "Undefined"
    CreateTeamBlip.RightLabel = "Undefined"

    AdminCreateTeamMenu.addItem(CreateTeamSpacer0)
    AdminCreateTeamMenu.addItem(CreateTeamName)
    AdminCreateTeamMenu.addItem(CreateTeamSpawn)
    AdminCreateTeamMenu.addItem(CreateTeamPed)
    AdminCreateTeamMenu.addItem(CreateTeamBlip)
    AdminCreateTeamMenu.addItem(CreateTeamSpacer1)
    AdminCreateTeamMenu.addItem(CreateTeamCreate)
    AdminCreateTeamMenu.addItem(CreateTeamReset)


    CreateTeamReset.activated.on(() => {
        CreateTeamName.RightLabel = "Undefined"
        CreateTeamSpawn.RightLabel = "Undefined"
        CreateTeamPed.RightLabel = "Undefined"
        CreateTeamBlip.RightLabel = "Undefined"
    })

    CreateTeamName.activated.on(async () => {
        AdminCreateTeamMenu.visible = false
        let label = await OpenKeyboarDialog("Team Name")
        CreateTeamName.RightLabel = label
        AdminCreateTeamMenu.visible = true
    })
    CreateTeamSpawn.activated.on(async () => {
        AdminCreateTeamMenu.visible = false
        let label = await OpenKeyboarDialog("Team Spawn")
        CreateTeamSpawn.RightLabel = label
        AdminCreateTeamMenu.visible = true
    })
    CreateTeamPed.activated.on(async () => {
        AdminCreateTeamMenu.visible = false
        let label = await OpenKeyboarDialog("Team Ped")
        CreateTeamPed.RightLabel = label
        AdminCreateTeamMenu.visible = true
    })
    CreateTeamBlip.activated.on(async () => {
        AdminCreateTeamMenu.visible = false
        let label = await OpenKeyboarDialog("Team Blip")
        CreateTeamBlip.RightLabel = label
        AdminCreateTeamMenu.visible = true
    })
})



async function OpenKeyboarDialog(title) {
    AddTextEntry("CurrentTitle", title)
    DisplayOnscreenKeyboard(1, "CurrentTitle", "", "", "", "", "", 64)

    while (UpdateOnscreenKeyboard() != 1 && UpdateOnscreenKeyboard() != 2) {
        await Wait(1)
    }

    let result = GetOnscreenKeyboardResult()
    if (!result || result == "") {OpenKeyboarDialog(title)}
    return result
}
 

const SettingsShowStatsItem = new UIMenuCheckboxItem("Show Stats", true, "Turn on/off the top-left stats")

SettingsMenu.addItem(SettingsShowStatsItem)

SettingsShowStatsItem.checkboxChanged.on(() => {
    Squad.Settings.showStats = SettingsShowStatsItem.Checked
})


//#region Main
function InitializeMenu() {
    AllTeamsMenu.clear()
    CurrentTeamMenu.clear()
    TeamMenuJoin.clear()
    TeamMenuLeave.clear()


    if (currentTeam != undefined) {
        for (const key in globalTeams) {
            if (key == currentTeam) {
                const menu = CurrentTeamMenu.addSubMenu(TeamMenuLeave, `[Team] ${key}`, `Slots: ${globalTeams[key]["active"]}/${globalSettings["teams"]["slots"] }`)
    
                const leavebutton = new UIMenuItem("Leave Team")
                menu.addItem(leavebutton)
                leavebutton.activated.on(() => {
                    MainMenu.close()
                    emitNet("sb:leaveteam")
                })
            }
        }
    } else {
        for (const key in globalTeams) {
            if (!globalTeams[key]["used"]) {continue}
            const menu = AllTeamsMenu.addSubMenu(TeamMenuJoin, `[Team] ${key}`, `Slots: ${globalTeams[key]["active"]}/${globalSettings["teams"]["slots"] }`)
    
            const joinbutton = new UIMenuItem("Join Team")
    
            menu.addItem(joinbutton)
    
            joinbutton.activated.on(() => {
                MainMenu.close()
                emitNet("sb:jointeam", key)
            })
        }
    }

    if (Squad.Player.isAdmin) {
        AdminItem.enabled = true
    } else {
        AdminItem.enabled = false
    }
}

//#endregion

//#region Events

//#endregion

//#region init
function OpenSquadBattleInteractions() {
    switch (MainMenu.visible) {
        case false: MainMenu.open();break;
        default: MainMenu.close();break;
    }
}

RegisterKeyMapping("squadbattleinteractions", "SquadBattle Interaktionen öffnen", "keyboard", "F3")
RegisterCommand("squadbattleinteractions", () => {
    OpenSquadBattleInteractions()
})

//#endregion