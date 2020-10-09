class Bomb {
	constructor(id, owner, source, destination, remainingTurns) {
		this.id = id
		this.owner = owner
		this.source = source
		this.destination = destination
		this.remainingTurns = remainingTurns
	}

	getInfo() {
		console.error(
			`Id: ${this.id}
			Owner: ${this.owner}
			From: ${this.source}
			To: ${this.destination}
			Remaining turns: ${this.remainingTurns}`,
		)
	}
}

export default Bomb
