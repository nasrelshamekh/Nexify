import { Alert, Button, Input, Select, SelectItem } from '@heroui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { regSchema } from '../../../lib/validationSchemas/authSchema'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useState } from 'react'
import { registerUser } from '../../../services/authServices'
import { toast } from 'react-toastify'

export default function Register() {

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(regSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    }
  })


  async function onSubmit(data) {
    setErrorMsg("")
    setSuccessMsg("")
    console.log(data);
   try {
     const response = await registerUser(data)
    console.log(response);
    setSuccessMsg(response.data.message)
    toast.success(response.data.message)
    navigate("/login")
   } catch (error) {
    console.log(error);
    setErrorMsg(error.response.data.error)
    toast.error(error.response.data.error)
    
   }

  }


  return (
    <>
      <form noValidate className='w-full max-w-4xl space-y-10' onSubmit={handleSubmit(onSubmit)}>
        <div className="form-header">
          <h1 className="text-4xl font-bold mb-5">Join Nexify Today! 🚀</h1>
          <p className="text-xl">Create your free account and start connecting.</p>
        </div>
        <div className="inputs-form space-y-5">
          <Input isInvalid={Boolean(errors.name)} errorMessage={errors.name?.message} {...register("name")} isRequired variant='faded' label="Name" type="text" />
          <Input isInvalid={Boolean(errors.email)} errorMessage={errors.email?.message} {...register("email")} isRequired variant='faded' label="Email" type="email" />

          <Input isInvalid={Boolean(errors.password)} errorMessage={errors.password?.message} {...register("password")} isRequired variant='faded' label="Password" type={showPassword ? "text" : "password"}
            endContent={showPassword ? <IoIosEyeOff onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' /> : <IoIosEye onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' />} />

          <Input isInvalid={Boolean(errors.rePassword)} errorMessage={errors.rePassword?.message} {...register("rePassword")} isRequired variant='faded' label="RePassword" type="password" />

          <div className='flex gap-2 items-center'>
            <Input isInvalid={Boolean(errors.dateOfBirth)} errorMessage={errors.dateOfBirth?.message} {...register("dateOfBirth")} isRequired label="Birth date" type="date" />

            <Select isInvalid={Boolean(errors.gender)} errorMessage={errors.gender?.message} {...register("gender")} isRequired label="Select a gender">
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
            </Select>

          </div>
          <div className='flex justify-between items-end'>
            <Button isLoading={isSubmitting} type='submit' color="primary">Submit</Button>
            <span>Already have an account?
              <Link to="/login" className='font-bold ms-1'>
                Sign in
              </Link>
            </span>
          </div>
          {errorMsg && <Alert color="danger" title={errorMsg} className='w-1/2' />}
          {successMsg && <Alert color="success" title={successMsg} className='w-1/2' />}
        </div>
      </form>
    </>
  )
}
