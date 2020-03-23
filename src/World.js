import Factory from './entities/Factory'
import Troop from './entities/Troop'
import Bomb from './entities/Bomb'

class World {
	constructor(factoryCount) {
		this.factories = []
		this.troops = []
		this.bombs = []

		for (let i = 0; i < factoryCount; i++) {
			this.factories[i] = new Factory(i)
		}

		this.turn = -1
		this.bombsAvailable = 2
	}

	addTroop(owner, sourceID, destinationID, production, remainingTurns) {
		const troop = new Troop(
			owner,
			this.factories[sourceID],
			this.factories[destinationID],
			production,
			remainingTurns,
		)
		this.troops.push(troop)
		this.factories[destinationID].incomingTroops.push(troop)
	}

	addBomb(owner, sourceID, destinationID, remainingTurns) {
		const bomb = new Bomb(
			owner,
			this.factories[sourceID],
			destinationID !== -1 ? this.factories[destinationID] : null,
			remainingTurns,
		)
		this.bombs.push(bomb)
		if (destinationID !== -1) {
			this.factories[destinationID].incomingBombs.push(bomb)
		}
	}

	initRound() {
		this.troops = []
		this.bombs = []
		this.factories.forEach(factory => {
			factory.incomingTroops = []
			factory.incomingBombs = []
		})

		this.turn++
	}
}

export default World
