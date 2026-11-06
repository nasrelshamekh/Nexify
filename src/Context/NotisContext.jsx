import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUnReadNotisCount } from '../services/notisServices';
import { authContext } from './AuthContext';

export const notisContext = createContext()
export default function NotisContextProvider({ children }) {
    const { token } = useContext(authContext)
    const [unReadNotisCount, setUnReadNotisCount] = useState(0)

    async function getUnReadNotisNo() {
        if (!token) {
            setUnReadNotisCount(0)
            return
        }
        try {
            const { data } = await getUnReadNotisCount()
            setUnReadNotisCount(data?.data?.unreadCount ?? 0)
        } catch (error) {
            console.error('Error fetching unread notifications count:', error)
        }
    }

    useEffect(() => {
        if (token) {
            getUnReadNotisNo()
        } else {
            setUnReadNotisCount(0)
        }
    }, [token])

    return (
        <notisContext.Provider value={{ unReadNotisCount, getUnReadNotisNo }}>
            {children}
        </notisContext.Provider>
    )
}
