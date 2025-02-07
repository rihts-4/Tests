import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const detailsVisible = { display: visible ? '' : 'none' }
  const viewButtonLabel = visible ? 'hide' : 'view'
  const isOwner = user.id === blog.user.id
  const deleteDisplay = { display: isOwner ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }
  return (
    <div style={blogStyle} className='blog' data-testid='blog'>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{viewButtonLabel}</button>
      <div style={detailsVisible} className='details'>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={likeBlog}>like</button></p>
        <p>{blog.user.name}</p>
        <button onClick={removeBlog} style={deleteDisplay}>remove</button>
      </div>
    </div>
  )
}

export default Blog