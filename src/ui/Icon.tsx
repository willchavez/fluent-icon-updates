export interface IconProps {
	element: any
	altText: any
	isCompare?: boolean
}

export const Icon = (props: IconProps) => {
	return (
		<img
			className={props.isCompare ? "isCompare" : "red"}
			src={props.element}
			alt={props.altText}
			style={{ width: "50px", height: "50px" }}
		/>
	)
}
