import { Alert, Button, Input, Select, SelectItem } from '@heroui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../../lib/validationSchemas/AuthSchema'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useContext, useState } from 'react'
import { loginUser } from '../../../services/authServices'
import { toast } from 'react-toastify'
import { authContext } from '../../../Context/AuthContext'

export default function Login() {

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {setToken} = useContext(authContext)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    }
  })


  async function onSubmit(formData) {
    setErrorMsg("")
    setSuccessMsg("")
    console.log(formData);
    try {
      const {data} = await loginUser(formData)
      console.log(data);
      setSuccessMsg(data.message)
      toast.success(data.message)
      localStorage.setItem("userToken" , data?.token)
      setToken(data?.token)
      navigate("/home")
    } catch (error) {
      console.log(error);
      setErrorMsg(error.data.error)
      toast.error(error.data.error)

    }

  }


  return (
    <>
      <form noValidate className='w-full max-w-4xl space-y-10' onSubmit={handleSubmit(onSubmit)}>
        <div className="form-header">
          <h1 className="text-4xl font-bold mb-5">Welcome back, sign in now! 🚀</h1>
          <p className="text-xl">Log in to your account.</p>
        </div>
        <div className="inputs-form space-y-5">
          <Input isInvalid={Boolean(errors.email)} errorMessage={errors.email?.message} {...register("email")} isRequired variant='faded' label="Email" type="email" />

          <Input isInvalid={Boolean(errors.password)} errorMessage={errors.password?.message} {...register("password")} isRequired variant='faded' label="Password" type={showPassword ? "text" : "password"}
            endContent={showPassword ? <IoIosEyeOff onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' /> : <IoIosEye onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' />} />

          <div className='flex justify-between items-end'>
            <Button isLoading={isSubmitting} type='submit' color="primary">Sign in</Button>
          <span>Don't have an account? <Link to={"/register"} className='font-bold'>Sign up!</Link></span>
          </div>
          {errorMsg && <Alert color="danger" title={errorMsg} className='w-1/2' />}
          {successMsg && <Alert color="success" title={successMsg} className='w-1/2' />}
        </div>
      </form>
    </>
  )
}
