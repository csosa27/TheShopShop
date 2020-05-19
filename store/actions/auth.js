import Api from '../../constants/APIs';
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if(errorId === 'EMAIL_EXISTS'){
                message = 'This email exists already!';
            } 
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const apiKey = Api.apiKey;
        const loginApi = Api.loginApi;
        const response = await fetch(
            loginApi+apiKey,
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
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if(errorId === 'EMAIL_NOT_FOUND'){
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD'){
                message = 'This password is not valid';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    };
};