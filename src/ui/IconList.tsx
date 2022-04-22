import * as React from "react"
import { Icon } from "./Icon"
import "./IconList.css"
import { findSVGsInReactPackage } from "../api/fetchicons"
import { addNewUpdated, sanitizeFileNames } from "../util/helpers"

export interface IconListProps {
	fileList: any[]
	files: any
}

export const IconList = (props: IconListProps) => {
	let changedFileNames = sanitizeFileNames(props.files)
	let [fileNameTree, setFileNameTree]: any[] = React.useState({})

	React.useEffect(() => {
		async function fetchMyAPI() {
			let data = await findSVGsInReactPackage(changedFileNames)

			for (var i = 0; i < data.length; i++) {
				if (data[i]) {
					changedFileNames[i].status = "updated"
					changedFileNames[i].component = data[i].module
					changedFileNames[i].reactComponentName = data[i].name
				} else {
					changedFileNames[i].status = "new"
				}
			}
			setFileNameTree(addNewUpdated(changedFileNames, props.fileList))
			// setPreviousSVGs(data)
		}

		fetchMyAPI()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(props.fileList)])

	let gridHeader = () => {
		return (
			<div className="row headerRow">
				{/* <div className="col">Name</div>
				<div className="col">Icon</div>
				<div className="col">Regular/Filled Icons Overlapped</div>
				<div className="col">Published Icon in Github</div>
				<div className="col">Published/Current Icon Overlapped</div> */}

				<div className="col">ICON NAME</div>
				<div className="col">SIZE</div>
				<div className="col">REGULAR</div>
				<div className="col">FILLED</div>
				<div className="col">DIFFERENCE</div>
				<div className="col"></div>
			</div>
		)
	}
	return (
		<div className="container main">
			{props.files.length > 0 && gridHeader()}

			{Object.keys(fileNameTree).map((iconName: any, index: number) => {
				if (
					iconName.includes("_new") ||
					iconName === "text direction horizontal left"
				)
					return
				console.log(iconName)
				let regularIcon = ""
				let filledIcon = ""

				let typesAndSizes: any[] = []
				let sizeKeys = Object.keys(fileNameTree[iconName])
				sizeKeys.map((size) => {
					typesAndSizes.push(...fileNameTree[iconName][size])
					return undefined
				})

				for (let i = typesAndSizes.length - 1; i >= 0; i--) {
					if (typesAndSizes[i].style === "regular" && !regularIcon) {
						regularIcon = typesAndSizes[i].urlPath
					}
					if (typesAndSizes[i].style === "filled" && !filledIcon)
						filledIcon = typesAndSizes[i].urlPath
				}

				let previousSVGRegular = <></>
				let previousSVGFilled = <></>

				let currentSVGRegular = ""

				let currentSVGFilled = ""

				if (
					!iconName.includes("_new") &&
					fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					].find((x: any) => x.style === "regular")
				) {
					previousSVGRegular = fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					]
						.find((x: any) => x.style === "regular")
						.component({ title: "idk" })

					currentSVGRegular = fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					].find((x: any) => x.style === "regular").urlPath
				}

				if (
					!iconName.includes("_new") &&
					fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					].find((x: any) => x.style === "filled")
				) {
					previousSVGFilled = fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					]
						.find((x: any) => x.style === "filled")
						.component({ title: "idk" })

					currentSVGFilled = fileNameTree[iconName][
						`${Object.keys(fileNameTree[iconName])[0]}`
					].find((x: any) => x.style === "filled").urlPath
				}

				return (
					<div className="row">
						<div className="col">
							{iconName.includes("_new") ? (
								<div className="newIcon">NEW</div>
							) : (
								<div className="updatedIcon">UPDATED</div>
							)}
							<div className="iconLabel">
								{iconName.includes("_new")
									? iconName.replace("_new", "")
									: iconName}
							</div>
						</div>
						<div className="col">
							{Object.keys(fileNameTree[iconName]).join(", ")}
						</div>
						<div className="col">
							{regularIcon ? (
								<Icon element={regularIcon} altText="" />
							) : (
								<div className="lineline"></div>
							)}
						</div>
						<div className="col">
							{filledIcon ? (
								<Icon element={filledIcon} altText="" />
							) : (
								<div className="lineline"></div>
							)}
						</div>

						<div className="col prevCurrentComparison">
							{!iconName.includes("new") && regularIcon ? (
								<div>
									<div>
										<Icon
											element={currentSVGRegular}
											altText=""
											isCompare={true}
										/>
									</div>
									<div className="previousICONCompare">
										{!iconName.includes("_new") ? (
											previousSVGRegular
										) : (
											<div></div>
										)}
									</div>
								</div>
							) : (
								<div className="lineline move"></div>
							)}
						</div>
						<div className="col prevCurrentComparison ">
							{!iconName.includes("new") && filledIcon ? (
								<div>
									<div>
										<Icon
											element={currentSVGFilled}
											altText=""
											isCompare={true}
										/>
									</div>
									<div className="previousICONCompare">
										{!iconName.includes("_new") ? (
											previousSVGFilled
										) : (
											<div></div>
										)}
									</div>
								</div>
							) : (
								<div className="lineline "></div>
							)}
						</div>
						{/* <div className="col prevCurrentComparison">
							{previousSVGs.length > 0 && previousSVGs[index] && (
								<>
									<div>
										<Icon
											element={el}
											altText={props.files[index]}
										/>
									</div>
									<div
										className="previousICONCompare"
										dangerouslySetInnerHTML={{
											__html: previousSVGs[index],
										}}
									/>
								</>
							)}
						</div> */}
					</div>
				)
				// let labelBoolean: boolean =
				// 	index > 0 &&
				// 	changedFileNames[index].name ===
				// 		 [index - 1].name &&
				// 	changedFileNames[index].size ===
				// 		changedFileNames[index - 1].size
				// let iconName = (
				// 	<div className="iconLabel">
				// 		{changedFileNames[index].name}{" "}
				// 		{changedFileNames[index].size}{" "}
				// 		{changedFileNames[index].style}
				// 	</div>
				// )
				// let current = {
				// 	element: el,
				// 	altText: props.files[index],
				// }
				// let previous = {
				// 	element: props.fileList[index + 1],
				// 	altText: props.files[index + 1],
				// }
				// if (labelBoolean) {
				// 	previous = {
				// 		element: props.fileList[index - 1],
				// 		altText: props.files[index - 1],
				// 	}
				// }
				// return (
				// 	<div className="row flex-grow-1">
				// 		<div className="col nameLabel">{iconName}</div>
				// 		<div className="col">
				// 			<Icon element={el} altText={props.files[index]} />
				// 		</div>
				// 		<div className="col">
				/* <OverlappingIcon
								current={current}
								previous={previous}
							/> */
				// 	</div>
				// 	<div className="col">
				// 		{previousSVGs.length > 0 && previousSVGs[index] ? (
				// 			<div
				// 				className="previousICON"
				// 				dangerouslySetInnerHTML={{
				// 					__html: previousSVGs[index],
				// 				}}
				// 			/>
				// 		) : (
				// 			<div>new</div>
				// 		)}
				// 	</div>
				// <div className="col prevCurrentComparison">
				// 	{previousSVGs.length > 0 && previousSVGs[index] && (
				// 		<>
				// 			<div>
				// 				<Icon
				// 					element={el}
				// 					altText={props.files[index]}
				// 				/>
				// 			</div>
				// 			<div
				// 				className="previousICONCompare"
				// 				dangerouslySetInnerHTML={{
				// 					__html: previousSVGs[index],
				// 				}}
				// 			/>
				// 		</>
				// 	)}
				// </div>
				// </div>
				// 	)
			})}
		</div>
	)
}
