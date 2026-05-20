import CardHeader from '../PostCard/CardHeader';
import CardBody from '../PostCard/CardBody';
import CardFooter from '../PostCard/CardFooter';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Post({ post, getAllPosts, page }) {

    return (
        <>
            <div className=" bg-white rounded-lg shadow-sm border border-gray-200">

                <CardHeader id={post._id} post={post} getAllPosts={getAllPosts} postUserId={post.user?._id} photo={post.user?.photo} name={post.user?.name} createdAt={post.createdAt} />

                <CardBody page={page} post={post} id={post._id} body={post.body} image={post.image} likesCount={post.likesCount} />

                {post.commentsCount > 0 && <>
                    <CardFooter
                    comment={post?.topComment}
                    postId = {post._id}
                    postUserId={post.user._id}
                    post={post}
                        />
                </>}
            </div>
        </>
    );
}