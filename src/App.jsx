import { useQuery } from '@tanstack/react-query'
import './App.css'
import { fetchPosts } from './api/api'
import PostLists from './components/post-lists'
import { useState } from 'react'
function App() {

  /*const { data, isLoading, status} = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  })

  console.log(data,isLoading,status)*/
  const [isToggle, setIsToggle] = useState("true")
  return (
    <>
      <div>
        <h2 className='title'>My Posts</h2>
        <button onClick={()=>setIsToggle(!isToggle)}>Toggle</button>
        {isToggle && <PostLists/>}
      </div>
    </>
  )
}

export default App
