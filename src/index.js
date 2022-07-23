import React from 'react';
import ReactDOM from 'react-dom';
import './assets/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/user.context';
import { ModalProvider } from './context/modal.context';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

ReactDOM.render(
	<React.StrictMode>
		<UserProvider>
			<ModalProvider>
				<Web3ReactProvider getLibrary={(provider) => new Web3Provider(provider)}>
					<App />
				</Web3ReactProvider>
			</ModalProvider>
		</UserProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
