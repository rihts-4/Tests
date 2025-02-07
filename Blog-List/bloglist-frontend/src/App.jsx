import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes - a.likes) )
    )
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Logged in')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch(exception) {
      setMessage(exception.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    setMessage('Logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const blogFormRef = useRef()

  const createBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    setMessage(`New blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    )
  }

  const likeBlog = async blog => {
    blogService
      .update(blog.id, {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
      .then(returnedBlog => {
        setBlogs(blogs
          .map(b => b.id === blog.id ? returnedBlog : b)
          .sort((a,b) => b.likes - a.likes)
        )
      })
  }

  const deleteBlog = blog => {
    blogService
      .remove(blog.id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
      })
    setMessage('Blog deleted')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      {user ? <BlogList
        blogs={blogs}
        user={user}
        message={message}
        handleLogout={handleLogout}
        blogForm={blogForm}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
      /> : <LoginForm
        message={message}
        username={username}
        password={password}
        handleUsername={handleUsername}
        handlePassword={handlePassword}
        handleLogin={handleLogin}
      />}
    </div>
  )
}

export default App