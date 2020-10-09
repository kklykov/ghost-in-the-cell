import { NEUTRAL, ENEMY, ME } from '../common/Constants'
import rfdc from 'rfdc'

class State {
	constructor(world) {
		const clone = rfdc({ proto: true })
		this.factories = clone(world.factories)
		this.bombs = clone(world.bombs)
		this.turn = clone(world.turn)
	}

	simulateWithoutAddingTurn() {
		this.init()
	}

	simulateNewTurn() {
		this.turn++
		this.init()
	}

	init() {
		this.moveTroopsAndBombs()
		this.produceNewCyborgs()
		this.solveBattles()
		this.makeBombsExplode()
	}

	moveTroopsAndBombs() {
		for (let i = 0, len = this.bombs.length; i < len; ++i) {
			this.bombs[i].remainingTurns--
		}

		for (let i = 0, len = this.factories.length; i < len; ++i) {
			for (
				let y = 0, maxY = this.factories[i].incomingTroops.length;
				y < maxY;
				++y
			) {
				this.factories[i].incomingTroops[y].remainingTurns--
			}

			for (
				let x = 0, maxX = this.factories[i].incomingBombs.length;
				x < maxX;
				++x
			) {
				this.factories[i].incomingBombs[x].remainingTurns--
			}
		}
	}

	produceNewCyborgs() {
		for (let i = 0, len = this.factories.length; i < len; ++i) {
			const factory = this.factories[i]
			if (factory.owner !== NEUTRAL) {
				if (factory.isMaking) {
					factory.cyborgs += factory.production
				} else {
					factory.makingIn--
					if (factory.makingIn == 0) {
						factory.isMaking = true
					}
				}
			}
		}
	}

	solveBattles() {
		for (let i = 0, len = this.factories.length; i < len; ++i) {
			const factory = this.factories[i]
			const reducer = (accumulator, troop) => accumulator + troop.cyborgs
			let enemyCyborgs = factory.incomingTroops
				.filter((t) => t.remainingTurns == 0 && t.owner == ENEMY)
				.reduce(reducer, 0)
			let myCyborgs = factory.incomingTroops
				.filter((t) => t.remainingTurns == 0 && t.owner == ME)
				.reduce(reducer, 0)

			let cyborgs = factory.cyborgs
			switch (factory.owner) {
				case ME:
					cyborgs += myCyborgs - enemyCyborgs
					if (cyborgs < 0) {
						factory.owner = ENEMY
						factory.cyborgs = Math.abs(cyborgs)
					} else {
						factory.cyborgs = cyborgs
					}
					break
				case ENEMY:
					cyborgs += enemyCyborgs - myCyborgs
					if (cyborgs < 0) {
						factory.owner = ME
						factory.cyborgs = Math.abs(cyborgs)
					} else {
						factory.cyborgs = cyborgs
					}
					break
				case NEUTRAL:
					let battleCyborgs = myCyborgs - enemyCyborgs
					let winner = ME
					if (battleCyborgs < 0) {
						winner = ENEMY
						battleCyborgs = Math.abs(battleCyborgs)
					}

					cyborgs -= battleCyborgs

					if (cyborgs < 0) {
						factory.owner = winner
						factory.cyborgs = Math.abs(cyborgs)
						factory.isMaking = true
					} else {
						factory.cyborgs = cyborgs
					}
					break
				default:
					break
			}
		}
	}

	makeBombsExplode() {
		let bombToExplode = this.bombs.filter((bomb) => bomb.remainingTurns === 0)
		let len = bombToExplode.length
		if (len) {
			for (let i = 0; i < len; ++i) {
				const bomb = bombToExplode[i]
				let factory = this.factories.filter((f) => f.id == bomb.destination)
				factory.isMaking = false
				factory.makingIn = 5

				factory.cyborgs < 20
					? factory.cyborgs - 10 < 0
						? (factory.cyborgs = 0)
						: (factory.cyborgs -= 10)
					: (factory.cyborgs = Math.floor(factory.cyborgs / 2))
			}
		}
	}
}

export default State
