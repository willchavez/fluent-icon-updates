import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"

const octokit = new Octokit({
	auth: process.env.PERSONAL_ACCESS_TOKEN,
})

let fileNames: any[]

let fetchRepoCommits = async (sanitizedFilesNames: any[]) => {
	fileNames = sanitizedFilesNames
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/branches/{branch}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			branch: "master",
		})
		.then((res) => res.data.commit.sha)
	return result
}

let fetchAssetsUrl = async (sha: string) => {
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			tree_sha: sha,
		})
		.then((res) => res.data.tree.find((x) => x.path === "assets") || null)
	return result
}

let fetchIconNames = async (sha: string | undefined) => {
	if (!sha) return
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			tree_sha: sha,
		})
		.then((res) => gatherTopLevelShaForUpdatedIcons([], res.data.tree))
	return result
}

let gatherTopLevelShaForUpdatedIcons = async (
	iconNames: string[],
	tree: any[]
) => {
	let searchingFor = [
		{ name: "History", size: 16, style: "Regular" },
		{ name: "History", size: 16, style: "Filled" },
		{ name: "People Team", size: 20, style: "Regular" },
	]

	searchingFor = fileNames
	let resultArr: any[] = []
	searchingFor.map((icon) => {
		let data = tree.find((x) => x.path.toLowerCase() === icon.name) || null
		if (data) resultArr.push(data)
		return undefined
	})

	let svgFolder: any[] = await Promise.all(
		resultArr.map((result) => fetchSVGFolders(result.sha))
	)

	let svgDATA: any[] = []

	searchingFor.map((icon: any, index: number) => {
		let svgData = svgFolder[index].find(
			(svgFolderData: any) =>
				svgFolderData?.path.includes(icon.size) &&
				svgFolderData?.path.includes(icon.style.toLowerCase())
		)
		svgDATA.push(svgData)
		return undefined
	})

	let finalSVGCode = await Promise.all(
		svgDATA.map((svgDATAITEM) => {
			if (svgDATAITEM) return fetchSVGCODE(svgDATAITEM.sha)
			return undefined
		})
	)

	finalSVGCode = finalSVGCode.map((code) => {
		if (code) return Base64.decode(code)
		return undefined
	})

	return finalSVGCode
}

let fetchSVGCODE = async (sha: string) => {
	if (!sha) return
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/git/blobs/{tree_sha}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			tree_sha: sha,
		})
		.then(async (res: any) => {
			return res.data.content
		})
	return result
}

let fetchSVGFolders = async (sha: string) => {
	async function getSVGFolder(sha: string | null) {
		if (!sha) return

		let result = await octokit
			.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
				owner: "microsoft",
				repo: "fluentui-system-icons",
				tree_sha: sha,
			})
			.then((res) => {
				return res.data.tree
			})
		return result
	}

	if (!sha) return
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			tree_sha: sha,
		})
		.then(async (res) => {
			let data = res.data.tree.find((x) => x.path === "SVG")
			let svgFolder = await getSVGFolder(data?.sha || null)
			return svgFolder
		})
	return result
}

let fetchOldHistoryIcon = async () => {
	let result = await octokit
		.request("GET /repos/{owner}/{repo}/git/blobs/{sha}", {
			owner: "microsoft",
			repo: "fluentui-system-icons",
			sha: "e7cdef061745bba483e50d3bace4ac04a7815cee",
		})
		.then((res) => {
			return res.data.content
		})

	var contents = Base64.decode(result)
	return contents
}

export { fetchIconNames, fetchOldHistoryIcon, fetchRepoCommits, fetchAssetsUrl }
