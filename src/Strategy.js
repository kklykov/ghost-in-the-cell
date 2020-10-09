import _ from './common/Utils'
import {
	MOVE,
	DEFEND,
	INCREASE,
	ESCAPE,
	BOMB,
	ENEMY,
	NEUTRAL,
	ME,
} from './common/Constants'
import Moves from './helpers/Moves'

class Strategy {
	constructor() {
		this.moves = new Moves()
	}

	execute(world) {
		if (world.bombsAvailable) this.sendBombs(world)
		return this.getActions(world)
	}

	sendBombs(world) {
		const sources = world.myFactories
		let targets = _.bombs.getBombTargets(world)

		if (sources.length && targets.length) {
			targets = targets.sort((f1, f2) => f2.getValue() - f1.getValue())
			targets.forEach((target) => {
				if (world.bombsAvailable) {
					let mySource = _.factories.getClosestFactory(target, sources)
					let source = _.factories.getFutureClosestFactory(
						world,
						target,
						world.factories,
						5,
					)
					let turn = 1

					if (
						source.owner != ME &&
						source.distanceTo(target) <= mySource.distanceTo(target)
					) {
						let turn =
							world.turn + _.ownership.turnsToBeConqueredBy(world, ME, source)
						source.addAction(turn, BOMB, target.id, 100)
					} else {
						let bomb = target.incomingBombs[0]

						if (
							!bomb ||
							bomb.remainingTurns + 4 < mySource.distanceTo(target) ||
							bomb.remainingTurns + 4 > mySource.distanceTo(target)
						) {
							mySource.addAction(world.turn, BOMB, target.id, 100)
						}
					}
					world.bombTargets[target.id] = target.id

					source.addAction(world.turn + turn, MOVE, target.id, 8, 1)
				}
			})
		}
	}

	getActions(world) {
		let actions = ['WAIT']

		if (_.bombs.isNewEnemyBombComing(world)) {
			let targets = _.bombs.identifyTargets(world)
			console.error('Get actions targets bombs:', targets.length)
			if (targets.length) {
				targets.forEach((data) => {
					console.error('Factory escape:', data.factory.id)
					console.error('turn escape:', data.turn)

					data.factory.addAction(data.turn, ESCAPE, null, 100)
				})
			}
		}

		world.myFactories.forEach((factory) => {
			if (factory.cyborgs) {
				let moves = _.exceptions.initBroadcast(world, factory)

				if (moves.length) {
					actions = [...actions, ...moves]
				} else {
					this.calculateActions(world, factory)
					this.executeActions(world, factory)
					actions = [...actions, ...this.moves.getMoves()]
				}
			}
		})

		return actions
	}

	calculateActions(world, factory) {
		let turn = world.turn
		world.factories.forEach((target) => {
			let score = 0
			let increaseScore = 0

			switch (target.owner) {
				case ENEMY:
					score = _.scores.getEnemyScore(world, factory, target)
					factory.addAction(turn, MOVE, target.id, score)
					break
				case NEUTRAL:
					score = _.ownership.willBeConqueredBy(
						world,
						target,
						ME,
						factory.distanceTo(target),
					)
						? 0
						: _.scores.getNeutralScore(world, factory, target)

					factory.addAction(turn, MOVE, target.id, score)
					break
				case ME:
					if (factory.id == target.id) {
						increaseScore = _.scores.getIncreaseScore(world, target)
						factory.addAction(turn, INCREASE, target.id, increaseScore)
					} else {
						score = _.scores.getDefenseScore(world, factory, target)
						factory.addAction(turn, DEFEND, target.id, score)
					}
					break
			}
		})
	}

	willBeConqueredInNextTurns(world, factory) {
		if (
			_.tools.isAtacked(factory) ||
			_.factories.getNeighborsOfType(factory, ENEMY).length
		) {
			world.simulateStates()
			return _.ownership.turnsToBeConqueredBy(world, ENEMY, factory)
		} else {
			return false
		}
	}

