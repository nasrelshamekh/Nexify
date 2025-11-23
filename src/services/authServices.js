import axios from "axios";


const apiURL = import.meta.env.VITE_BASE_URL


export async function registerUser(formData) {
    const data = await axios.post(`${apiURL}/users/signup`, formData, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return data
}

export async function loginUser(formData) {
    const data = await axios.post(`${apiURL}/users/signin`, formData, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return data
}

export async function getLoggedUserData() {
    const data = await axios.get(`${apiURL}/users/profile-data`, {
        headers: {
            "Content-Type": "application/json",
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}
