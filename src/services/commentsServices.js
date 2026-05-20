import axios from "axios"

export async function createComment(postId ,formData) {
    const data = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`, formData, {
        headers: {
            "token": localStorage.getItem("userToken")
        }
    })
    return data
}

export async function deleteComment(commentId) {
    const data = await axios.delete(`${import.meta.env.VITE_BASE_URL}/comments/${commentId}`, {
        headers: {
            "token": localStorage.getItem("userToken")
        }
    })
    return data
}

export async function getPostComments(postId) {
    const data = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`, {
        headers: {
            "token": localStorage.getItem("userToken")
        }
    })
    return data
}

export async function updatePostComments(commentId, newContent) {
    const data = await axios.put(`${import.meta.env.VITE_BASE_URL}/comments/${commentId}`, { content: newContent }, {
        headers: {
            "token": localStorage.getItem("userToken")
        }
    })
    return data
}