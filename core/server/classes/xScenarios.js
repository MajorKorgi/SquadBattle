class xScenario{
    constructor(name, type, spawnpoint, movesAround, attackTeam, amount, team) {
        this.name = name
        this.type = type
        this.spawnpoint = spawnpoint
        this.movesAround = movesAround
        this.attackTeam = attackTeam
        this.amount = amount
        this.team = team

        this.spawned = false
        this.destroyed = false
    }

    setSpawned(spawned) {
        this.spawned = spawned
    }

    setDestroyed(destroyed) {
        this.destroyed = destroyed
    }
}

class xVehiclescenario extends xScenario {
    constructor(name, type, spawnpoint, movesAround, attackTeam, hasDriver, driver, driverStyle, amount, maxSpeed, team) {
        super(name, type, spawnpoint, movesAround, attackTeam, amount, team)

        this.hasDriver = hasDriver
        this.driver = driver
        this.driverStyle = driverStyle
        this.maxSpeed = maxSpeed
    }
}

class xPedscenario extends xScenario{
    constructor(name, type, spawnpoint, movesAround, attackTeam, walkArea, amount, hasWeapon, weapon, team) {
        super(name, type, spawnpoint, movesAround, attackTeam, amount, team)

        this.walkArea = walkArea
        this.hasWeapon = hasWeapon
        this.weapon = weapon
    }

    
}


class xSzenarioManager {
    constructor(name) {
        this.name = name ? name : "Undefined"
        this.szenarios = []
    }


    loadSzenario() {
        for (const i in this.szenarios) {
            let szene = this.szenarios[i]

            if (szene.type == "vehicle") {
                continue
            }

            if (szene.type == "ped") {
                continue
            }

            if (szene.type == "object") {
                continue
            }

            console.log(`TARGET: ${target["object_name"]} has no or unknown team`)

        }
    }

    createNewGroup(...szenes) {
        let group = []

        for (const i in szenes) {
            group.push(szenes[i])
        }

        this.szenarios.push(group)
        return group
    } 
}

