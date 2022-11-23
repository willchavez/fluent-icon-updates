import React from 'react';
import './App.css';
import html2canvas from 'html2canvas';
import { Camera20Filled } from '@fluentui/react-icons';
import { IconContent } from './components/IconContent';

function App() {
	// React.useEffect(() => {
	// 	OctokitRequest()
	// }, [])

	let button = (
		<button
			type='button'
			className='btn btn-primary'
			style={{ marginLeft: '2rem', height: '35px' }}
			onClick={() => {
				html2canvas(
					document.querySelector('#app') || new HTMLElement(),
					{
						scale: 3,
					}
				).then((canvas: any) => {
					var image = canvas
						.toDataURL('image/png')
						.replace('image/png', 'image/octet-stream'); // here is the most important part because if you dont replace you will get a DOM 18 exception.

					downloadImage(image, 'fluent-updates-overview.jpeg');

					function downloadImage(
						data: string,
						filename = 'untitled.jpeg'
					) {
						var a = document.createElement('a');
						a.href = data;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
					}
				});
			}}
		>
			<Camera20Filled />
		</button>
	);

	return (
		<div className='App'>
			<div id='app' style={{ paddingBottom: '1rem' }}>
				<header className='App-header'>
					<div className='container'>
						<div className='row'>
							<h1>Fluent Icon Updates</h1>
						</div>
						<div className='row'>
							<h4>
								Using @fluentui/react-icons@
								{process.env.REACT_APP_FLUENT_ICONS_VERSION}
							</h4>
						</div>
						<div className='row'>
							<h4>
								{new Date().toDateString()} {button}
							</h4>{' '}
						</div>
					</div>
				</header>

				<IconContent />
			</div>
		</div>
	);
}

export default App;
