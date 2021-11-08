import * as Cfx from 'fivem-js';

const MainMenu = new Cfx.Menu("SquadBattle", "PvP / PvE Battle")
MainMenu.Settings.mouseControlsEnabled = false
MainMenu.Settings.mouseEdgeEnabled = false
MainMenu.Settings.resetCursorOnOpen = false


//#region Main
function InitalizeTeams() {
    MainMenu.clear()
    for (const key in globalTeams) {
        if (!globalTeams[key]["used"]) {continue}

        const val = globalTeams[key]
        const team = MainMenu.addNewSubMenu(`[Team] ${key}`, `Slots: ${globalTeams[key]["active"]}/${globalSettings["teams"]["slots"] }`)

        const joinbutton = new Cfx.UIMenuItem("Join Team")

        team.addItem(joinbutton)

        joinbutton.activated.on(() => {
            MainMenu.close()
            emitNet("sb:jointeam", key)
            emit("sb:addcurrentteam")
        })
    }
}


function AddCurrentTeam() {
    MainMenu.clear()
    console.log(currentTeam)
    for (const key in globalTeams) {
        if (key == currentTeam) {
            const val = globalTeams[key]
            const team = MainMenu.addNewSubMenu(`[Team] ${key}`, `Slots: ${globalTeams[key]["active"]}/${globalSettings["teams"]["slots"] }`)

            const leavebutton = new Cfx.UIMenuItem("Leave Team")

            team.addItem(leavebutton)

            leavebutton.activated.on(() => {
                MainMenu.close()
                emitNet("sb:leaveteam")
                emit("sb:initalizeteams")
            })
        }
    }
}
//#endregion

//#region Events
on("sb:initalizeteams", () => { 
    InitalizeTeams()
    MainMenu.open()
})

on("sb:addcurrentteam", async () => {
    while (!currentTeam) {
        await Wait(1)
    }
    AddCurrentTeam()
    MainMenu.open()
})

on("onClientResourceStart", async () => {
    await Wait(2500)
    InitalizeTeams()
    MainMenu.open()
})
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