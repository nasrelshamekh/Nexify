import axios from "axios";

export function getAllPosts() {
     return axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
        headers: {
            "token" : localStorage.getItem("userToken")
        },
        params: {
            "limit" : 50,
            "sort" : "-createdAt"
        }
    })
}

export async function getSinglePost(id) {
    const data = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, {
        headers: {
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}

export async function createPost(formData) {
    const data = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, formData, {
        headers: {
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}

export async function updatePost(postId, formData) {
    const data = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, formData, {
        headers: {
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}

export async function deletePost(postId) {
    const data = await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
        headers: {
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}

export async function getUserPosts(userId) {
    const data = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`, {
        headers: {
            "token" : localStorage.getItem("userToken")
        }
    })
    return data
}