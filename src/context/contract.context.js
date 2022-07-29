import React, { createContext, useContext, useReducer } from 'react';
import { contractReducer } from './contract.reducer';

const ContractContext = createContext();

export const useContractContext = () => {
	return useContext(ContractContext);
};

export const useGetContract = () => {
	const {
		state: { contract },
	} = useContractContext();
	return contract;
};

const initialState = {
	contract: null,
};

export const ContractProvider = ({ children }) => {
	const [state, dispatch] = useReducer(contractReducer, initialState);

	const setContract = (contract) => {
		dispatch({ type: 'SET_CURRENT_CONTRACT', payload: contract });
	};

	return <ContractContext.Provider value={{ state, setContract }}>{children}</ContractContext.Provider>;
};
