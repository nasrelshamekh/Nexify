import { Outlet } from "react-router-dom"
import AuthBG from "../../assets/images/AuthBG.png"

export default function AuthLayout() {
  return (
    <>
      <div className="grid grid-cols-3">
        <div className="auth-background col-span-1 h-screen">
          <img src={AuthBG} className="w-full h-full object-cover" alt="Auth Background" />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </>
  )
}
