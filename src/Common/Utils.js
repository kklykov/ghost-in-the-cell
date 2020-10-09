import { ME, ENEMY, NEUTRAL, MOVE, ESCAPE, INCREASE, DEFEND } from './Constants'

// ************************ REPORTS ************************** //

const printBombReport = world => {
	console.error('Enemy bombs available:', world.enemyBombsAvailable)
	console.error('Enemy bombs exploded:', world.enemyBombsExploded)
	console.error('Enemy bombs identified:', world.identifiedBombs.length)
	console.error('Enemy bomb is coming:', isEnemyBombComing(world))
	console.error('New enemy bomb is coming:', isNewEnemyBombComing(world))
}

// ************************ END REPORTS ************************** //

// ************************** MOVES *************************** //

const getBomb = (source, target) => {
	return `BOMB ${source} ${target}`
}

const getIncrement = id => {
	return `INC ${id}`
}

const getMove = (source, target, cyborgs) => {
	return `MOVE ${source} ${target} ${cyborgs}`
}

// ************************ END MOVES ************************* //

// ************************ PRODUCTION ************************ //

const getProductionMessage = world => {
	return `MSG ${getProduction(world, ME)}/${getProduction(world, ENEMY)}`
}

const getProduction = (world, owner) => {
	return getFactories(world.factories, owner).reduce(
		(acc, f) => acc + f.production,
		0,
	)
}

// ************************ END PRODUCTION ********************** //

// ************************ FACTORIES ************************** //

const getFactories = (factories, owner) => {
	return factories.filter(f => f.owner === owner)
}

const getClosestFactory = (target, factories) => {
	return factories
		.filter(t => t.id !== target.id)
		.sort((f1, f2) => f1.distanceTo(target) - f2.distanceTo(target))[0]
}

const getFarthestFactory = (target, factories) => {
	return factories
		.filter(t => t.id !== target.id)
		.sort((f1, f2) => f2.distanceTo(target) - f1.distanceTo(target))[0]
}

const getNeighborsOfType = (factory, owner) => {
	return factory.getNeighbors().filter(n => n.owner === owner)
}

const getFutureClosestFactory = (world, target, factories, turns = 5) => {
	return factories
		.filter(
			t =>
				t.id !== target.id &&
				(t.owner == ME || willBeConqueredBy(world, t, ME, turns)),
		)
		.sort((f1, f2) => f1.distanceTo(target) - f2.distanceTo(target))[0]
}

// ************************ END FACTORIES ********************** //

// ************************ CYBORGS ************************** //

const getAllCyborgsAlive = (world, player) => {
	const reducer = (accumulator, obj) => accumulator + obj.cyborgs
	return (
		world.factories.filter(f => f.owner == player).reduce(reducer, 0) +
		world.troops.filter(t => t.owner == player).reduce(reducer, 0)
	)
}

const getIncomingCyborgs = (factory, owner, turns = 0) => {
	return factory.incomingTroops
		.filter(
			t => t.owner === owner && (turns ? t.remainingTurns <= turns : true),
		)
		.map(t => t.cyborgs)
		.reduce((t1, t2) => t1 + t2, 0)
}

const neededCyborgsToConquer = (world, factory, target) => {
	switch (target.owner) {
		case ME:
			return factory.owner == ME
				? neededCyborgsToDefense(world, factory, target)
				: neededCyborgsToConquerMe(world, factory, target)
		case ENEMY:
			return neededCyborgsToConquerEnemy(world, factory, target)
		case NEUTRAL:
			return neededCyborgsToConquerNeutral(world, factory, target)
		default:
			break
	}
}

const neededCyborgsToDefense = (world, factory, target) => {
	let turnsTo = factory.turnsTo(target)
	let state = world.getFactoryStateInTurn(target.id, world.turn + turnsTo)

	if (!state)
		console.error('neededCyborgsToDefense - not state in', world.turn + turnsTo)

	if (state && state.owner == ENEMY) {
		return state.cyborgs + state.production + 1
	} else {
		// if (target.wantIncrease) {
		// let need = 10 - state.cyborgs
		// return need >= 0 ? need : 0
		// } else {
		return 0
		// }
	}
}

const neededCyborgsToConquerMe = (world, factory, target) => {
	console.error('DEPRECATED - neededCyborgsToConquerMe')
}

const neededCyborgsToConquerEnemy = (world, factory, target) => {
	let turnsTo = factory.turnsTo(target)
	let state = world.getFactoryStateInTurn(target.id, world.turn + turnsTo)

	if (!state)
		console.error(
			'neededCyborgsToConquerEnemy - not state in',
			world.turn + turnsTo,
		)

	if (state && state.owner == ENEMY) {
		let production = state.makingIn == 0 ? state.production : 0
		return state.cyborgs + production + 1
	} else {
		return 0
	}
}

