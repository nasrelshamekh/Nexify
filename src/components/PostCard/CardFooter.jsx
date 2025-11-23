import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from '@heroui/react'
import React, { useContext, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoChevronDown } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { authContext } from '../../Context/AuthContext'
import { deleteComment, getPostComments, updatePostComments } from '../../services/commentsServices'
import { FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function CardFooter({ comment, postUserId, postId, setPostComments }) {

  const { userData } = useContext(authContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  async function deleteUserComment(commentId) {
    setIsLoading(true)
    try {
      const { data } = await deleteComment(commentId)
      getNewComments(postId)
      toast.success("Comment has been deleted!")
    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false)
    }
  }

  async function getNewComments(postId) {
    try {
      const { data } = await getPostComments(postId)
      setPostComments(data.comments)
      console.log(data);

    } catch (error) {
      console.log(error);

    }
  }

  async function saveEdit() {
    setIsLoading2(true)
    try {
      const { data } = await updatePostComments(comment._id, newContent)
      setPostComments(prev =>
        prev.map(c => (c._id === comment._id ? data.comment : c))
      )
      // getNewComments(postId)
      setIsEditing(false)
      toast.success('Comment updated!')
      console.log(data);

    } catch (error) {
      console.log(error);

    }finally {
      setIsLoading2(false)
    }
  }

  return (
    <>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={comment.commentCreator.photo.includes("/undefined") ? "https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png" : comment.commentCreator.photo}
            alt={comment.commentCreator.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
            <h4 className="font-semibold text-sm text-gray-900">{comment?.commentCreator.name}</h4>
            {isEditing ?
              <div className="flex gap-2 mt-1">
                <input
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <Button isLoading={isLoading2} disabled={newContent === comment.content} className={`px-2 py-1 rounded-full ${newContent === comment.content ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white cursor-pointer"}`} onClick={saveEdit}><FiCheck /></Button>
                <button className='cursor-pointer' onClick={() => { setIsEditing(false); setNewContent(comment.content); }}><FiX /></button>
              </div>
              :
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            }
          </div>
          {isLoading ? <Spinner /> : <>
            {userData._id == postUserId && userData._id == comment.commentCreator._id && <Dropdown placement="bottom-end">
              <DropdownTrigger className="cursor-pointer">
                <BsThreeDotsVertical className="w-5 h-5" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem onPress={() => { setIsEditing(true) }} key="edit">Edit</DropdownItem>
                <DropdownItem key="delete" onClick={() => { deleteUserComment(comment._id) }} className='text-danger-500' color="danger">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>}
          </>}
        </div>
      </div>
    </>
  )
}
