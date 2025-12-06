import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Link,
    Alert,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { changeUserPassword } from "../../services/authServices";
import { changePasswordSchema } from "../../lib/validationSchemas/authSchema";
import { toast } from "react-toastify";
import { redirect, useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";




export default function UserProfileModal({ isOpen, onOpen, onOpenChange }) {

    const { token, setToken, userData, isLoading } = useContext(authContext)
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate()


    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(changePasswordSchema),
        mode: "all",
        defaultValues: {
            password: "",
            newPassword: "",
        }
    })

    async function onSubmit(data) {
        setErrorMsg("")
        setSuccessMsg("")

        try {
            const response = await changeUserPassword(data?.password, data?.newPassword)

            setSuccessMsg("Password has been changed, please login again")
            toast.success("Password has been changed, please login again")
            localStorage.removeItem("userToken")
            setToken(false)
            navigate("/login")
        } catch (error) {

            setErrorMsg("Incorrect current password")
            toast.error("Incorrect current password")

        }

    }


    return (
        <>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}
                onClose={() => {
                    reset()
                    setErrorMsg("")
                    setSuccessMsg("")
                    setShowPassword(false)
                    setShowNewPassword(false)
                }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
                                <ModalBody>
                                    <Input
                                        isInvalid={Boolean(errors.password)} errorMessage={errors.password?.message} {...register("password")} isRequired
                                        endContent={showPassword ? <IoIosEyeOff onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' /> : <IoIosEye onClick={() => { setShowPassword(!showPassword) }} className='text-3xl cursor-pointer' />}
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        variant="bordered"
                                    />
                                    <Input
                                        isInvalid={Boolean(errors.newPassword)} errorMessage={errors.newPassword?.message} {...register("newPassword")} isRequired
                                        endContent={showNewPassword ? <IoIosEyeOff onClick={() => { setShowNewPassword(!showNewPassword) }} className='text-3xl cursor-pointer' /> : <IoIosEye onClick={() => { setShowNewPassword(!showNewPassword) }} className='text-3xl cursor-pointer' />}
                                        label="New Password"
                                        placeholder="Enter your new password"
                                        type={showNewPassword ? "text" : "password"}
                                        variant="bordered"
                                    />
                                    <div className="flex py-2 px-1 justify-between">
                                    </div>
                                </ModalBody>
                                <div className="flex items-center justify-center gap-2 w-full mb-5">
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button isLoading={isSubmitting} type="submit" color="primary">
                                        Submit
                                    </Button>
                                </div>
                            </form>

                            {errorMsg && <Alert color="danger" title={errorMsg} className='w-full' />}
                            {successMsg && <Alert color="success" title={successMsg} className='w-full' />}

                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
