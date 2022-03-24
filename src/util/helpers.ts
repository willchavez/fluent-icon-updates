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
