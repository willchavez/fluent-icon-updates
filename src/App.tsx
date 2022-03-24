import React from "react"
import "./App.css"
import { IconList } from "./ui/IconList"
import html2canvas from "html2canvas"

function App() {
	let [files, setFiles] = React.useState([])
	let [objectUrls, setObjectUrls] = React.useState([])

	let __addDirectory = (node: any) => {}

	let __onUploadhandler = (node: any) => {
		let localFiles = node.target.files

		let filteredFiles = [...localFiles].filter(
			(file: any) => file.name !== ".DS_Store"
		)
		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base",
		})

		let locaFilesArr: any = Object.values(filteredFiles).sort(
			(a: any, b: any) => {
				return collator.compare(a.name, b.name)
			}
		)
		setFiles(locaFilesArr)

		let localObjectUrls: any = []
		for (let i = 0; i < locaFilesArr.length; i++) {
			localObjectUrls.push(URL.createObjectURL(locaFilesArr[i]))
		}
		setObjectUrls(localObjectUrls)
	}

	return (
		<div className="App">
			<div id="app" style={{ paddingBottom: "1rem" }}>
				<header className="App-header">
					<h1 className="display-1">Fluent Icon Updates</h1>
				</header>

				{objectUrls.length > 0 && (
					<div style={{ paddingBottom: "2rem" }}>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								html2canvas(
									document.querySelector("#app") ||
										new HTMLElement()
								).then((canvas: any) => {
									var image = canvas
										.toDataURL("image/png")
										.replace(
											"image/png",
											"image/octet-stream"
										) // here is the most important part because if you dont replace you will get a DOM 18 exception.

									downloadImage(
										image,
										"fluent-updates-overview.jpeg"
									)

									function downloadImage(
										data: string,
										filename = "untitled.jpeg"
									) {
										var a = document.createElement("a")
										a.href = data
										a.download = filename
										document.body.appendChild(a)
										a.click()
									}
								})
							}}
						>
							Take a Screenshot
						</button>
					</div>
				)}

				<div>
					{objectUrls.length === 0 && (
						<>
							<p>Select your folder!</p>
							<input
								type="file"
								id="dcmFolderSelector"
								multiple
								/* @ts-expect-error */
								directory=""
								webkitdirectory=""
								ref={__addDirectory}
								onChange={__onUploadhandler}
								accept="image/svg"
							/>
						</>
					)}
					<IconList fileList={objectUrls} files={files} />{" "}
				</div>
			</div>
		</div>
	)
}

export default App
