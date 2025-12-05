import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { getAllPosts } from '../../services/postServices'
import PostSkeleton from '../../components/Skeletons/PostSkeleton';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useQuery } from '@tanstack/react-query';
import { Pagination, Skeleton } from '@heroui/react';

export default function NewsFeed() {

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [initialLoad, setInitialLoad] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ["getPosts", page],
    queryFn: () => getAllPosts(page)
  })

  useEffect(() => {
    if (data?.data.paginationInfo.numberOfPages) {
      setTotalPages(data.data.paginationInfo.numberOfPages)
      setInitialLoad(false)
    }

  }, [data])


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  return (
    <>
      <main className='min-h-screen bg-gray-200'>
        <div className="container p-3 sm:p-5">
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-5'>
            {/* Sidebar - Hidden on mobile and tablet, visible on large screens */}
            <div className='hidden lg:block lg:col-span-1'>
              <Sidebar />
            </div>
            
            {/* Main Content - Full width on mobile/tablet, 2 columns on large screens */}
            <div className="col-span-1 lg:col-span-2 space-y-3 sm:space-y-5">
              <CreatePost />
              {isLoading ? [...Array(5)].map((skeleton, index) => <PostSkeleton key={index} />) : <>
                {data?.data.posts && data?.data.posts.map((post) => <Post key={post.id} post={post} />)}
              </>}
              {initialLoad ? <Skeleton className="h-3 w-3/5 rounded-lg mx-auto" /> : <>
                <Pagination
                  key={data?.data.paginationInfo.numberOfPages}
                  onChange={setPage}
                  page={page}
                  total={data?.data.paginationInfo.numberOfPages || totalPages}
                  showControls
                  className='cursor-pointer flex justify-center'
                  isCompact={true}
                />
              </>}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}