import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { addPost, fetchPosts, fetchTags } from '../api/api'

const PostLists = () => {

  const [page, setPage]= useState(1)
    const {data:postData, isLoading, isError, error} = useQuery({
        queryKey:["posts", {page}],
        queryFn: ()=>fetchPosts(page),
    });

    const queryClient= useQueryClient()
    const {
      mutate, 
      isError: isPostError,
      //error:postError,
      isPending,
      reset,

    }= useMutation({
      mutationFn: addPost,
      onMutate: ()=>{

      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({
          queryKey:["posts"],
        })
      }
    })

    const {data: tagsData} = useQuery({
      queryKey:["tags"],
      queryFn:fetchTags,
    })

    const handleSubmit= (e) => { //this is a way of handlig forms 
      e.preventDefault()
      const formData= new FormData(e.target)
      const postTitle= formData.get("title")
      const tags= Array.from(formData.keys()).filter(key=>formData.get(key)==="on")
      if (!postTitle || !tags) return
      mutate({
        id: postData?.data?.length+1, 
        title: postTitle, 
        tags
      })

      e.target.reset();
      
    }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <input 
        type="text"
        className='postbox'
        placeholder='Enter your post...'
        name='title' />
        <div className="tags">
          {tagsData?.map((tag)=>{
            return (
              <div key={tag}>
                <input type="checkbox" name={tag} id={tag} />
                <label htmlFor={tag}>{tag}</label>
              </div>
            )
          })}
        </div>
        <button type='submit'>Post</button>
      </form>
      {isLoading && isPending && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {isPostError && <p onClick={()=>reset()}>Unable to post</p>}


      <div className="pages">
        <button onClick={()=>setPage((oldPage)=> Math.max(oldPage-1, 0))}
          disabled={!postData?.prev}>Previous page</button>
        <span>{page}</span>
        <button  onClick={()=>setPage((oldPage)=> oldPage+1)}
          disabled={!postData?.next }>Next Page</button>
      </div>



      { postData?.data?.map((post) => (
                <div key={post.id} className='post'>
                    <div>{post.title}</div>
                    {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
            ))}
    </div>
  );
};

export default PostLists
