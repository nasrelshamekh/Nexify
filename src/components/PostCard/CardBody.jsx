import { Button, user } from '@heroui/react'
import React, { startTransition, useContext, useEffect, useOptimistic, useRef, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiCamera, BiMessageRounded, BiShareAlt } from 'react-icons/bi'
import { BsEmojiSmile } from 'react-icons/bs'
import { FiSend } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { createComment } from '../../services/commentsServices'
import { toast } from 'react-toastify'
import { likeUnlikePost } from '../../services/postServices'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authContext } from '../../Context/AuthContext'
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { set } from 'zod'

export default function CardBody({ page, post, id, body, image, isPostDetails, likesCount }) {

  const queryClient = useQueryClient()
  const { userData } = useContext(authContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLikes, setIsLoadingLikes] = useState(false)
  const alreadyLiked = post?.likes?.includes(userData._id)
  const [formDataFile, setFormDataFile] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState("")
  const commentsLength = post?.commentsCount
  const fileInput = useRef()
  const commentMsg = useRef()

  /*async function addComment(comment, postId) {
    setIsLoading(true)
    try {
      const { data } = await createComment(formData, post?._id)
      setCommentMsg("")
      toast.success("Comment added successfully!")
      console.log(data)

    } catch (error) {


    } finally {
      setIsLoading(false)
    }

  }*/

  /*function sendComment(e) {
    setCommentMsg(e.target.value)
    console.log(e.target.value)
  }*/

  const { mutate: handleLike } = useMutation({
    mutationFn: () => likeUnlikePost(id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['getPosts', page] })
      await queryClient.cancelQueries({ queryKey: ['singlePost', id] })
      await queryClient.cancelQueries({ queryKey: ['userPosts', userData._id] })

      const previousPosts = queryClient.getQueryData(['getPosts', page])
      const previousSinglePost = queryClient.getQueryData(['singlePost', id])
      const previousUserPosts = queryClient.getQueryData(['userPosts', userData._id])

      const toggleLike = (p) => {
        const alreadyLiked = p.likes.includes(userData._id)
        return {
          ...p,
          likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
          likes: alreadyLiked
            ? p.likes.filter((uid) => uid !== userData._id)
            : [...p.likes, userData._id],
        }
      }

      queryClient.setQueryData(['getPosts', page], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p) =>
                p._id === id ? toggleLike(p) : p
              ),
            },
          },
        }
      })

      queryClient.setQueryData(['singlePost', id], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: toggleLike(old.data.data.post),
            },
          },
        }
      })

      queryClient.setQueryData(['userPosts', userData._id], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p) =>
                p._id === id ? toggleLike(p) : p
              ),
            },
          },
        }
      })

      return { previousPosts, previousSinglePost, previousUserPosts }
    },

    onError: (err, _variables, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['getPosts', page], context.previousPosts)
      if (context?.previousSinglePost) queryClient.setQueryData(['singlePost', id], context.previousSinglePost)
      if (context?.previousUserPosts) queryClient.setQueryData(['userPosts', userData._id], context.previousUserPosts)
      toast.error("Failed to like/unlike post.")
    },

    onSuccess: (response) => {
      const serverLikesCount = response.data.data.likesCount

      queryClient.setQueryData(['getPosts', page], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p) =>
                p._id === id ? { ...p, likesCount: serverLikesCount } : p
              ),
            },
          },
        }
      })

      queryClient.setQueryData(['singlePost', id], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: { ...old.data.data.post, likesCount: serverLikesCount },
            },
          },
        }
      })

      queryClient.setQueryData(['userPosts', userData._id], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p) =>
                p._id === id ? { ...p, likesCount: serverLikesCount } : p
              ),
            },
          },
        }
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getPosts', page] })
      queryClient.invalidateQueries({ queryKey: ['singlePost', id] })
      queryClient.invalidateQueries({ queryKey: ['userPosts', userData._id] })
    },
  })


  function openFileInput() {
    fileInput.current.click()

  }

  function getFile() {
    const file = fileInput.current.files[0]
    setFormDataFile(file)
    setSelectedPhoto(URL.createObjectURL(file))
  }

  async function addComment() {

    const formData = new FormData()
    formData.append("content", commentMsg.current.value || " ")
    if (formDataFile instanceof File) {
      formData.append("image", formDataFile)
    }
    setIsLoading(true)
    try {
      const { data } = await createComment(post._id, formData)
      toast.success("Comment has been added!")
      queryClient.invalidateQueries({ queryKey: ['postComments', id] })
      queryClient.invalidateQueries({ queryKey: ['getPosts', page] })
      setSelectedPhoto("")
      setFormDataFile("")
      commentMsg.current.value = ""
      console.log(data)
    } catch (error) {
      console.log(error)
      toast.error("Failed to add comment.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>

      <div className="px-4 pb-3">
        <p className="text-gray-800">
          {body}
        </p>
      </div>
      <div className="w-full">
        <img
          src={image || "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"}
          alt="Post content"
          className={`w-full object-cover ${isPostDetails ? "" : "h-100"}`}
        />
      </div>
      <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-100">
        <div className='flex items-center gap-2'>
          <motion.button
            onClick={() => handleLike()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              outline: "none",
              padding: "10px",
            }}
          >
            <FaHeart className='w-6 h-6 cursor-pointer'
              size={32}
              style={{
                color: alreadyLiked ? "#e0245e" : "#606770",
                transition: "color 0.2s ease-in-out",
              }}

            />

          </motion.button>
          <span className="font-medium">{likesCount}</span>
        </div>
        <Link to={`/post-details/${id}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <BiMessageRounded className="w-6 h-6" />
          <span className="font-medium">{commentsLength}</span>
        </Link>
        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
          <BiShareAlt className="w-6 h-6" />
          <span className="font-medium">17</span>
        </button>
      </div>
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <input
          ref={commentMsg}
          type="text"
          placeholder="Write your comment"
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button isLoading={isLoading} onPress={() =>
          addComment()
        } disabled={commentMsg ? false : true} size='sm' radius='full' variant='shadow' color='primary' className="disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
          <FiSend className="w-5 h-5" />
        </Button>
        <button className="text-gray-400 hover:text-gray-600">
          <BiCamera onClick={openFileInput} className="w-5 h-5 cursor-pointer" />
          <input onChange={getFile} ref={fileInput} type="file" className="hidden" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <BsEmojiSmile className="w-5 h-5" />
        </button>

      </div>
      {formDataFile && (<div className="flex flex-col items-center  px-4 py-2">
        <img src={selectedPhoto} alt="Preview" className="object-cover rounded p-10" />
        <button onClick={() => setFormDataFile("")} className="text-black cursor-pointer border-1 border-red-500 border-solid p-2 bg-red-300 hover:bg-red-500 transition-all duration-500 ease-in-out transform hover:scale-105">Remove</button>
      </div>)}

    </>
  )
}
