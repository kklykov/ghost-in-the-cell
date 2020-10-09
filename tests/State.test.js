import World from '../src/World'
import { ENEMY, ME, NEUTRAL } from '../src/common/Constants'
import _ from '../src/common/Utils'

const numberOfFactories = 11

const world = new World(numberOfFactories)

let map = [
	[0, 1, 8],
	[0, 2, 8],
	[0, 3, 2],
	[0, 4, 2],
	[0, 5, 7],
	[0, 6, 7],
	[0, 7, 4],
	[0, 8, 4],
	[0, 9, 1],
	[0, 10, 1],
	[1, 2, 17],
	[1, 3, 5],
	[1, 4, 11],
	[1, 5, 2],
	[1, 6, 16],
	[1, 7, 4],
	[1, 8, 13],
	[1, 9, 8],
	[1, 10, 8],
	[2, 3, 11],
	[2, 4, 5],
	[2, 5, 16],
	[2, 6, 2],
	[2, 7, 13],
	[2, 8, 4],
	[2, 9, 8],
	[2, 10, 8],
	[3, 4, 6],
	[3, 5, 6],
	[3, 6, 9],
	[3, 7, 4],
	[3, 8, 6],
	[3, 9, 4],
	[3, 10, 2],
	[4, 5, 9],
	[4, 6, 6],
	[4, 7, 6],
	[4, 8, 4],
	[4, 9, 2],
	[4, 10, 4],
	[5, 6, 15],
	[5, 7, 2],
	[5, 8, 12],
	[5, 9, 6],
	[5, 10, 8],
	[6, 7, 12],
	[6, 8, 2],
	[6, 9, 8],
	[6, 10, 6],
	[7, 8, 9],
	[7, 9, 3],
	[7, 10, 6],
	[8, 9, 6],
	[8, 10, 3],
	[9, 10, 4],
]

for (var i = 0; i < map.length; i++) {
	const data = map[i].map(Number)

	world.factories[data[0]].distances.set(data[1], data[2])
	world.factories[data[1]].distances.set(data[0], data[2])

	if (data[2] < world.minDistance) world.minDistance = data[2]
	if (data[2] > world.maxDistance) world.maxDistance = data[2]
}

world.initFloydWarshall()
world.calculatePaths()

const round = (inputs, prevTurn) => {
	world.turn = prevTurn
	world.resetAndIncrementTurn()

	for (var i = 0; i < inputs.length; i++) {
		const data = inputs[i].map((val, i) => (i !== 1 ? parseInt(val) : val)) // Parses all inputs except entityType

		switch (data[1]) {
			case 'FACTORY':
				world.factories[data[0]].update(data[2], data[3], data[4], data[5])
				break
			case 'TROOP':
				world.addTroop(data[0], data[2], data[3], data[4], data[5], data[6])
				break
			case 'BOMB':
				world.addBomb(data[0], data[2], data[3], data[4], data[5])
				break
			default:
				console.error('Unknown entity: ' + data[1])
		}
	}

	world.checkBombsLanded()
	world.simulateStates()
}

let turn1 = [
	[0, 'FACTORY', 0, 0, 0, 0, 0],
	[1, 'FACTORY', 1, 15, 1, 0, 0],
	[2, 'FACTORY', -1, 15, 1, 0, 0],
	[3, 'FACTORY', 0, 0, 2, 0, 0],
	[4, 'FACTORY', 0, 0, 2, 0, 0],
	[5, 'FACTORY', 0, 8, 3, 0, 0],
	[6, 'FACTORY', 0, 8, 3, 0, 0],
	[7, 'FACTORY', 1, 0, 0, 0, 0],
	[8, 'FACTORY', -1, 0, 0, 0, 0],
	[9, 'FACTORY', 0, 15, 3, 0, 0],
	[10, 'FACTORY', 0, 15, 3, 0, 0],
]

let turn2 = [
	[0, 'FACTORY', 0, 0, 0, 0, 0],
	[1, 'FACTORY', 1, 2, 1, 0, 0],
	[2, 'FACTORY', -1, 1, 1, 0, 0],
	[3, 'FACTORY', 0, 0, 2, 0, 0],
	[4, 'FACTORY', 0, 0, 2, 0, 0],
	[5, 'FACTORY', 0, 8, 3, 0, 0],
	[6, 'FACTORY', 0, 8, 3, 0, 0],
	[7, 'FACTORY', 0, 0, 0, 0, 0],
	[8, 'FACTORY', 0, 0, 0, 0, 0],
	[9, 'FACTORY', 0, 15, 3, 0, 0],
	[10, 'FACTORY', 0, 15, 3, 0, 0],
	[11, 'TROOP', 1, 1, 3, 4, 5],
	[12, 'TROOP', 1, 1, 5, 9, 2],
	[14, 'TROOP', 1, 1, 7, 1, 4],
	[15, 'TROOP', -1, 2, 6, 9, 2],
	[16, 'TROOP', -1, 2, 4, 4, 5],
	[17, 'TROOP', -1, 2, 8, 2, 4],
]

