import React from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePost } from '../../services/postServices'
import CardHeader from '../../components/PostCard/CardHeader'
import CardBody from '../../components/PostCard/CardBody'
import CardFooter from '../../components/PostCard/CardFooter'
import PostSkeleton from '../../components/Skeletons/PostSkeleton'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPostComments } from '../../services/commentsServices'

export default function PostDetails() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['singlePost', id],
    queryFn: () => getSinglePost(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
  })

  const { data: postComments } = useQuery({
    queryKey: ['postComments', id],
    queryFn: () => getPostComments(id),
    enabled: !!id,
  })
  


  const post = data?.data?.data?.post
  const comments = postComments?.data?.data?.comments

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="container p-3 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-5">
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="w-full lg:max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
              {isLoading || !post ? (
                <PostSkeleton />
              ) : (
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
                    isPostDetails={true}
                    post={post}
                    id={id}
                    body={post.body}
                    image={post.image}
                    commentsLength={post.commentsCount}
                    likesCount={post.likesCount}
                  />

                  {comments?.map((comment) => (
                    <CardFooter
                      key={comment._id}
                      comment={comment}
                      postUserId={post.user._id}
                      postId={id}
                      setPostComments={() => queryClient.invalidateQueries({ queryKey: ['singlePost', id] })}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}