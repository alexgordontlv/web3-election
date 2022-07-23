export const contextReducer = (state, action) => {
	switch (action.type) {
		case 'SET_CURRENT_USER':
			return {
				currentUser: action.payload?.currentUser,
				isAdmin: action.payload?.isAdmin ? true : false,
			};
		default:
			return state;
	}
};
