import CardHeader from '../PostCard/CardHeader';
import CardBody from '../PostCard/CardBody';
import CardFooter from '../PostCard/CardFooter';
import { useState } from 'react';

export default function Post({ post, getAllPosts }) {

    const [postComments, setPostComments] = useState(post.comments)


    return (
        <>
            <div className=" bg-white rounded-lg shadow-sm border border-gray-200">

                <CardHeader id={post._id} post={post} getAllPosts={getAllPosts} postUserId={post.user._id} photo={post.user.photo} name={post.user.name} createdAt={post.createdAt} />

                <CardBody setPostComments={setPostComments} id={post._id} body={post.body} image={post.image} commentsLength={postComments.length} />

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