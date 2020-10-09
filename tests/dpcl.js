const clone = require('rfdc')({ proto: true })

let objectA = {
	one: 1,
}

let objectClone = clone(objectA)

objectA.one = 2

console.log(objectA)

console.log(objectClone)

class House {
	constructor() {
		this.parents = []
		this.childrens = []
	}

	addParent(id) {
		const parent = new Parent(id)
		this.parents[id] = parent
	}

	addChildren(parentId, id, age) {
		const children = new Children(id, age)
		this.parents[parentId].childrens.push(children)
		this.childrens.push(children)
	}
}

class Parent {
	constructor(id) {
		this.id = id
		this.age = null
		this.childrens = []
	}

	update(age) {
		this.age = age
	}
}

class Children {
	constructor(id, age) {
		this.id = id
		this.age = age
	}
}

const houseA = new House()
houseA.addParent(1)
houseA.parents[1].update(40)
houseA.addChildren(1, 1, 8)

const houseB = clone(houseA)

houseA.parents[1].age = 41
houseA.parents[1].childrens[0].age = 9

console.log(houseA.parents[1])
console.log(houseA.parents[1].childrens[0])
console.log(houseA.childrens[0])

console.log(houseB.parents[1])
console.log(houseB.parents[1].childrens[0])
console.log(houseB.childrens[0])

console.log('---------------')

houseB.childrens.forEach(children => (children.age = 19))

console.log(houseB.parents[1])
console.log(houseB.parents[1].childrens[0])
console.log(houseB.childrens[0])
