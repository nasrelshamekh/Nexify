import React, { createContext, useEffect, useState } from 'react'
import { getUnReadNotisCount } from '../services/notisServices';

export const notisContext = createContext()
export default function NotisContextProvider({ children }) {
    const [unReadNotisCount, setUnReadNotisCount] = useState(0)

     async function getUnReadNotisNo() {
        try {
            const { data } = await getUnReadNotisCount()
            setUnReadNotisCount(data.data.unreadCount)
        } catch (error) {
            console.error('Error fetching unread notifications count:', error)
        }
    }

    useEffect(() => {
        getUnReadNotisNo()
    }, [])

    return (
        <notisContext.Provider value={{ unReadNotisCount }}>
            {children}
        </notisContext.Provider>
    )
}