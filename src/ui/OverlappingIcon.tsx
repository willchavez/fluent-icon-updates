import "./OverlappingIcon.css"
export interface OverlappingIconProps {
	current: any
	previous: any
}

export const OverlappingIcon = (props: OverlappingIconProps) => {
	return (
		<div className="overlappingIconContainer">
			<div>
				<img
					src={props.previous.element}
					alt={props.previous.altText}
					style={{ width: "50px", height: "50px" }}
				/>
			</div>
			<div style={{ transform: "translateY(-100%)" }}>
				<img
					src={props.current.element}
					alt={props.current.altText}
					style={{ width: "50px", height: "50px" }}
				/>
			</div>
		</div>
	)
}
