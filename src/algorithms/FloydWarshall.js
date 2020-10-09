export default function floydWarshall(factories) {
	const vertices = factories

	const nextVertices = Array(vertices.length)
		.fill(null)
		.map(() => {
			return Array(vertices.length).fill(null)
		})

	const distances = Array(vertices.length)
		.fill(null)
		.map(() => {
			return Array(vertices.length).fill(Infinity)
		})

	// Init distance matrix with the distance we already now (from existing edges).
	// And also init previous vertices from the edges.
	vertices.forEach((startVertex, startIndex) => {
		vertices.forEach((endVertex, endIndex) => {
			if (startVertex === endVertex) {
				// Distance to the vertex itself is 0.
				distances[startIndex][endIndex] = 0
			} else {
				// Find edge between the start and end vertices.
				const edge = startVertex.distanceTo(endIndex)

				if (edge) {
					// There is an edge from vertex with startIndex to vertex with endIndex.
					// Save distance and previous vertex.
					distances[startIndex][endIndex] = edge
					nextVertices[startIndex][endIndex] = startVertex.id
				}
			}
		})
	})

	vertices.forEach((middleVertex, middleIndex) => {
		// Path starts from startVertex with startIndex.
		vertices.forEach((startVertex, startIndex) => {
			// Path ends to endVertex with endIndex.
			vertices.forEach((endVertex, endIndex) => {
				const distViaMiddle =
					distances[startIndex][middleIndex] + distances[middleIndex][endIndex]

				if (distances[startIndex][endIndex] > distViaMiddle) {
					// We've found a shortest pass via middle vertex.
					distances[startIndex][endIndex] = distViaMiddle
					nextVertices[startIndex][endIndex] = middleVertex.id
				}
			})
		})
	})

	// Shortest distance from x to y: distance[x][y].
	// Next vertex after x one in path from x to y: nextVertices[x][y].
	return { distances: distances, nextVertices: nextVertices }
}
