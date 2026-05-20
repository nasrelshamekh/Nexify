import axios from "axios";


const apiURL = import.meta.env.VITE_BASE_URL


export async function getUnReadNotisCount() {
    const data = await axios.get(`${apiURL}/notifications/unread-count`, {
        headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("userToken")
        }
    })
    console.log(data)
    return data
}