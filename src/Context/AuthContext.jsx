import React, { createContext, useEffect, useState } from 'react'
import { getLoggedUserData } from '../services/authServices';

export const authContext = createContext()
export default function AuthContextProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("userToken"))
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    async function getUserData() {
        setIsLoading(true)
        try {
            const { data } = await getLoggedUserData()
            setUserData(data?.data?.user || data?.user || {})
        } catch (error) {
            console.error("Failed to load user profile:", error)
            if (error.response?.status === 401) {
                localStorage.removeItem("userToken")
                setToken(null)
                setUserData({})
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            getUserData()
        } else {
            setUserData({})
        }
    }, [token])

    return (
        <authContext.Provider value={{ token, setToken, userData, isLoading }}>
            {children}
        </authContext.Provider>
    )
}
