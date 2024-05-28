import {environment} from './environment';

export const generateOTP = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let token = await Utils.getData('token');
            let fetchParameter = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(environment.apiUrl + 'generateOTP', fetchParameter);
            let response = await serverResponse.json();

            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const validateOTP = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let token = await Utils.getData('token');
            let fetchParameter = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + token
                },
            }
            let serverResponse = await fetch(environment.apiUrl + 'validateOTP', fetchParameter);
            let response = await serverResponse.json();

            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    })
}
