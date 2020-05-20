import Product from '../../models/product';
import Api from '../../constants/APIs';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

const apiUrl = Api.shopshopDb

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        
        // Any async code you want: 
        try {
            const response = await fetch(`${apiUrl}/products.json`);

            if(!response.ok) {
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedProducts = [];
            for(const key in resData){
                loadedProducts.push(
                    new Product(
                        key, 
                        resData[key].ownerId, 
                        resData[key].title, 
                        resData[key].imageUrl, 
                        resData[key].description, 
                        resData[key].price
                    )
                );
            }
            //console.log(resData);
            dispatch({ 
                type: SET_PRODUCTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch(err) {
            // Send to custom analytics server
            throw err;
        }
        
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        
        const token = getState().auth.token;
        const response = await fetch(
            `${apiUrl}/products/${productId}.json?auth=${token}`, 
            {
                method: 'DELETE'
            }
        );

        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        
        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
    
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // Any async code you want: 
        const response = await fetch(
            `${apiUrl}/products.json?auth=${token}`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                })
            }
        );

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        const resData = await response.json();

        //console.log(resData);

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    };
    
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // Any async code you want: 
        const response = await fetch(
            `${apiUrl}/products.json?auth=${token}`, 
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl
                })
            }
        );

        //const resData = await response.json();
        //console.log(resData);

        if(!response.ok){
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl
            }
        });
    };
    
};