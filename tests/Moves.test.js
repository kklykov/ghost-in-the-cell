import Moves from '../src/helpers/Moves'

const moves = new Moves()

describe('Moves basic operation test add', () => {
	beforeAll(() => {
		moves.addMove(1, 2, 10)
		moves.addMove(1, 2, 1)
		moves.addMove(2, 0, 1)
		moves.addMove(2, 0, 0)
		moves.addMove(3, 3, 0)

		moves.addIncrement(2)
		moves.addIncrement(1)
		moves.addIncrement(0)
		moves.addIncrement(0)
		moves.addIncrement(0)

		moves.addBomb(1, 2)
		moves.addBomb(2, 1)
		moves.addBomb(2, 2)
	})

	test('shoul add the exact amount of Moves', () => {
		expect(moves.moves.get('12').cyborgs).toEqual(11)
		expect(moves.moves.get('20').cyborgs).toEqual(1)
		expect(moves.moves.size).toBe(2)
	})

	test('should add the exact amount of Inc', () => {
		expect(moves.increments.get(2).getMove()).toEqual('INC 2')
		expect(moves.increments.size).toBe(3)
	})

	test('should add the exact amount of Bombs', () => {
		expect(moves.bombs.get('12').getMove()).toEqual('BOMB 1 2')
		expect(moves.bombs.get('21').getMove()).toEqual('BOMB 2 1')
		expect(moves.bombs.size).toBe(2)
	})

	test('should give me the exact amount of moves', () => {
		let m = moves.getMoves()
		expect(m.length).toEqual(7)
		expect(m).toEqual([
			'BOMB 1 2',
			'BOMB 2 1',
			'MOVE 1 2 11',
			'MOVE 2 0 1',
			'INC 2',
			'INC 1',
			'INC 0',
		])
		expect(moves.getMoves()).toEqual([])
	})
})
