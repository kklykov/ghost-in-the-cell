import { ME, ENEMY } from '../Common/Constants'

class Factory {
	constructor(id) {
		this.id = id

		this.owner = null
		this.cyborgs = null
		this.production = null
		this.turnsTillNormalProduction = null

		this.incomingTroops = []
		this.incomingBombs = []

		this.distances = new Map()
	}

	update(owner, cyborgs, production, turnsTillNormalProduction) {
		this.owner = owner
		this.cyborgs = cyborgs
		this.production = production
		this.turnsTillNormalProduction = turnsTillNormalProduction
	}

	getScore() {
		const myCyborgs = this.incomingTroops
			.filter(t => t.owner === ME)
			.map(t => t.cyborgs)
			.reduce((t1, t2) => t1 + t2, 0)

		const enemyCyborgs = this.incomingTroops
			.filter(t => t.owner === ENEMY)
			.map(t => t.cyborgs)
			.reduce((t1, t2) => t1 + t2, 0)

		if (this.owner === ME) {
			// let production = 0

			/* this.incomingTroops.filter(t => t.owner === ENEMY).forEach(troop => {
				production += troop.remainingTurns * this.production;
			}); */

			return enemyCyborgs - (this.cyborgs + myCyborgs + this.production)
		} else if (this.owner === ENEMY) {
			// let production = 0

			/* this.incomingTroops.filter(t => t.owner === ME).forEach(troop => {
				production += troop.remainingTurns * this.production;
			}); */

			return this.cyborgs + enemyCyborgs + this.production - myCyborgs
		} else {
			return this.cyborgs + enemyCyborgs - myCyborgs
		}
	}

	distanceTo(factory) {
		return this.distances.get(
			factory.constructor.name === 'Factory' ? factory.id : factory,
		)
	}
}

export default Factory
