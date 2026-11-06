import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@heroui/react'
import React, { useContext, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoChevronDown } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { authContext } from '../../Context/AuthContext'
import { deleteComment, getPostComments, updatePostComments } from '../../services/commentsServices'
import { FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function CardFooter({ postUserId, postId, comment, setPostComments }) {

  const { userData } = useContext(authContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newContent, setNewContent] = useState(comment?.content || "")

  async function deleteUserComment(commentId) {
    setIsLoading(true)
    try {
      await deleteComment(postId, commentId)
      if (typeof setPostComments === 'function') {
        setPostComments(prev => Array.isArray(prev) ? prev.filter(c => c._id !== commentId) : prev)
      }
      getNewComments(postId)
      toast.success("Comment has been deleted!")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment.")
    } finally {
      setIsLoading(false)
    }
  }

  async function getNewComments(postId) {
    try {
      const { data } = await getPostComments(postId)
      const commentsList = data?.data?.comments || data?.comments || []
      if (typeof setPostComments === 'function') {
        setPostComments(commentsList)
      }
    } catch (error) {
      console.error("Error getting comments:", error)
    }
  }

  async function saveEdit() {
    setIsLoading2(true)
    try {
      const { data } = await updatePostComments(postId, comment._id, newContent)
      const updatedComment = data?.data?.comment || data?.comment || { ...comment, content: newContent }
      if (typeof setPostComments === 'function') {
        setPostComments(prev =>
          Array.isArray(prev) ? prev.map(c => (c._id === comment._id ? updatedComment : c)) : prev
        )
      }
      setIsEditing(false)
      toast.success('Comment updated!')
    } catch (error) {
      console.error("Error updating comment:", error)
      toast.error("Failed to update comment.")
    } finally {
      setIsLoading2(false)
    }
  }

  const commentPhoto = comment?.commentCreator?.photo
  const isDefaultOrMissingPhoto = !commentPhoto || commentPhoto.includes("/undefined")
  const avatarSrc = isDefaultOrMissingPhoto
    ? "https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png"
    : commentPhoto

  const isAuthor = userData?._id && comment?.commentCreator?._id && userData._id === comment.commentCreator._id
  const isPostOwner = userData?._id && postUserId && userData._id === postUserId

  return (
    <>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={avatarSrc}
            alt={comment?.commentCreator?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
            <h4 className="font-semibold text-sm text-gray-900">{comment?.commentCreator?.name || "User"}</h4>
            {isEditing ?
              <div className="flex gap-2 mt-1">
                <input
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <Button isLoading={isLoading2} disabled={newContent === comment?.content} className={`px-2 py-1 rounded-full ${newContent === comment?.content ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white cursor-pointer"}`} onClick={saveEdit}><FiCheck /></Button>
                <button className='cursor-pointer' onClick={() => { setIsEditing(false); setNewContent(comment?.content); }}><FiX /></button>
              </div>
              : <>
              <p className="text-sm text-gray-700 mt-1">{comment?.content}</p>
              {comment?.image && <img src={comment?.image} alt="Comment Image" className="mt-2 rounded max-h-60 object-cover" />}
              </>
            }
          </div>
          {isLoading ? <Spinner /> : <>
            {(isPostOwner || isAuthor) && <Dropdown placement="bottom-end">
              <DropdownTrigger className="cursor-pointer">
                <BsThreeDotsVertical className="w-5 h-5" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                {isAuthor && <DropdownItem onPress={() => { setIsEditing(true) }} key="edit">Edit</DropdownItem>}
                <DropdownItem key="delete" onClick={() => { deleteUserComment(comment._id) }} className='text-danger-500' color="danger">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>}
          </>}
        </div>
      </div>
    </>
  )
}
