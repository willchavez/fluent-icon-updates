import * as React from 'react';
import './IconList.css';
import { convertToObject } from '../util/helpers';
import { Base64 } from 'js-base64';

export interface IconListProps {
	// fileList: any[]
	// files: any
	previousIcons: any[];
	currentIcons: any[];
}

export const IconList = (props: IconListProps) => {
	let [iconTree, setIconTree]: any = React.useState({});

	React.useEffect(() => {
		if (props.previousIcons.length > 1 && props.currentIcons.length > 1) {
			setIconTree(
				convertToObject(props.previousIcons, props.currentIcons)
			);
		}
	}, [props.previousIcons, props.currentIcons]);
	let gridHeader = () => {
		return (
			<div className='row headerRow'>
				<div className='col'>ICON NAME</div>
				<div className='col'>SIZE</div>
				<div className='col'>REGULAR</div>
				<div className='col'>FILLED</div>
				<div className='col'>DIFFERENCE</div>
				<div className='col'></div>
			</div>
		);
	};
	console.log('icontree');
	console.log(iconTree);
	return (
		<div className='container main' id='app'>
			{Object.keys(iconTree).length > 0 && gridHeader()}
			{/* {props.files.length > 0 && gridHeader()} */}

			{Object.keys(iconTree).map((name: any, index: number) => {
				let sizes = Object.keys(iconTree[name]);

				let regularCurrentIcon,
					filledCurrentIcon,
					regularPreviousIcon,
					filledPreviousIcon;
				if (sizes.length > 0) {
					let regularCurrent =
						iconTree[name][sizes[0]].regular?.current;
					let filledCurrent =
						iconTree[name][sizes[0]].filled?.current;
					let regularPrevious =
						iconTree[name][sizes[0]]?.regular?.previous;
					let filledPrevious =
						iconTree[name][sizes[0]]?.filled?.previous;

					if (regularCurrent) {
						regularCurrentIcon =
							Base64.decode(regularCurrent?.content) || null;
					}

					if (filledCurrent) {
						filledCurrentIcon =
							Base64.decode(filledCurrent?.content) || null;
					}

					if (regularPrevious) {
						regularPreviousIcon =
							Base64.decode(regularPrevious?.content) || null;
					}

					if (filledPrevious) {
						filledPreviousIcon =
							Base64.decode(filledPrevious?.content) || null;
					}
				}

				return (
					<div className='row'>
						<div className='col'>
							<div className='updatedIcon'>UPDATED</div>
							<div className='iconLabel'>{name}</div>
						</div>
						<div className='col'>{sizes.join(', ')}</div>
						<div
							className='col icon'
							dangerouslySetInnerHTML={{
								__html: regularCurrentIcon || '',
							}}
						></div>
						<div
							className='col icon'
							dangerouslySetInnerHTML={{
								__html: filledCurrentIcon || '',
							}}
						></div>
						<div className='col'>
							<div
								className='icon compare current'
								dangerouslySetInnerHTML={{
									__html: regularCurrentIcon || '',
								}}
							></div>

							<div
								className='icon compare previous'
								dangerouslySetInnerHTML={{
									__html: regularPreviousIcon || '',
								}}
							></div>
						</div>
						<div className='col'>
							<div
								className='icon compare current'
								dangerouslySetInnerHTML={{
									__html: filledCurrentIcon || '',
								}}
							></div>

							<div
								className='icon compare previous'
								dangerouslySetInnerHTML={{
									__html: filledPreviousIcon || '',
								}}
							></div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
