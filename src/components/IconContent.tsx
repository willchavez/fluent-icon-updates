import React, { useEffect, useState } from 'react';
import { DialogLargeHeaderExample } from './Dialog';
import { IconList } from '../ui/IconList';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useBoolean } from '@fluentui/react-hooks';
import { getBothVersionsOfFile } from '../api/fetchicons';
import { TextIconList } from '../ui/TextIconList';

export function IconContent(props: any) {
	let [changedFiles, setChangedFiles]: any = useState([]);
	let [addedFiles, setAddedFiles]: any = useState([]);
	let [renamedFiles, setRenamedFiles]: any = useState([]);

	let [parentFromCommitSha, setParentFromCommitSha] = React.useState('');
	let [parentToCommitSha, setParentToCommitSha] = React.useState('');

	let [previousIcons, setPreviousIcons] = React.useState<any[]>([]);
	let [currentIcons, setCurrentIcons] = React.useState<any[]>([]);

	const [value, { setTrue: showDialog, toggle: toggleDialogVisible }] =
		useBoolean(true);

	useEffect(() => {
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
	}, [changedFiles, parentFromCommitSha, parentToCommitSha, showDialog]);

	useEffect(() => {
		console.log('Added Files');
		console.log(addedFiles);
	}, [addedFiles, setAddedFiles]);

	useEffect(() => {
		console.log('Renamed Files');

		console.log(renamedFiles);
	}, [renamedFiles, setRenamedFiles]);

	return (
		<>
			<div>
				<IconList
					previousIcons={previousIcons}
					currentIcons={currentIcons}
				/>
				<div>
					{/* Added Icons */}
					<TextIconList
						addedFiles={addedFiles}
						status='Added'
					></TextIconList>
					{/* Updated Icons */}
					<TextIconList
						addedFiles={changedFiles}
						status='Updated'
					></TextIconList>
				</div>
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
				setAddedFiles={setAddedFiles}
				setRenamedFiles={setRenamedFiles}
				setParentFromCommitSha={setParentFromCommitSha}
				setParentToCommitSha={setParentToCommitSha}
			></DialogLargeHeaderExample>
		</>
	);
}
