import Path from './helpers/Path'
import floydWarshall from './algorithms/FloydWarshall'
import Factory from './entities/Factory'
import Troop from './entities/Troop'
import Bomb from './entities/Bomb'
import State from './helpers/State'
import _ from './common/Utils'
import { ENEMY, NEUTRAL, ME } from './common/Constants'
import Time from './common/Time'

class World {
	constructor(numberOfFactories) {
		this.numberOfFactories = numberOfFactories
		this.factories = []
		this.enemyFactories = []
		this.neutralFactories = []
		this.myFactories = []

		for (let i = 0; i < numberOfFactories; i++) {
			this.factories[i] = new Factory(i)
		}

		this.troops = []
		this.bombs = []
		this.identifiedBombs = []
		this.bombTargets = []

		this.turn = 0

		this.bombsAvailable = 2
		this.enemyBombsAvailable = 2
		this.enemyBombsExploded = 0

		this.floydWarshall = {}

		this.maxDistance = 0
		this.minDistance = 20

		this.states = new Map()
	}

	init() {
		this.initFloydWarshall()
		this.calculatePaths()
	}

	update() {
		this.updateFactories()
		this.checkBombsLanded()
		this.simulateStates()
	}

	incrementTurn() {
		this.turn++
	}

	getFactory(id) {
		return this.factories[id]
	}

	getStateInTurn(turn) {
		return this.states.get(turn)
	}

	getFactoryStateInTurn(factoryId, turn) {
		let state = this.states.get(turn)

		if (state) {
			return state.factories.filter(f => f.id == factoryId)[0]
		} else {
			return null
		}
	}

	addTroop(id, owner, source, destination, cyborgs, remainingTurns) {
		const troop = new Troop(
			id,
			owner,
			source,
			destination,
			cyborgs,
			remainingTurns,
		)
		this.troops.push(troop)
		this.factories[destination].incomingTroops.push(troop)
		this.factories[destination].addTroopInTurn(
			this.turn + remainingTurns,
			troop,
		)
	}

	addBomb(id, owner, source, destination, remainingTurns) {
		const bomb = new Bomb(
			id,
			owner,
			source,
			destination !== -1 ? destination : null,
			remainingTurns,
		)
		this.bombs.push(bomb)
		if (destination !== -1) {
			this.factories[destination].incomingBombs.push(bomb)
			this.factories[destination].addBombInTurn(
				this.turn + remainingTurns,
				bomb,
			)
		}
	}

	removeBomb() {
		this.bombsAvailable
			? this.bombsAvailable--
			: console.error('ERROR: No bombs available.')
	}

	removeEnemyBomb() {
		this.enemyBombsAvailable
			? this.enemyBombsAvailable--
			: console.error('ERROR: No enemy bombs available.')
	}

	checkBombsLanded() {
		let factories = this.myFactories.filter(f => f.makingIn === 5)
		let state = this.getStateInTurn(this.turn - 1)
		if (factories.length) {
			if (
				factories.filter(
					f => !state.bombs.some(b => b.owner == ME && b.destination == f.id),
				).length
			) {
				this.enemyBombsExploded++
				if (this.enemyBombsExploded == 2) this.enemyBombsAvailable = 0
			}
		}
	}

	updateFactories() {
		this.enemyFactories = _.factories.getFactories(this.factories, ENEMY)
		this.neutralFactories = _.factories.getFactories(this.factories, NEUTRAL)
		this.myFactories = _.factories.getFactories(this.factories, ME)
	}

	resetAndIncrementTurn() {
		this.troops = []
		this.bombs = []
		this.factories.forEach(factory => {
			factory.incomingTroops = []
			factory.incomingBombs = []
		})
		this.enemyFactories = []
		this.neutralFactories = []
		this.myFactories = []

		for (let i = 0, len = this.identifiedBombs.length; i < len; ++i) {
			const bomb = this.identifiedBombs[i]
			bomb.remainingTurns--
			if (bomb.remainingTurns > 1) {
				this.factories[bomb.destination].incomingBombs.push(bomb)
			}
		}

		this.incrementTurn()
	}

	initFloydWarshall() {
		this.floydWarshall = floydWarshall(this.factories)
	}

	calculatePaths() {
		this.factories.forEach(start => {
			this.factories.forEach(end => {
				start.addPath(end.id, this.buildPath(new Path(start.id, end.id)))

				if (start.distanceTo(end.id) <= 5) {
					start.addNeighbor(end.id)
				}
			})
		})
	}

	buildPath(path) {
		try {
			const vertices = this.floydWarshall.nextVertices
			const distances = this.floydWarshall.distances

			if (path.getNext() == path.getStart()) return path

			let next = vertices[path.getStart()][path.getNext()]

			if (next) this.getFactory(next).increasePathsThroug()

			path.setTurnsToNext(distances[path.getPrevious()][path.getNext()])
			path.setTurnsToEnd(path.getTurnsToEnd() + path.getTurnsToNext())

			path.setPrevious(path.getNext())
			path.setNext(next)
			path.addNode(next)

			return this.buildPath(path)
		} catch (error) {
			console.error('buildPath', error)
		}
	}

	simulateStates() {
		let state = new State(this)
		this.states.set(this.turn, state)

		for (let index = 1; index <= this.maxDistance; index++) {
			state = new State(state)
			state.simulateNewTurn()
			this.states.set(this.turn + index, state)
		}
	}
}

export default World