const neededCyborgsToConquerNeutral = (world, factory, target) => {
	let turnsTo = factory.turnsTo(target)
	let state = world.getFactoryStateInTurn(target.id, world.turn + turnsTo)

	if (!state)
		console.error(
			'neededCyborgsToConquerNeutral - not state in',
			world.turn + turnsTo,
		)

	if (state && state.owner != ME) {
		return state.cyborgs + 1
	} else {
		return 0
	}
}

const getProducedCyborgs = (factory, turns) => {
	let produced = 0
	let makingIn = factory.makingIn
	for (let i = 0; i < turns; i++) {
		if (makingIn == 0) {
			produced += factory.production
		} else {
			makingIn--
		}
	}
	return produced
}

// ************************ END CYBORGS ************************** //

// *************************  OWNERSHIP ******************************* //

const willBeConqueredBy = (world, target, owner, turnsTo) => {
	let state = world.getFactoryStateInTurn(target.id, world.turn + turnsTo)

	if (state && state.owner == owner) {
		return true
	} else {
		return false
	}
}

const turnsToBeConqueredBy = (world, owner, factory) => {
	let turn
	for (turn = 1; turn <= world.maxDistance; turn++) {
		if (willBeConqueredBy(world, factory, owner, turn)) {
			return turn
		}
	}
	return false
}

// ************************* END OWNERSHIP ******************************* //

// ***************************** TOOLS ************************************//

const getMirror = player => {
	return player - player * 2
}

const isAtackedBy = (factory, owner) => {
	return getIncomingCyborgs(factory, owner)
}

const isAtacked = factory => {
	return getIncomingCyborgs(factory, getMirror(factory.owner))
}

const isDefended = factory => {
	return getIncomingCyborgs(factory, factory.owner)
}

// ****************************** END TOOLS *******************************//

// ************************ BOMBS ************************** //

const isNewEnemyBombComing = world => {
	return (
		isEnemyBombComing(world) &&
		world.bombs.filter(
			b =>
				b.owner == ENEMY &&
				!world.identifiedBombs.some(bomb => bomb.id == b.id),
		).length
	)
}

const isEnemyBombComing = world => {
	return world.bombs.filter(b => b.owner == ENEMY).length
}

const isEnemyBombComingTo = (world, factory) => {
	return world.identifiedBombs.filter(
		b => b.owner == ENEMY && b.destination == factory.id,
	).length
}

const getBombTargets = world => {
	let bombTargets = (production, owner) => {
		let factories = world.factories.filter(
			f =>
				f.owner === owner &&
				f.production === production &&
				f.makingIn < 2 &&
				f.incomingBombs.length === 0 &&
				!world.bombTargets.some(t => t == f.id),
		)

		return factories.filter(f => {
			let t = getClosestFactory(f, world.myFactories)
			if (t) {
				return owner === NEUTRAL
					? willBeConqueredBy(world, f, ENEMY, t.distanceTo(f))
					: !willBeConqueredBy(world, f, ME, t.distanceTo(f))
			} else {
				return f
			}
		})
	}

	let result = bombTargets(3, NEUTRAL)
	if (!result.length) result = bombTargets(3, ENEMY)
	if (!result.length) result = bombTargets(2, NEUTRAL)
	if (!result.length) result = bombTargets(2, ENEMY)

	return result
}

// Calculate when bomb explodes if have only 1 factory
const identifyTargets = world => {
	let targets = []
	let factories = world.factories
	let bombs = world.bombs.filter(
		b =>
			b.owner == ENEMY && !world.identifiedBombs.some(bomb => bomb.id == b.id),
	)

	bombs.forEach(bomb => {
		let source = world.getFactory(bomb.source)

		factories = factories.filter(
			f =>
				source.id != f.id &&
				(f.owner == ME || f.owner == NEUTRAL) &&
				f.production > 1 &&
				f.incomingBombs.length == 0 &&
				f.makingIn < f.distanceTo(bomb.source) &&
				willBeConqueredBy(world, f, ME, world.maxDistance),
		)

		factories = factories.sort((a, b) => {
			return getBombTargetScore(source, b) - getBombTargetScore(source, a)
		})

		if (!factories.length && world.myFactories.length == 1)
			factories = world.myFactories

		if (factories.length) {
			let turn = world.turn + source.distanceTo(factories[0]) - 1

			let target = {
				factory: factories[0],
				turn: turn,
			}

			bomb.destination = factories[0].id
			bomb.remainingTurns = turn
			factories[0].incomingBombs.push(bomb)
			world.identifiedBombs.push({ ...bomb })
			targets.push(target)
			world.removeEnemyBomb()
		}
	})

	return targets
}

// ************************ END BOMBS ************************** //

// ************************ INCREASE ************************** //

const canIncrease = (world, factory) => {
	let turnsToLost = turnsToBeConqueredBy(world, ENEMY, factory)

	if (
		factory.cyborgs >= 10 &&
		(!turnsToLost || turnsToLost > 5) &&
		getHeat(world, factory) < 0.9
	) {
		return true
	} else {
		return false
	}
}

