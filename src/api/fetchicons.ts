import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';

const octokit = new Octokit();

async function CompareCommits(fromCommit: string, toCommit: string) {
	const response = await octokit.request(
		'GET /repos/{owner}/{repo}/compare/{basehead}',
		{
			accept: 'application/vnd.github.diff',
			owner: 'microsoft',
			repo: 'fluentui-system-icons',
			basehead: `${fromCommit.slice(0, 7)}...${toCommit.slice(0, 7)}`,
		}
	);
	return response;
}

async function RecentCommits(branchName: string) {
	const response = await octokit.request(
		`GET /repos/{owner}/{repo}/commits`,
		{
			owner: 'microsoft',
			repo: 'fluentui-system-icons',
			per_page: 20,
			sha: branchName,
		}
	);
	// console.log(response);
	return response;
}

async function GetBranches() {
	const response = await octokit.request(
		`GET /repos/{owner}/{repo}/branches`,
		{ owner: 'microsoft', repo: 'fluentui-system-icons' }
	);
	return response;
}

const tryRequire = async (componentName: string) => {
	try {
		let module: any = await import('@fluentui/react-icons');
		if (module[componentName]) {
			return { module: module[componentName], name: componentName };
		}
	} catch (err) {
		return null;
	}
};

let findSVGsInReactPackage = async (sanitizedFilesNames: any[]) => {
	let resultArr: any[] = [];
	sanitizedFilesNames.map(async (file) => {
		let capitalizeName = () => {
			let nameArr = file.name.split(' ');
			for (var i = 0; i < nameArr.length; i++) {
				if (nameArr[i].match(/\d+/)) {
					nameArr[i] = nameArr[i].toUpperCase();
				} else {
					nameArr[i] =
						nameArr[i].charAt(0).toUpperCase() +
						nameArr[i].slice(1);
				}
			}
			return nameArr.join('');
		};

		let capitalizedName = capitalizeName();

		let capitalizedStyle =
			file.style.charAt(0).toUpperCase() + file.style.slice(1);
		let reactComponentName = capitalizedName + file.size + capitalizedStyle;
		resultArr.push(tryRequire(reactComponentName));
		return undefined;
	});
	resultArr = await Promise.all(resultArr);
	return resultArr;
};

let gatherTopLevelShaForUpdatedIcons = async (
	iconNames: string[],
	tree: any[],
	sanitizedFilesNames: any[]
) => {
	let searchingFor = [
		{ name: 'History', size: 16, style: 'Regular' },
		{ name: 'History', size: 16, style: 'Filled' },
		{ name: 'People Team', size: 20, style: 'Regular' },
	];

	searchingFor = sanitizedFilesNames;

	let resultArr: any[] = [];

	searchingFor.map((icon) => {
		let data = tree.find((x) => x.path.toLowerCase() === icon) || null;
		if (data) resultArr.push(data);
		return undefined;
	});

	let svgFolder: any[] = await Promise.all(
		resultArr.map((result) => fetchSVGFolders(result.sha))
	);

	let svgDATA: any[] = [];

	searchingFor.map((icon: any, index: number) => {
		let svgData = svgFolder[index].find(
			(svgFolderData: any) =>
				svgFolderData?.path.includes(icon.size) &&
				svgFolderData?.path.includes(icon.style.toLowerCase())
		);
		svgDATA.push(svgData);
		return undefined;
	});

	let finalSVGCode = await Promise.all(
		svgDATA.map((svgDATAITEM) => {
			if (svgDATAITEM) return fetchSVGCODE(svgDATAITEM.sha);
			return undefined;
		})
	);

	finalSVGCode = finalSVGCode.map((code) => {
		if (code) return Base64.decode(code);
		return undefined;
	});

	return finalSVGCode;
};

let fetchSVGCODE = async (sha: string) => {
	if (!sha) return;
	let result = await octokit
		.request('GET /repos/{owner}/{repo}/git/blobs/{tree_sha}', {
			owner: 'microsoft',
			repo: 'fluentui-system-icons',
			tree_sha: sha,
		})
		.then(async (res: any) => {
			return res.data.content;
		});
	return result;
};

let getBothVersionsOfFile = async (
	from: string,
	to: string,
	filePath: string
) => {
	if (!from || !to) return;
	let result = await Promise.all([
		await octokit.request(
			'GET /repos/{owner}/{repo}/contents/{file_path}?ref={sha}',
			{
				owner: 'microsoft',
				repo: 'fluentui-system-icons',
				file_path: filePath,
				sha: from,
			}
		),
		await octokit.request(
			'GET /repos/{owner}/{repo}/contents/{file_path}?ref={sha}',
			{
				owner: 'microsoft',
				repo: 'fluentui-system-icons',
				file_path: filePath,
				sha: to,
			}
		),
	]);
	return result;
};

let fetchSVGCODE2 = async (sha: string) => {
	if (!sha) return;
	let result = await octokit.request(
		'GET /repos/{owner}/{repo}/git/blobs/{tree_sha}',
		{
			owner: 'microsoft',
			repo: 'fluentui-system-icons',
			tree_sha: sha,
		}
	);

	return result;
};

let fetchSVGFolders = async (sha: string) => {
	async function getSVGFolder(sha: string | null) {
		if (!sha) return;

		let result = await octokit
			.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
				owner: 'microsoft',
				repo: 'fluentui-system-icons',
				tree_sha: sha,
			})
			.then((res) => {
				return res.data.tree;
			});
		return result;
	}

	if (!sha) return;
	let result = await octokit
		.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
			owner: 'microsoft',
			repo: 'fluentui-system-icons',
			tree_sha: sha,
		})
		.then(async (res) => {
			let data = res.data.tree.find((x) => x.path === 'SVG');
			let svgFolder = await getSVGFolder(data?.sha || null);
			return svgFolder;
		});
	return result;
};

export {
	gatherTopLevelShaForUpdatedIcons,
	findSVGsInReactPackage,
	CompareCommits,
	RecentCommits,
	GetBranches,
	fetchSVGCODE,
	fetchSVGCODE2,
	getBothVersionsOfFile,
};
