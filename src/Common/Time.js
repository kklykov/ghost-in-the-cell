class Time {
	constructor(logs = false, text = 'Timer') {
		this.text = text
		this.logs = logs
		this.timeStart = 0
		this.timeEnd = 0
	}

	start() {
		this.timeStart = new Date().getTime()
		this.log(`${this.text} - Start`)
	}

	stop() {
		this.timeEnd = new Date().getTime()
		var time = this.timeEnd - this.timeStart
		this.log(`${this.text} - End in ${time}ms`)
		return time
	}

	log(text = '') {
		if (this.logs) console.error(text)
	}
}

export default Time
