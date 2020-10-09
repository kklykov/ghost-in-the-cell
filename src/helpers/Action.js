class Action {
	constructor(type, target, score, cyborgs) {
		this.type = type
		this.target = target
		this.score = score
		this.cyborgs = cyborgs
		this.completed = false
	}

	getType() {
		return this.type
	}

	getTarget() {
		return this.target
	}

	getScore() {
		return this.score
	}

	getCyborgs() {
		return this.cyborgs
	}

	toString() {
		return `${this.type} | ${this.target} | ${this.score} | ${this.cyborgs}`
	}
}

export default Action
