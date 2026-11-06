import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@heroui/react'
import React, { useContext } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { authContext } from '../../Context/AuthContext'
import CreatePostModal from '../CreatePost/CreatePostModal'
import { deletePost } from '../../services/postServices'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

export default function CardHeader({ post, photo, name, createdAt, postUserId, getAllPosts, isPostDetails }) {

  const { userData } = useContext(authContext)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function deleteCurrentPost() {
    try {
      await deletePost(post?._id)

      if (isPostDetails) {
        navigate("/home")
      } else {
        queryClient.invalidateQueries({ queryKey: ["getPosts"] })
      }
      toast.success("Post has been deleted!")
    } catch (error) {
      console.error("Error deleting post:", error)
      const err = error.response?.data?.message || "Failed to delete post."
      toast.error(err)
    }
  }

  const avatarSrc = photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
  const isPostOwner = userData?._id && postUserId && userData._id === postUserId

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={avatarSrc}
            alt={name || "User"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{name || "User"}</h3>
            <p className="text-sm text-gray-500">
              {createdAt ? new Date(createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }) : ""}
            </p>
          </div>
        </div>
        {isPostOwner && <Dropdown placement="bottom-end">
          <DropdownTrigger className="cursor-pointer">
            <BsThreeDotsVertical className="w-5 h-5" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem onPress={onOpen} key="edit">Edit</DropdownItem>
            <DropdownItem onPress={deleteCurrentPost} key="delete" className='text-danger-500' color="danger">Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>}
      </div>

      <CreatePostModal post={post} callback={getAllPosts} isOpen={isOpen} onOpenChange={onOpenChange} />

    </>
  )
}
