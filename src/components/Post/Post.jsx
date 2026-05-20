import CardHeader from '../PostCard/CardHeader';
import CardBody from '../PostCard/CardBody';
import CardFooter from '../PostCard/CardFooter';
import { useState } from 'react';

export default function Post({ post, getAllPosts }) {

    const [postComments, setPostComments] = useState(post.comments || [])
    const [postLikesCount, setPostLikesCount] = useState(post.likesCount || 0)
    


    return (
        <>
            <div className=" bg-white rounded-lg shadow-sm border border-gray-200">

                <CardHeader id={post._id} post={post} getAllPosts={getAllPosts} postUserId={post.user?._id} photo={post.user?.photo} name={post.user?.name} createdAt={post.createdAt} />

                <CardBody post={post} setPostComments={setPostComments} setPostLikesCount={setPostLikesCount} id={post._id} body={post.body} image={post.image} commentsLength={postComments.length} likesCount={postLikesCount} />

                {postComments.length > 0 && <>
                    <CardFooter
                    postId = {post._id}
                    postUserId={post.user._id}
                        comment= {postComments[0]} 
                        setPostComments={setPostComments}
                        />
                </>}
            </div>
        </>
    );
}