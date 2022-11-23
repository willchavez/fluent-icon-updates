import React, { useEffect, useState } from 'react';
import { DialogLargeHeaderExample } from './Dialog';
import { IconList } from '../ui/IconList';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';
import {
	fetchSVGCODE,
	fetchSVGCODE2,
	getBothVersionsOfFile,
} from '../api/fetchicons';
import { Base64 } from 'js-base64';

export function IconContent(props: any) {
	let [changedFiles, setChangedFiles]: any = useState([]);

	let [parentFromCommitSha, setParentFromCommitSha] = React.useState('');
	let [parentToCommitSha, setParentToCommitSha] = React.useState('');

	let [previousIcons, setPreviousIcons] = React.useState<any[]>([]);
	let [currentIcons, setCurrentIcons] = React.useState<any[]>([]);

	const [value, { setTrue: showDialog, toggle: toggleDialogVisible }] =
		useBoolean(true);

	useEffect(() => {
		console.log(changedFiles);
		if (parentFromCommitSha && parentToCommitSha && changedFiles.length > 1)
			for (let file of changedFiles) {
				getBothVersionsOfFile(
					parentFromCommitSha,
					parentToCommitSha,
					file.filename
				).then((response) => {
					let previousIcon = response?.filter((icons) =>
						icons.url.includes(parentFromCommitSha)
					)[0];
					let currentIcon = response?.filter((icons) =>
						icons.url.includes(parentToCommitSha)
					)[0];
					setPreviousIcons((previousIcons) => [
						...previousIcons,
						previousIcon,
					]);
					setCurrentIcons((currentIcons) => [
						...currentIcons,
						currentIcon,
					]);
				});
				showDialog();
			}
	}, [changedFiles, parentFromCommitSha, parentToCommitSha]);

	return (
		<>
			<div>
				<IconList
					previousIcons={previousIcons}
					currentIcons={currentIcons}
				/>
			</div>

			{previousIcons.length === 0 && currentIcons.length === 0 && (
				<PrimaryButton
					text='Get Started'
					onClick={() => {
						setChangedFiles([]);
						setParentFromCommitSha('');
						setParentToCommitSha('');
						setPreviousIcons([]);
						setCurrentIcons([]);
						toggleDialogVisible();
					}}
					allowDisabledFocus
				/>
			)}

			<DialogLargeHeaderExample
				open={value}
				toggleDialogVisible={toggleDialogVisible}
				setChangedFiles={setChangedFiles}
				setParentFromCommitSha={setParentFromCommitSha}
				setParentToCommitSha={setParentToCommitSha}
			></DialogLargeHeaderExample>
		</>
	);
}
