import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

const octokit = new Octokit({
	auth: process.env.REACT_APP_PERSONAL_ACCESS_TOKEN,
})


const tryRequire = async (componentName: string) => {
	try {
		const mod = await import(`@fluentui/svg-icons/icons/${componentName}.svg`);
		return { module: mod.default, name: componentName }
	} catch (err) {
		return null
	}
}

let findSVGsInReactPackage = async (sanitizedFilesNames: any[]) => {
	let resultArr: any[] = []
	sanitizedFilesNames.map(async (file) => {
		let capitalizeName = () => {
			let nameArr = file.name.split(" ")
			for (var i = 0; i < nameArr.length; i++) {
				if (nameArr[i].match(/\d+/)) {
					nameArr[i] = nameArr[i].toUpperCase()
				} else {
					nameArr[i] =
						nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1)
				}
			}
			return nameArr.join("")
		}

		let capitalizedName = capitalizeName()

		let capitalizedStyle =
			file.style.charAt(0).toUpperCase() + file.style.slice(1)
		let reactComponentName = capitalizedName + file.size + capitalizedStyle
		resultArr.push(tryRequire(reactComponentName))
		return undefined
	})
	resultArr = await Promise.all(resultArr)
	return resultArr
}

let findSVGsInSVGPackage = async (sanitizedFilesNames: any[]) => {
	let resultArr: any[] = []
	sanitizedFilesNames.map(async (file) => {
		let name = file.name.trim().replaceAll(" ", '_') + "_" + file.size + "_" + file.style.trim()
		resultArr.push(tryRequire(name))
		return undefined
	})
	resultArr = await Promise.all(resultArr)
	return resultArr
}

export {
	findSVGsInReactPackage,
	findSVGsInSVGPackage
}
