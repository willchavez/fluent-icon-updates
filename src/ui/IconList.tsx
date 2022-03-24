import * as React from "react"
import { Icon } from "./Icon"
import { OverlappingIcon } from "./OverlappingIcon"
import "./IconList.css"
import {
	fetchAssetsUrl,
	fetchIconNames,
	fetchRepoCommits,
} from "../api/fetchicons"
import { sanitizeFileNames } from "../util/helpers"

export interface IconListProps {
	fileList: any[]
	files: any
}

export const IconList = (props: IconListProps) => {
	let sanitizedFilesNames = sanitizeFileNames(props.files)
	let [previousSVGs, setPreviousSVGs]: any[] = React.useState([])

	React.useEffect(() => {
		async function fetchMyAPI() {
			let data = await fetchRepoCommits(sanitizedFilesNames)

			let d2 = await fetchAssetsUrl(data)
			let d3 = await fetchIconNames(d2?.sha)
			setPreviousSVGs(d3)
		}

		fetchMyAPI()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.files])

	let gridHeader = () => {
		return (
			<div className="row headerRow">
				<div className="col">Name</div>
				<div className="col">Icon</div>
				<div className="col">Regular/Filled Icons Overlapped</div>
				<div className="col">Published Icon in Github</div>
				<div className="col">Published/Current Icon Overlapped</div>
			</div>
		)
	}
	return (
		<div className="container">
			{props.files.length > 0 && gridHeader()}
			{props.fileList.map((el: any, index: number) => {
				let labelBoolean: boolean =
					index > 0 &&
					sanitizedFilesNames[index].name ===
						sanitizedFilesNames[index - 1].name &&
					sanitizedFilesNames[index].size ===
						sanitizedFilesNames[index - 1].size

				let iconName = (
					<div className="iconLabel">
						{sanitizedFilesNames[index].name}{" "}
						{sanitizedFilesNames[index].size}{" "}
						{sanitizedFilesNames[index].style}
					</div>
				)

				let current = {
					element: el,
					altText: props.files[index],
				}
				let previous = {
					element: props.fileList[index + 1],
					altText: props.files[index + 1],
				}

				if (labelBoolean) {
					previous = {
						element: props.fileList[index - 1],
						altText: props.files[index - 1],
					}
				}

				return (
					<div className="row flex-grow-1">
						<div className="col nameLabel">{iconName}</div>
						<div className="col">
							<Icon element={el} altText={props.files[index]} />
						</div>
						<div className="col">
							<OverlappingIcon
								current={current}
								previous={previous}
							/>
						</div>
						<div className="col">
							{previousSVGs.length > 0 && previousSVGs[index] ? (
								<div
									className="previousICON"
									dangerouslySetInnerHTML={{
										__html: previousSVGs[index],
									}}
								/>
							) : (
								<div>new</div>
							)}
						</div>
						<div className="col prevCurrentComparison">
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
						</div>
					</div>
				)
			})}
		</div>
	)
}
