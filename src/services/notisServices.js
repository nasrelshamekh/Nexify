import axios from "axios";

const apiURL = import.meta.env.VITE_BASE_URL;

export async function getUnReadNotisCount() {
    const token = localStorage.getItem("userToken");
    if (!token) {
        return { data: { data: { unreadCount: 0 } } };
    }
    const data = await axios.get(`${apiURL}/notifications/unread-count`, {
        headers: {
            "Content-Type": "application/json",
            "token": token,
            "Authorization": `Bearer ${token}`
        }
    });
    return data;
}
