import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

function getHeaders(isFormData = false) {
    const token = localStorage.getItem("userToken");
    const headers = {};
    if (token) {
        headers["token"] = token;
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

export function getAllPosts(page = 1) {
    return axios.get(`${apiURL}/posts`, {
        headers: getHeaders(),
        params: {
            "limit": 5,
            "sort": "-createdAt",
            page
        }
    });
}

export async function getSinglePost(id) {
    const data = await axios.get(`${apiURL}/posts/${id}`, {
        headers: getHeaders()
    });
    return data;
}

export async function createPost(formData) {
    const data = await axios.post(`${apiURL}/posts`, formData, {
        headers: getHeaders(formData instanceof FormData)
    });
    return data;
}

export async function updatePost(postId, formData) {
    const data = await axios.put(`${apiURL}/posts/${postId}`, formData, {
        headers: getHeaders(formData instanceof FormData)
    });
    return data;
}

export async function deletePost(postId) {
    const data = await axios.delete(`${apiURL}/posts/${postId}`, {
        headers: getHeaders()
    });
    return data;
}

export async function getUserPosts(userId, page) {
    const data = await axios.get(`${apiURL}/users/${userId}/posts`, {
        headers: getHeaders(),
        params: page ? { page } : undefined
    });
    return data;
}

export async function likeUnlikePost(postId) {
    const data = await axios.put(`${apiURL}/posts/${postId}/like`, {}, {
        headers: getHeaders()
    });
    return data;
}

export async function getPostLikes(postId) {
    const data = await axios.get(`${apiURL}/posts/${postId}/likes`, {
        headers: getHeaders()
    });
    return data;
}
