import Factory from '../src/entities/Factory'
import { ME } from '../src/common/Constants'

let cyborgs = 5
let production = 3
let turnsToNormal = 0
let factory = new Factory(1)
let source = new Factory(2)

describe('Troops and bombs testing', () => {
	beforeEach(() => {
		factory.update(ME, cyborgs, production, turnsToNormal)
		source.update(ME, cyborgs, production, turnsToNormal)
	})

	test('Add troop to factory', () => {
		factory.addTroop(0, ME, source, cyborgs)
		expect(factory.incomingTroops.length).toBe(1)
	})

	test('Add bomb to factory', () => {
		factory.addBomb(0, ME, source)
		expect(factory.incomingBombs.length).toBe(1)
	})
})

describe('Factory cyborgs testing', () => {
	beforeEach(() => {
		factory.update(ME, cyborgs, production, turnsToNormal)
	})

	test('Remove cyborgs from factory', () => {
		expect(factory.removeCyborgs(5)).toEqual(5)
		expect(factory.removeCyborgs(5)).toEqual(0)
	})

	test('Remove more cyborgs from factory than can', () => {
		expect(factory.removeCyborgs(50)).toBe(5)
	})

	test('Check cyborgs', () => {
		expect(factory.getCyborgsAvailable(0)).toBe(5)
		expect(factory.getCyborgsAvailable(20)).toBe(0)
	})

	test('Remove cyborgs for increment', () => {
		expect(factory.removeCyborgsForIncrement()).toBe(false)
	})

	test('Set cyborgs to ' + 10 + ' and remove cyborgs twice', () => {
		factory.cyborgs = 10
		expect(factory.cyborgs).toBe(10)
		expect(factory.removeCyborgsForIncrement()).toBe(true)
		expect(factory.removeCyborgsForIncrement()).toBe(false)
	})
})
