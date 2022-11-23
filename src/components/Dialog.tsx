import * as React from 'react';
import { Dialog, DialogType, DialogContent } from '@fluentui/react/lib/Dialog';
import { CompareCommits, GetBranches, RecentCommits } from '../api/fetchicons';
import { Dropdown, IDropdownOption, PrimaryButton } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';

const modelProps = {
	isBlocking: false,
	styles: {
		main: {
			minWidth: 450,
			width: 450,
			height: 450,
			minHeight: 450,
		},
	},
};
const dialogContentProps = {
	type: DialogType.largeHeader,
	title: 'Select your commit range',
};

export const DialogLargeHeaderExample: React.FC<any> = (props: any) => {
	const [isBranchSelected, { setTrue: setIsBranchSelectedToTrue }] =
		useBoolean(false);

	const [fromCommitOptions, setFromCommitOptions] = React.useState<
		IDropdownOption[] | any
	>([]);
	const [branchOptions, setBranchOptions] = React.useState<
		IDropdownOption[] | any
	>([]);
	const [toCommitOptions, setToCommitOptions] = React.useState<
		IDropdownOption[] | any
	>([]);

	const [fromCommitSha, setFromCommitSha] = React.useState('');
	const [toCommitSha, setToCommitSha] = React.useState('');
	const [branchName, setBranchName] = React.useState('');

	React.useEffect(() => {
		RecentCommits('main').then((response) => {
			let temporary_array = [];
			for (let commit of response.data) {
				let commitOption: any = {};
				commitOption.key = commit.sha;
				commitOption.text = commit.commit.message;
				temporary_array.push(commitOption);
			}
			setFromCommitOptions(temporary_array);
		});
		GetBranches().then((response) => {
			console.log(response);
			let temporary_array = [];
			for (let commit of response.data) {
				let commitOption: any = {};
				commitOption.key = commit.commit.sha;
				commitOption.text = commit.name;
				temporary_array.push(commitOption);
			}
			setBranchOptions(temporary_array);
		});
	}, []);

	React.useEffect(() => {
		if (isBranchSelected) {
			RecentCommits(branchName).then((response) => {
				let temporary_array = [];
				for (let commit of response.data) {
					let commitOption: any = {};
					commitOption.key = commit.sha;
					commitOption.text = commit.commit.message;
					temporary_array.push(commitOption);
				}
				setToCommitOptions(temporary_array);
			});
		}
	}, [branchName, isBranchSelected]);

	let getComparison = (from: string, to: string) => {
		CompareCommits(from, to).then((response) => {
			console.log(response);
			console.log(
				response.data.files?.filter(
					(file: any) =>
						file.status === 'modified' &&
						file.filename.includes('.svg')
				)
			);
			props.setChangedFiles(
				response.data.files?.filter(
					(file: any) =>
						file.status === 'modified' &&
						file.filename.includes('.svg')
				)
			);
			props.setParentFromCommitSha(from);
			props.setParentToCommitSha(to);
		});
	};

	return (
		<>
			<Dialog
				hidden={props.open}
				onDismiss={props.toggleDialogVisible}
				dialogContentProps={dialogContentProps}
				modalProps={modelProps}
			>
				<DialogContent>
					<Dropdown
						placeholder='Select a commit'
						label='From'
						options={fromCommitOptions}
						onChange={(event, option) => {
							setFromCommitSha(option?.key.toString() || '');
						}}
					/>

					<Dropdown
						placeholder='Select a branch'
						label='Branch'
						options={branchOptions}
						onChange={(event, option) => {
							if (branchName) {
								setToCommitSha('');
							}
							setIsBranchSelectedToTrue();
							setBranchName(option?.text || '');
						}}
					/>

					<Dropdown
						placeholder='Select a commit'
						label='To Commit'
						options={toCommitOptions}
						disabled={!isBranchSelected}
						onChange={(event, option) => {
							setToCommitSha(option?.key.toString() || '');
						}}
					/>
					<PrimaryButton
						text='See icon changes'
						disabled={!fromCommitSha && !toCommitSha}
						onClick={() => {
							getComparison(fromCommitSha, toCommitSha);
						}}
					></PrimaryButton>
				</DialogContent>
			</Dialog>
		</>
	);
};
