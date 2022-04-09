class xTeam {
    constructor(index) {
        this.index = index
        this.label = "TeamName"
        this.enabled = false,
        this.spawnpoint = [0.0, 0.0, 0.0]
        this.active = 0
        this.blip = {
            sprite: 176,
            color: 1,
            scale: 1.5,
            label: "TeamName"
        }
        this.players = []
    }

    SetTeamLabel(label) {
        this.label = label
    }

    SetTeamEnabled(enabled) {
        this.enabled = enabled
    }

    SetTeamSpawnpoint(x, y, z) {
        this.spawnpoint = [x, y, z]
    }

    SetTeamActive(active) {
        this.active = active
    }

    SetTeamBlip(sprite, color, scale, label) {
        this.blip = {
            sprite: sprite,
            color: color,
            scale: scale,
            label: label
        }
    }

    AddTeamPlayer(player) {
        this.players.push(player)
    }

    RemoveTeamPlayer(player) {
        for (const key in this.players) {
            if (this.players[key] == player.id) {
                this.players.splice(key, 1)
            }
        }
    }

}