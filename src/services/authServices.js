import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

function getAuthHeaders() {
    const token = localStorage.getItem("userToken");
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["token"] = token;
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

export async function registerUser(formData) {
    const data = await axios.post(`${apiURL}/users/signup`, formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return data;
}

export async function loginUser(formData) {
    const data = await axios.post(`${apiURL}/users/signin`, formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return data;
}

export async function getLoggedUserData() {
    const data = await axios.get(`${apiURL}/users/profile-data`, {
        headers: getAuthHeaders()
    });
    return data;
}

export async function changeUserPassword(password, newPassword) {
    const data = await axios.patch(
        `${apiURL}/users/change-password`,
        {
            password: password,
            newPassword: newPassword
        },
        {
            headers: getAuthHeaders()
        }
    );
    return data;
}

export async function uploadProfilePhoto(formData) {
    const token = localStorage.getItem("userToken");
    const headers = {};
    if (token) {
        headers["token"] = token;
        headers["Authorization"] = `Bearer ${token}`;
    }
    const data = await axios.put(`${apiURL}/users/upload-photo`, formData, {
        headers
    });
    return data;
}
