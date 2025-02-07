import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({
  blogs,
  user,
  message,
  handleLogout,
  blogForm,
  likeBlog,
  deleteBlog
}) => (
  <div>
    <h2>blogs</h2>
    {message}
    <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>
    {blogForm()}
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} likeBlog={() => likeBlog(blog)} deleteBlog={deleteBlog} user={user} />
    )}
  </div>
)

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
}


export default BlogList