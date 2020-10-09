import Action from '../helpers/Action'
import { NEUTRAL } from '../common/Constants'
import Troop from './Troop'
import Bomb from './Bomb'

class Factory {
	constructor(id) {
		this.id = id

		this.owner = null
		this.cyborgs = null
		this.production = null
		this.makingIn = null
		this.isMaking = false

		this.distances = new Map()
		this.paths = new Map()
		this.pathsThroug = 0
		this.neighbors = []

		this.actions = new Map()
		this.incomingTroops = []
		this.incomingBombs = []

		this.troopsByTurns = new Map()
		this.bombsByTurns = new Map()

		this.needIncrease = false
	}

	update(owner, cyborgs, production, makingIn) {
		this.owner = owner
		this.cyborgs = cyborgs
		this.production = production
		this.makingIn = makingIn

		this.isMaking = this.owner != NEUTRAL ? (!makingIn ? true : false) : false
	}

	isMaking() {
		return this.isMaking
	}

	increasePathsThroug() {
		this.pathsThroug++
	}

	addTroop(turn, owner, factory, cyborgs) {
		const troop = new Troop(
			0,
			owner,
			factory.id,
			this.id,
			cyborgs,
			factory.distanceTo(this),
		)
		this.incomingTroops.push(troop)
		this.addTroopInTurn(turn + factory.distanceTo(this), troop)
	}

	addBomb(turn, owner, source) {
		const bomb = new Bomb(0, owner, source.id, this.id, source.distanceTo(this))
		this.incomingBombs.push(bomb)
		this.addBombInTurn(turn + source.distanceTo(this), bomb)
	}

	addAction(turn, type, target, score = null, cyborgs = null) {
		let actions = this.actions.get(turn)
		let action = new Action(type, target, score, cyborgs)
		if (actions) {
			actions.push(action)
		} else {
			actions = new Array()
			actions.push(action)
		}
		this.actions.set(turn, actions)
	}

	getActions(turn) {
		return this.actions.get(turn)
	}

	addTroopInTurn(turn, troop) {
		let troops = this.troopsByTurns.get(turn)
		if (troops) {
			troops.push(troop)
		} else {
			troops = new Array()
			troops.push(troop)
		}
		this.troopsByTurns.set(turn, troops)
	}

	getTroopsInTurn(turn) {
		return this.troopsByTurns.get(turn)
	}

	addBombInTurn(turn, bomb) {
		let bombs = this.bombsByTurns.get(turn)
		if (bombs) {
			bombs.push(bomb)
		} else {
			bombs = new Array()
			bombs.push(bomb)
		}
		this.bombsByTurns.set(turn, bombs)
	}

	getBombsInTurn(turn) {
		return this.bombsByTurns.get(turn)
	}

	removeCyborgs(cyborgs) {
		let cyborgsRemoved = 0

		if (this.cyborgs) {
			cyborgsRemoved = cyborgs - Math.abs((this.cyborgs -= cyborgs))
			if (this.cyborgs < 0) {
				this.cyborgs = 0
			} else {
				cyborgsRemoved += this.cyborgs
			}
		}
		return cyborgsRemoved
	}

	removeCyborgsForIncrement() {
		if (this.cyborgs >= 10) {
			this.cyborgs -= 10
			return true
		}
		return false
	}

	getCyborgsAvailable(enemyCyborgs = 0) {
		let cyborgsAvailable = this.cyborgs - enemyCyborgs
		return cyborgsAvailable > 0 ? cyborgsAvailable : 0
	}

	getValue() {
		let productionValue = 8
		let staticProductionValue = 8

		let pathsValue = 8
		let minValue = 8
		if (this.id === 0) minValue = 8
		return (
			this.production * productionValue +
			staticProductionValue * Math.pow(this.pathsThroug, pathsValue) +
			minValue
		)
	}

	addNeighbor(id) {
		this.neighbors.push(id)
	}

	getNeighbors() {
		return this.neighbors
	}

	addPath(id, path) {
		this.paths.set(id, path)
	}

	distanceTo(factory) {
		try {
			return this.distances.get(
				factory.constructor.name === 'Factory' ? factory.id : factory,
			)
		} catch (error) {
			console.error('Ivalid input distanceTo:', error)
		}
	}

	pathTo(factory) {
		try {
			return this.paths.get(
				factory.constructor.name === 'Factory' ? factory.id : factory,
			)
		} catch (error) {
			console.error('Ivalid input pathTo:', error)
		}
	}

	turnsTo(factory) {
		try {
			return this.paths
				.get(factory.constructor.name === 'Factory' ? factory.id : factory)
				.getTurnsToEnd()
		} catch (error) {
			console.error('Ivalid input turnsTo:', error)
		}
	}

	turnsToConquer(factory) {
		try {
			let path = this.paths.get(
				factory.constructor.name === 'Factory' ? factory.id : factory,
			)
			return path.getTurnsToEnd() + path.getNumberOfNodes()
		} catch (error) {
			console.error('Ivalid input turnsToConquer:', error)
		}
	}

	hasIncomingBombs() {
		return this.incomingBombs.length
	}
}

export default Factory
