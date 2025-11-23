import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../Context/AuthContext';

export default function AuthProtectedRoutes({ children }) {

    const {token} = useContext(authContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            navigate("/home")
        }
    }, [token])

    return <>
        {children}
    </>

}
