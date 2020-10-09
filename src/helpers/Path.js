class Path {
	constructor(start, end) {
		this.start = start
		this.previous = start
		this.next = end
		this.end = end
		this.turnsToNext = 0
		this.turnsToEnd = 0
		this.nodes = []
	}

	print(path) {
		console.error('Start:', path.start)
		console.error('Previous:', path.previous)
		console.error('Next:', path.next)
		console.error('End:', path.end)
		console.error('Turns to next:', path.turnsToNext)
		console.error('Turns to end:', path.turnsToEnd)
		console.error('Nodes:', ...path.nodes)
	}

	getStart() {
		return this.start
	}

	setStart(start) {
		this.start = start
	}

	getPrevious() {
		return this.previous
	}

	setPrevious(previous) {
		this.previous = previous
	}

	getNext() {
		return this.next
	}

	setNext(next) {
		this.next = next
	}

	getEnd() {
		return this.end
	}

	setEnd(end) {
		this.end = end
	}

	getTurnsToNext() {
		return this.turnsToNext
	}

	setTurnsToNext(turnsToNext) {
		this.turnsToNext = turnsToNext
	}

	getTurnsToEnd() {
		return this.turnsToEnd
	}

	setTurnsToEnd(turnsToEnd) {
		this.turnsToEnd = turnsToEnd
	}

	addNode(node) {
		this.nodes.push(node)
	}

	getNodes() {
		return this.nodes
	}

	getNumberOfNodes() {
		return this.nodes.length
	}
}

export default Path
