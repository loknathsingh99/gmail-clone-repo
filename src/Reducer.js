export const initialState = {
    user: null,
    emails: [],
};

// export const getTotalEmailCount = (emails)=>{
// return emails?.length();
// }
const reducer = (state, action) => {
    const { emails, user } = state;
    switch (action.type) {
        case "SET_USER": {
            return { ...state, user: action.user };
        }

        case "SIGN_OUT": {
            return initialState;
        }
    }
};

export default reducer;
