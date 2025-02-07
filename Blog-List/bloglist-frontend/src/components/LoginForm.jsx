import PropTypes from 'prop-types'

const LoginForm = ({
  message,
  username,
  password,
  handleUsername,
  handlePassword,
  handleLogin
}) => {
  return (
    <div className='login-form'>
      <h2>Log in to application</h2>
      {message}
      <form onSubmit={handleLogin}>
            username <input type="text" value={username} onChange={handleUsername} data-testid='username' /> <br />
            password <input type="password" value={password} onChange={handlePassword} data-testid='password' /> <br />
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm