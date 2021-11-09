class xPlayer {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.active = false
        this.dead = false
        this.team = undefined
    }

    setId(id) {
        this.id = id
    }

    setName(name) {
        this.name = name
    }

    setActive(status) {
        this.active = status
    }

    setDead(dead) {
        this.dead = dead
    }

    setTeam(team) {
        this.team = team
    }
}