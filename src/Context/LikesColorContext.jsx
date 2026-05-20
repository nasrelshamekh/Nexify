import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContext } from './AuthContext'

export const likesColorContext = createContext()

export default function LikesColorContextProvider({ children, post }) {
    const { userData } = useContext(authContext)
    const [isLiked, setIsLiked] = useState(post?.likes?.includes(userData?._id) || false)
    console.log("LikesColorContextProvider rendered with isLiked:", isLiked)

    useEffect(() => {
        setIsLiked(post?.likes?.includes(userData?._id) || false)
    }, [post, userData])
    return (
        <likesColorContext.Provider value={{ isLiked, setIsLiked }}>
            {children}
        </likesColorContext.Provider>
    )

}