// ************************ END INCREASE ************************** //

// ********************** EXCEPTIONS ************************ //

const initBroadcast = (world, factory) => {
	const reducer = (accumulator, target) =>
		accumulator + target.production * factory.distanceTo(target)
	let moves = [],
		targets = [],
		enemyCyborgs =
			getAllCyborgsAlive(world, ENEMY) + world.enemyFactories.reduce(reducer, 0)

	if (factory.cyborgs > enemyCyborgs) {
		world.enemyFactories.forEach(target => {
			if (!target.incomingBombs.length) {
				targets.push(target)
			}
		})

		if (targets.length) {
			console.error(`**********************************`)
			console.error(`Factory ${factory.id} init BROADCAST`)

			targets.forEach(target => {
				let cyborgs = neededCyborgsToConquer(world, factory, target)
				cyborgs = factory.removeCyborgs(cyborgs)
				target.addTroop(0, ME, factory, cyborgs)
				moves.push(getMove(factory.id, target.id, cyborgs))
			})
			console.error(`**********************************`)
		}
	}

	return moves
}

// ********************* END EXCEPTIONS ********************** //

// ************************ SCORES ************************** //

const getBombTargetScore = (source, target) => {
	return (
		target.getValue() +
		target.cyborgs -
		target.makingIn +
		Math.pow(0.9, source.distanceTo(target)) * 100
	)
}

const getDefenseScore = (world, source, target) => {
	let turnsTo = source.turnsTo(target)
	let heat = getHeat(world, target)
	let value = target.getValue() + heat

	let closest = null
	let enemyNeighbors = getNeighborsOfType(target, ENEMY)
	if (enemyNeighbors.length) closest = getClosestFactory(target, enemyNeighbors)

	let incomingCyborgs = getIncomingCyborgs(target, ENEMY, turnsTo + 5)

	if (incomingCyborgs) incomingCyborgs += closest ? closest.cyborgs : 0

	return ((value / Math.pow(turnsTo, 2)) * incomingCyborgs) / 100
}

const getIncreaseScore = (world, target) => {
	let increseValue = world.turn < 3 ? 0.3 : 1.1
	return (
		increseValue /
		Math.pow(
			10,
			1.6 -
				(target.getNeighbors().filter(n => n.owner != ENEMY).length * 2) / 100,
		)
	)
}

const getNeutralScore = (world, source, target) => {
	let turnsTo = source.turnsTo(target)
	let heat = getHeat(world, target)
	let value = target.getValue() - heat

	return (
		value /
		(Math.pow(turnsTo, 1.7) *
			neededCyborgsToConquerNeutral(world, source, target))
	)
}

const getEnemyScore = (world, source, target) => {
	let turnsTo = source.turnsTo(target)
	let heat = getHeat(world, target)
	let value = target.getValue() - heat
	let multiplier = 1.9

	switch (world.numberOfFactories) {
		case 7:
			multiplier = 1.1
			break
		case 9:
			multiplier = 1.3
			break
		case 11:
			multiplier = 1.5
			break
		case 13:
			multiplier = 1.7
			break
		case 15:
			multiplier = 1.9
			break
		default:
			break
	}

	return value / (Math.pow(turnsTo, multiplier) * (5 + target.cyborgs))
}

const getHeat = (world, factory) => {
	const reducer = (accumulator, obj) => accumulator + obj.cyborgs

	let cyborgs = factory
		.getNeighbors()
		.map(n => world.getFactory(n))
		.filter(
			f => f.owner == ENEMY || (f.owner == NEUTRAL && isAtackedBy(f, ENEMY)),
		)
		.reduce(reducer, 0)

	return Math.pow(cyborgs, 0.1) / 10
}

// ************************ END SCORES ***************************** //

export default {
	factories: {
		getFactories,
		getClosestFactory,
		getFarthestFactory,
		getFutureClosestFactory,
		getNeighborsOfType,
		canIncrease,
	},
	moves: {
		getBomb,
		getIncrement,
		getMove,
	},
	production: {
		getProductionMessage,
		getProduction,
	},
	cyborgs: {
		getAllCyborgsAlive,
		getIncomingCyborgs,
		neededCyborgsToConquer,
	},
	ownership: {
		willBeConqueredBy,
		turnsToBeConqueredBy,
	},
	tools: {
		getMirror,
		isAtackedBy,
		isAtacked,
		isDefended,
	},
	bombs: {
		isNewEnemyBombComing,
		isEnemyBombComing,
		isEnemyBombComingTo,
		getBombTargets,
		identifyTargets,
	},
	exceptions: {
		initBroadcast,
	},
	scores: {
		getDefenseScore,
		getIncreaseScore,
		getNeutralScore,
		getEnemyScore,
	},
	reports: {
		printBombReport,
	},
}