	executeActions(world, factory) {
		let actions = factory
			.getActions(world.turn)
			.sort((t1, t2) => t2.getScore() - t1.getScore())

		let cyborgsIncoming =
			_.cyborgs.getIncomingCyborgs(factory, ENEMY, 2) -
			_.cyborgs.getIncomingCyborgs(factory, ME, 1)

		let cyborgsAvailable = factory.getCyborgsAvailable(
			cyborgsIncoming < 0 ? 0 : cyborgsIncoming,
		)

		if (this.willBeConqueredInNextTurns(world, factory)) {
			cyborgsAvailable = 0
			return false
		}

		for (var index = 0; index < actions.length; ++index) {
			const action = actions[index]
			let target = world.getFactory(action.target)

			if (
				(!action.completed && cyborgsAvailable && factory.cyborgs) ||
				action.type == BOMB ||
				action.type == ESCAPE
			) {
				switch (action.type) {
					case MOVE:
					case DEFEND:
						let cyborgs = action.cyborgs
						let previous = target
						if (!cyborgs) {
							previous = world.getFactory(factory.pathTo(target).getPrevious())
							cyborgs = _.cyborgs.neededCyborgsToConquer(world, factory, target)
							let needed = cyborgs

							cyborgs = factory.removeCyborgs(
								cyborgsAvailable >= cyborgs ? cyborgs : cyborgsAvailable,
							)

							if (needed == cyborgs) {
								action.completed = true
							}
						}

						if (this.willBeConqueredInNextTurns(world, factory)) {
							cyborgsAvailable = 0
							factory.cyborgs += cyborgs
						} else {
							cyborgsAvailable -= cyborgs
							previous.addTroop(world.turn, ME, factory, cyborgs)
							this.moves.addMove(factory.id, previous.id, cyborgs)
						}

						break
					case INCREASE:
						if (factory.production == 3) {
							let t = world.factories
								.filter(
									(t) =>
										t.id !== factory.id && t.owner === ME && t.production < 3,
								)
								.sort(
									(f1, f2) => f1.distanceTo(factory) - f2.distanceTo(factory),
								)[0]

							if (t) {
								let cyborgs = factory.removeCyborgs(cyborgsAvailable)

								if (this.willBeConqueredInNextTurns(world, factory)) {
									cyborgsAvailable = 0
									factory.cyborgs += cyborgs
								} else {
									let previous = world.getFactory(
										factory.pathTo(t).getPrevious(),
									)
									this.moves.addMove(factory.id, previous.id, cyborgs)
									previous.addAction(
										world.turn + factory.turnsToConquer(previous),
										INCREASE,
										previous.id,
										8,
									)
								}
							}
							break
						}

						if (_.factories.canIncrease(world, factory)) {
							if (factory.removeCyborgsForIncrement()) {
								action.completed = true
								factory.wantIncrease = false
								if (factory.production != 2) cyborgsAvailable = 0
								this.moves.addIncrement(factory.id)
							}
							factory.wantIncrease = true
						} else {
							let cyborgsToRemove =
								10 -
								(_.cyborgs.getIncomingCyborgs(factory, ME, 1) +
									factory.production)

							if (cyborgsToRemove < 0) cyborgsToRemove = 0
							cyborgsAvailable -= cyborgsToRemove
							if (cyborgsAvailable < 0) cyborgsAvailable = 0
						}

						break
					case ESCAPE:
						if (world.enemyBombsExploded == 2) break
						target = _.factories.getClosestFactory(
							factory,
							world.factories.filter(
								(f) =>
									f.id !== factory.id &&
									(f.owner == ME || f.owner == NEUTRAL) &&
									(f.production > 0 || f.id == 0) &&
									f.incomingBombs.length == 0,
							),
						)
						if (target) {
							let cyborgs = factory.removeCyborgs(factory.cyborgs)
							action.completed = true
							target.addTroop(world.turn, ME, factory, cyborgs)
							this.moves.addMove(factory.id, target.id, cyborgs)
						}
						break
					case BOMB:
						let bomb = target.incomingBombs[0]
						if (
							!bomb ||
							(bomb.remainingTurns - 8 < factory.distanceTo(target) &&
								bomb.remainingTurns + 8 > factory.distanceTo(target))
						) {
							action.completed = true
							target.addBomb(world.turn, ME, factory)
							world.removeBomb()
							world.bombTargets[target.id] = null
							this.moves.addBomb(factory.id, target.id)
						}
						break
					default:
						break
				}
			} else {
				break
			}
		}

		return true
	}
}

export default Strategy
