class Troop {
	constructor(id, owner, source, destination, cyborgs, remainingTurns) {
		this.id = id
		this.owner = owner
		this.source = source
		this.destination = destination
		this.cyborgs = cyborgs
		this.remainingTurns = remainingTurns
	}

	getInfo() {
		console.error(
			`Id: ${this.id}
			Owner: ${this.owner}
			From: ${this.source}
			To: ${this.destination}
			Cyborgs: ${this.cyborgs}
			Remaining turns: ${this.remainingTurns}`,
		)
	}
}

export default Troop
