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
    Divider,
    Textarea,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { IoMdPhotos } from "react-icons/io";
import { createPost, updatePost } from "../../services/postServices";
import { authContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";


export default function CreatePostModal({ post, isOpen, onOpenChange, callback }) {

    const { userData } = useContext(authContext)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(post?.image || "")
    const [formDataFile, setFormDataFile] = useState("")
    const fileInput = useRef()
    const statusMsg = useRef()

    function openFileInput() {
        fileInput.current.click()

    }

    function getFile() {
        const file = fileInput.current.files[0]
        console.log(file);
        setFormDataFile(file)
        setSelectedPhoto(URL.createObjectURL(file))
    }

    async function editPost() {
        const formData = new FormData()
        formData.append("body", statusMsg.current.value || " ")
        if (formDataFile) {
            formData.append("image", formDataFile)
        }
        setIsLoading(true)
        try {
            if (post) {
                const { data } = await updatePost(post._id, formData)
                console.log(data);
                toast.success("Post has been updated!")
            } else {
            const { data } = await createPost(formData)
            console.log(data);
            toast.success("Post created!")
        }
         onOpenChange(false)
            callback()
        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={() => {
                onOpenChange(false)
                if (!post) {
                    setSelectedPhoto("")
                }
            }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center">{post ? "Update" : "Create"} Post</ModalHeader>
                            <Divider />
                            <ModalBody className="p-4">
                                <Textarea defaultValue={post?.body || ""} ref={statusMsg} minRows={`${selectedPhoto ? "" : 50}`} placeholder={`What's on your mind, ${userData.name}?`} />
                                {selectedPhoto && <img src={selectedPhoto} alt="" />}
                            </ModalBody>
                            <Divider />
                            <div className="p-4 flex items-center gap-2">
                                <span className="font-semibold">
                                    Add to your Post:
                                </span>
                                <IoMdPhotos onClick={openFileInput} className="text-2xl text-green-500 cursor-pointer" />
                                <input onChange={getFile} ref={fileInput} type="file" className="hidden" />
                            </div>
                            <Divider />
                            <Button isLoading={isLoading} color="primary" className="m-4" onPress={editPost}>
                                {post ? "Update" : "Post"}
                            </Button>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
