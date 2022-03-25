export let sanitizeFileNames = (files: any) => {
	let fileNames = files.map((a: any) => a.name)

	let trimmedFileNames = fileNames.map((file: any) => {
		let optimizedFileName: any = {}
		file = file.replace("ic_fluent_", "")
		file = file.replace(".svg", "")

		if (file.includes("regular")) optimizedFileName.style = "regular"
		if (file.includes("filled")) optimizedFileName.style = "filled"

		file = file.replace("_regular", "")
		file = file.replace("_filled", "")

		if (file.match(/\d+/))
			optimizedFileName.size = parseInt(file.match(/\d+/)[0])

		file = file.replace(/[0-9]/g, "")
		file = file.replace(/_/g, " ")
		file = file.trim()

		optimizedFileName.name = file

		file = file.replace(/_/g, " ")

		return optimizedFileName
	})

	return trimmedFileNames
}

export let convertToTree = (
	trimmedFileNames: any[],
	fileLocations: any[]
): any => {
	let finalReturnedObj: any = {}

	trimmedFileNames.map((tfilename: any, index) => {
		if (finalReturnedObj[tfilename.name]) {
			if (finalReturnedObj[tfilename.name][tfilename.size]) {
				finalReturnedObj[tfilename.name][tfilename.size].push({
					style: tfilename.style,
					urlPath: fileLocations[index],
				})
			} else {
				finalReturnedObj[tfilename.name][tfilename.size] = [
					{ style: tfilename.style, urlPath: fileLocations[index] },
				]
			}
		} else {
			finalReturnedObj[tfilename.name] = {}
			finalReturnedObj[tfilename.name][tfilename.size] = [
				{ style: tfilename.style, urlPath: fileLocations[index] },
			]
		}
		return 0
	})
	return finalReturnedObj
}

export let addNewUpdated = (
	trimmedFileNames: any[],
	fileLocations: any[]
): any => {
	let finalReturnedObj: any = {}

	trimmedFileNames.map((tfilename: any, index) => {
		if (tfilename.status === "new") {
			let newName = tfilename.name + "_new"
			if (finalReturnedObj[newName]) {
				if (finalReturnedObj[newName][tfilename.size]) {
					finalReturnedObj[newName][tfilename.size].push({
						style: tfilename.style,
						urlPath: fileLocations[index],
					})
				} else {
					finalReturnedObj[newName][tfilename.size] = [
						{
							style: tfilename.style,
							urlPath: fileLocations[index],
						},
					]
				}
			} else {
				finalReturnedObj[newName] = {}
				finalReturnedObj[newName][tfilename.size] = [
					{ style: tfilename.style, urlPath: fileLocations[index] },
				]
			}
		} else {
			if (finalReturnedObj[tfilename.name]) {
				if (finalReturnedObj[tfilename.name][tfilename.size]) {
					finalReturnedObj[tfilename.name][tfilename.size].push({
						style: tfilename.style,
						urlPath: fileLocations[index],
						component: tfilename.component,
					})
				} else {
					finalReturnedObj[tfilename.name][tfilename.size] = [
						{
							style: tfilename.style,
							urlPath: fileLocations[index],
							component: tfilename.component,
						},
					]
				}
			} else {
				finalReturnedObj[tfilename.name] = {}
				finalReturnedObj[tfilename.name][tfilename.size] = [
					{
						style: tfilename.style,
						urlPath: fileLocations[index],
						component: tfilename.component,
					},
				]
			}
		}

		return 0
	})
	return finalReturnedObj
}
