export interface IconProps {
	element: any
	altText: any
}

export const Icon = (props: IconProps) => {
	return (
		<img
			src={props.element}
			alt={props.altText}
			style={{ width: "50px", height: "50px" }}
		/>
	)
}
