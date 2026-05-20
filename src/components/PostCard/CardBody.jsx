import { Button, user } from '@heroui/react'
import React, { startTransition, useContext, useEffect, useOptimistic, useState } from 'react'
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
import { likesColorContext } from '../../Context/LikesColorContext'

export default function CardBody({ post, id, body, image, commentsLength, isPostDetails, setPostComments, setPostLikesCount, likesCount }) {

  const queryClient = useQueryClient()
  const { userData } = useContext(authContext)
  const [commentMsg, setCommentMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLikes, setIsLoadingLikes] = useState(false)
  console.log(post)
  const { isLiked, setIsLiked } = useContext(likesColorContext)
  useEffect(() => {
    if (post?.likes && userData?._id) {
      setIsLiked(post.likes.includes(userData._id))
    }
  }, [post, userData])

  async function addComment(comment) {
    setIsLoading(true)
    try {
      const { data } = await createComment(comment)

      setPostComments(data.comments)
      setCommentMsg("")
      toast.success("Comment added successfully!")

    } catch (error) {


    } finally {
      setIsLoading(false)
    }

  }

  function sendComment(e) {
    setCommentMsg(e.target.value)
  }



  async function handleLike() {
    setIsLoadingLikes(true)
    try {
      const { data } = await likeUnlikePost(id)
      console.log(data)
      queryClient.invalidateQueries(['singlePost', id])
        setPostLikesCount(data.data.likesCount)
        toast.success("Post liked/unliked successfully!")
        if (post?.likes && userData?._id) {
          setIsLiked(post.likes.includes(userData._id))
        }

    } catch (error) {
      console.error("Error occurred while liking/unliking post:", error)
    } finally {
      setIsLoadingLikes(false)
    }
  }

  const handleLikeAndColor = () => {
    setIsLiked(!isLiked);
    handleLike();
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
            onClick={handleLikeAndColor}
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
              color={isLiked ? "#ff2d55" : "#c7c7cc"}
              style={{
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
          onChange={(e) => { sendComment(e) }}
          value={commentMsg}
          type="text"
          placeholder="Write your comment"
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button isLoading={isLoading} onPress={() =>
          addComment({
            content: commentMsg,
            post: id
          })
        } disabled={commentMsg ? false : true} size='sm' radius='full' variant='shadow' color='primary' className="disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
          <FiSend className="w-5 h-5" />
        </Button>
        <button className="text-gray-400 hover:text-gray-600">
          <BiCamera className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <BsEmojiSmile className="w-5 h-5" />
        </button>
      </div>

    </>
  )
}
