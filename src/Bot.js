import World from './World'
import Strategy from './Strategy'
import Time from './common/Time'
import _ from './common/Utils'

class Bot {
	constructor() {
		this.world = null
		this.strategy = new Strategy()
		this.time = new Time()
	}

	run() {
		this.init()
		this.world.init()

		while (true) {
			this.world.resetAndIncrementTurn()

			this.round()

			this.time.start() // Max time 50ms

			this.world.update()

			console.log(
				[
					...this.strategy.execute(this.world),
					...[
						`${_.production.getProductionMessage(
							this.world,
						)} - ${this.time.stop()} ms`,
					],
				].join(';'),
			)
		}
	}

	init() {
		this.world = new World(parseInt(readline()))

		for (let i = 0, iMax = parseInt(readline()); i < iMax; ++i) {
			const data = readline()
				.split(' ')
				.map(Number)
			const factoryA = data[0]
			const factoryB = data[1]
			const distance = data[2]

			this.world.factories[factoryA].distances.set(factoryB, distance)
			this.world.factories[factoryB].distances.set(factoryA, distance)

			if (distance < this.world.minDistance) this.world.minDistance = distance
			if (distance > this.world.maxDistance) this.world.maxDistance = distance
		}
	}

	round() {
		for (let i = 0, iMax = parseInt(readline()); i < iMax; ++i) {
			const data = readline()
				.split(' ')
				.map((val, i) => (i !== 1 ? parseInt(val) : val))

			const entityId = data[0]
			const entityType = data[1]
			const owner = data[2]
			const data3 = data[3]
			const data4 = data[4]
			const data5 = data[5]
			const data6 = data[6]

			switch (entityType) {
				case 'FACTORY':
					this.world.factories[entityId].update(owner, data3, data4, data5)
					break
				case 'TROOP':
					this.world.addTroop(entityId, owner, data3, data4, data5, data6)
					break
				case 'BOMB':
					this.world.addBomb(entityId, owner, data3, data4, data5)
					break
				default:
					break
			}
		}
	}
}

new Bot().run()

export default Bot
