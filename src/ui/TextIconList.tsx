import * as React from 'react';
import { filenameRegex, numericalRegex } from '../util/helpers';
import './TextIconList.css';

export const TextIconList = (props: any) => {
	let normalizedAddedIcons = props.addedFiles?.map((addedFile: any) => {
		return {
			name: addedFile?.filename
				.replace('assets/', '')
				.match(filenameRegex)[0]
				.replaceAll('/', ''),
			size: addedFile?.filename.match(numericalRegex)[0],
			style: addedFile?.filename.includes('regular')
				? 'Regular'
				: 'Filled',
		};
	});
	console.log(normalizedAddedIcons);

	let addedIconTree: any = {};
	for (let addedIcon of normalizedAddedIcons) {
		if (addedIconTree[`${addedIcon.name}`]) {
			if (
				!addedIconTree[`${addedIcon.name}`].sizes.find(
					(size: number) => size === addedIcon.size
				)
			)
				addedIconTree[`${addedIcon.name}`].sizes.push(addedIcon.size);
			if (
				!addedIconTree[`${addedIcon.name}`].styles.find(
					(style: string) => style === addedIcon.style
				)
			)
				addedIconTree[`${addedIcon.name}`].styles.push(addedIcon.style);
		} else {
			addedIconTree[`${addedIcon.name}`] = {
				sizes: [addedIcon.size],
				styles: [addedIcon.style],
			};
		}
	}

	return (
		<div>
			{Object.keys(addedIconTree).length > 0 ? (
				<div>**{props.status} Icons**</div>
			) : (
				<div />
			)}
			{Object.keys(addedIconTree).map((name: string, index: number) => {
				return (
					<div>
						{name} / {addedIconTree[name].sizes.join(', ')} /{' '}
						{addedIconTree[name].styles.join(', ')}
					</div>
				);
			})}
		</div>
	);
};
