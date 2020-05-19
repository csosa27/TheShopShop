import Api from '../../constants/APIs';
export const SIGNUP = 'SIGNUP';

export const signup = (email, password) => {
    return async dispatch => {
        const apiKey = Api.apiKey;
        const signupApi = Api.signupApi;
        const response = await fetch(
            signupApi+apiKey,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        
        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: SIGNUP });
    };
};