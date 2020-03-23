import World from './World'
import Strategy from './Strategy'

class Bot {
	constructor() {
		this.world = null
		this.strategy = new Strategy()
	}

	run() {
		this.initGame()

		while (true) {
			this.runTurn()

			console.log(this.strategy.execute(this.world).join(';'))
		}
	}

	initGame() {
		this.world = new World(parseInt(readline()))

		for (let i = 0, iMax = parseInt(readline()); i < iMax; i++) {
			const data = readline()
				.split(' ')
				.map(Number)
			this.world.factories[data[0]].distances.set(data[1], data[2])
			this.world.factories[data[1]].distances.set(data[0], data[2])
		}
	}

	runTurn() {
		this.world.initRound()

		for (let i = 0, iMax = parseInt(readline()); i < iMax; i++) {
			const data = readline()
				.split(' ')
				.map((val, i) => (i !== 1 ? parseInt(val) : val)) // TODO check what is this

			switch (data[1]) {
				case 'FACTORY':
					this.world.factories[data[0]].update(
						data[2],
						data[3],
						data[4],
						data[5],
					)
					break
				case 'TROOP':
					this.world.addTroop(data[2], data[3], data[4], data[5], data[6])
					break
				case 'BOMB':
					this.world.addBomb(data[2], data[3], data[4], data[5])
					break
				default:
					console.error('Unknown entity: ' + data[1])
			}
		}
	}
}

export default Bot
