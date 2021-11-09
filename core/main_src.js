import * as Cfx from 'fivem-js';

const MainMenu = new Cfx.Menu("SquadBattle", "PvP / PvE Battle")
const AllTeamsMenu = new Cfx.Menu("All Teams", "Show all joinable Teams")
const CurrentTeamMenu = new Cfx.Menu("Current Team", "Show Current Team")
const AdminMenu = new Cfx.Menu("Admin", "Adminoptions")

const AllTeamItem = new Cfx.UIMenuItem("All Teams", "Show all joinable Teams")
const CurrentTeamItem = new Cfx.UIMenuItem("Current Team", "Show Current Team")
const AdminItem = new Cfx.UIMenuItem("Admin", "Adminoptions")

const TeamMenuJoin = new Cfx.Menu("Team Options")
const TeamMenuLeave = new Cfx.Menu("Team Options")

MainMenu.addItem(AllTeamItem)
MainMenu.addItem(CurrentTeamItem)
MainMenu.addItem(AdminItem)

MainMenu.bindMenuToItem(AllTeamsMenu, AllTeamItem)
MainMenu.bindMenuToItem(CurrentTeamMenu, CurrentTeamItem)
MainMenu.bindMenuToItem(AdminMenu, AdminItem)

MainMenu.Settings.mouseControlsEnabled = false
MainMenu.Settings.mouseEdgeEnabled = false
MainMenu.Settings.resetCursorOnOpen = false

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


const AdminEndGameItem = new Cfx.UIMenuItem("End Game", "Ends a current running Game-Sesison")
const AdminReloadAllItem = new Cfx.UIMenuItem("Reload", "Reloads Skript and resets all Players")

AdminMenu.addItem(AdminEndGameItem)
AdminMenu.addItem(AdminReloadAllItem)

AdminEndGameItem.activated.on(() => {
    emitNet("sb:endgame", GetPlayerServerId(GetPlayerIndex()))
})

AdminReloadAllItem.activated.on(() => {
    emitNet("sb:reloadAll", GetPlayerServerId(GetPlayerIndex()))
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
    
                const leavebutton = new Cfx.UIMenuItem("Leave Team")
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
    
            const joinbutton = new Cfx.UIMenuItem("Join Team")
    
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