let turn3 = [
	[0, 'FACTORY', 0, 0, 0, 0, 0],
	[1, 'FACTORY', 1, 1, 1, 0, 0],
	[2, 'FACTORY', -1, 1, 1, 0, 0],
	[3, 'FACTORY', 0, 0, 2, 0, 0],
	[4, 'FACTORY', 0, 0, 2, 0, 0],
	[5, 'FACTORY', 0, 8, 3, 0, 0],
	[6, 'FACTORY', 0, 8, 3, 0, 0],
	[7, 'FACTORY', 0, 0, 0, 0, 0],
	[8, 'FACTORY', 0, 0, 0, 0, 0],
	[9, 'FACTORY', 0, 15, 3, 0, 0],
	[10, 'FACTORY', 0, 15, 3, 0, 0],
	[11, 'TROOP', 1, 1, 3, 4, 4],
	[12, 'TROOP', 1, 1, 5, 9, 1],
	[14, 'TROOP', 1, 1, 7, 1, 3],
	[15, 'TROOP', -1, 2, 6, 9, 1],
	[16, 'TROOP', -1, 2, 4, 4, 4],
	[17, 'TROOP', -1, 2, 8, 2, 3],
	[20, 'TROOP', 1, 1, 5, 2, 2],
	[23, 'TROOP', -1, 2, 4, 1, 5],
	[21, 'BOMB', -1, 2, -1, -1, 0],
	[22, 'BOMB', -1, 2, -1, -1, 0],
]

describe('World game state - production test', () => {
	beforeAll(() => {
		round(turn1, 0)
	})

	test('should give me the exact cyborgs by turn', () => {
		let state = world.getStateInTurn(1)
		// console.log(state)
		expect(world.factories[1].cyborgs).toEqual(15)
		expect(world.turn).toEqual(1)

		expect(state.factories[1].cyborgs).toEqual(15)
		expect(state.turn).toEqual(1)

		state = world.getStateInTurn(2)

		expect(state.factories[1].cyborgs).toEqual(16)
		expect(state.turn).toEqual(2)

		let factory = world.getFactoryStateInTurn(1, 1)
		expect(factory.cyborgs).toEqual(15)

		factory = world.getFactoryStateInTurn(1, 2)
		expect(factory.cyborgs).toEqual(16)

		factory = world.getFactoryStateInTurn(1, 10)
		expect(factory.cyborgs).toEqual(24)

		factory = world.getFactoryStateInTurn(5, 10)
		expect(factory.cyborgs).toEqual(8)
	})
})

describe('World game state - battle test - neutral field', () => {
	beforeAll(() => {
		round(turn2, 1)
	})

	test('should give me the exact state of factory in x turn', () => {
		expect(world.turn).toEqual(2)

		let factory = world.getFactoryStateInTurn(5, 2)
		expect(factory.cyborgs).toEqual(8)
		expect(factory.owner).toEqual(0)

		factory = world.getFactoryStateInTurn(5, 3)
		expect(factory.cyborgs).toEqual(8)
		expect(factory.owner).toEqual(0)

		factory = world.getFactoryStateInTurn(5, 4)
		expect(factory.cyborgs).toEqual(1)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 5)
		expect(factory.cyborgs).toEqual(4)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 6)
		expect(factory.cyborgs).toEqual(7)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 7)
		expect(factory.cyborgs).toEqual(10)
		expect(factory.owner).toEqual(1)
	})
})

describe('World game state - battle test - adding support', () => {
	beforeAll(() => {
		round(turn3, 2)
	})

	test('should give me the exact state of factory in x turn', () => {
		expect(world.turn).toEqual(3)

		let factory = world.getFactoryStateInTurn(5, 2)
		expect(factory.cyborgs).toEqual(8)
		expect(factory.owner).toEqual(0)

		factory = world.getFactoryStateInTurn(5, 3)
		expect(factory.cyborgs).toEqual(8)
		expect(factory.owner).toEqual(0)

		factory = world.getFactoryStateInTurn(5, 4)
		expect(factory.cyborgs).toEqual(1)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 5)
		expect(factory.cyborgs).toEqual(6)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 6)
		expect(factory.cyborgs).toEqual(9)
		expect(factory.owner).toEqual(1)

		factory = world.getFactoryStateInTurn(5, 7)
		expect(factory.cyborgs).toEqual(12)
		expect(factory.owner).toEqual(1)
	})
})
