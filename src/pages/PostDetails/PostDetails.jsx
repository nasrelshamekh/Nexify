import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePost } from '../../services/postServices'
import CardHeader from '../../components/PostCard/CardHeader'
import CardBody from '../../components/PostCard/CardBody'
import CardFooter from '../../components/PostCard/CardFooter'
import PostSkeleton from '../../components/Skeletons/PostSkeleton'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useQuery } from '@tanstack/react-query'

export default function PostDetails() {
  const { id } = useParams()
  
  const [post, setPost] = useState(null)
  const [postComments, setPostComments] = useState([])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['singlePost', id],
    queryFn: () => getSinglePost(id),
    enabled: !!id,
  })

  // update state when data changes
  useEffect(() => {
    if (data?.data?.post) {
      setPost(data.data.post)
      setPostComments(data.data.post.comments || [])
    }
  }, [data])

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="container p-3 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-5">
          {/* Sidebar - Hidden on mobile/tablet, visible on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content - Full width on mobile/tablet, 3 columns on large screens */}
          <div className="col-span-1 lg:col-span-3">
            <div className="w-full lg:max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
              {isLoading || !post ? 
                <PostSkeleton />
               : 
                <>
                  <CardHeader
                    isPostDetails={true}
                    getAllPosts={refetch}
                    post={post}
                    postUserId={post.user._id}
                    photo={post.user.photo}
                    name={post.user.name}
                    createdAt={post.createdAt}
                  />

                  <CardBody
                    setPostComments={setPostComments}
                    isPostDetails={true}
                    id={id}
                    body={post.body}
                    image={post.image}
                    commentsLength={postComments.length}
                  />

                  {postComments.length > 0 &&
                    postComments.map((comment) => (
                      <CardFooter
                        key={comment._id}
                        comment={comment}
                        postUserId={post.user._id}
                        postId={id}
                        setPostComments={setPostComments}
                      />
                    ))}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}