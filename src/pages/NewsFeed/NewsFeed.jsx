import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { getAllPosts } from '../../services/postServices'
import PostSkeleton from '../../components/Skeletons/PostSkeleton';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useQuery } from '@tanstack/react-query';

export default function NewsFeed() {

  const { data, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts
  })

  return (
    <>
      <main className='min-h-screen bg-gray-200'>
        <div className="container p-5">
          <div className='grid grid-cols-4 gap-3'>
            <div className='col-span-1'>
              <Sidebar />
            </div>
            <div className="col-span-2 space-y-5">
              <CreatePost />
              {isLoading ? [...Array(5)].map((skeleton, index) => <PostSkeleton key={index} />) : <>
                {data?.data.posts && data?.data.posts.map((post) => <Post key={post.id} post={post} />)}
              </>}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
