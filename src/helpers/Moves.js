class Moves {
	constructor() {
		this.moves = new Map()
		this.increments = new Map()
		this.bombs = new Map()
	}

	addMove(source, target, cyborgs) {
		if (!cyborgs || source === target) return false

		if (this.moves.has(source + '' + target)) {
			let obj = this.moves.get(source + '' + target)
			obj.cyborgs += cyborgs
			this.moves.set(source + '' + target, obj)
		} else {
			let obj = {
				source: source,
				target: target,
				cyborgs: cyborgs,
				getMove: function () {
					return `MOVE ${this.source} ${this.target} ${this.cyborgs}`
				},
			}
			this.moves.set(source + '' + target, obj)
		}
		return true
	}

	addIncrement(factory) {
		if (this.increments.has(factory)) return false
		let obj = {
			factory: factory,
			getMove: function () {
				return `INC ${this.factory}`
			},
		}
		this.increments.set(factory, obj)
		return true
	}

	addBomb(source, target) {
		if (source === target) return false

		let obj = {
			source: source,
			target: target,
			getMove: function () {
				return `BOMB ${this.source} ${this.target}`
			},
		}
		this.bombs.set(source + '' + target, obj)
		return true
	}

	getMoves() {
		let result = []
		for (var bomb of this.bombs.values()) {
			result.push(bomb.getMove())
		}
		this.bombs.clear()

		for (var move of this.moves.values()) {
			result.push(move.getMove())
		}
		this.moves.clear()

		for (var inc of this.increments.values()) {
			result.push(inc.getMove())
		}
		this.increments.clear()

		return result
	}
}

export default Moves
