export const contractReducer = (state, action) => {
	switch (action.type) {
		case 'SET_CURRENT_CONTRACT':
			return {
				contract: action.payload,
			};
		default:
			return state;
	}
};
