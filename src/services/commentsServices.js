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

export async function createComment(postId, formData) {
    const isFormData = formData instanceof FormData;
    const data = await axios.post(`${apiURL}/posts/${postId}/comments`, formData, {
        headers: getHeaders(isFormData)
    });
    return data;
}

export async function deleteComment(postId, commentId) {
    // Route Academy updated comments deletion to /posts/:postId/comments/:commentId
    // If only one argument is passed, try /comments/:postId as fallback
    const url = commentId
        ? `${apiURL}/posts/${postId}/comments/${commentId}`
        : `${apiURL}/comments/${postId}`;

    const data = await axios.delete(url, {
        headers: getHeaders()
    });
    return data;
}

export async function getPostComments(postId) {
    const data = await axios.get(`${apiURL}/posts/${postId}/comments`, {
        headers: getHeaders()
    });
    return data;
}

export async function updatePostComments(postId, commentId, newContent) {
    // Route Academy updated comments update to /posts/:postId/comments/:commentId
    // If only two arguments are passed (old signature commentId, newContent), adapt appropriately
    const url = newContent !== undefined
        ? `${apiURL}/posts/${postId}/comments/${commentId}`
        : `${apiURL}/comments/${postId}`;
    const payload = { content: newContent !== undefined ? newContent : commentId };

    const data = await axios.put(url, payload, {
        headers: getHeaders()
    });
    return data;
}
