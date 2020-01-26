import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import config from '../config'
import axios from 'axios'
import { UserContext } from '../UserContext'

const Login = props => {
  const { gUser, setGUser } = useContext(UserContext)
  const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false)
  const [usernameFromApi, setUsernameFromApi] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [user, setUser] = useState({
    username: '',
    password: '',
  })

  const authenticateUser = async () => {
    const apiUrl = `${config.apiServer}${config.apiAuthEP}/login`
    let resp
    try {
      resp = await axios.post(apiUrl, user)
    } catch (err) {
      // console.log(`err:`)
      // console.dir(err)
      // console.log('err.response:')
      // console.dir(err.response)
      // Something went wrong, most likely wrong password, so delete the contents of the password form field
      setUser(prev => {
        return { ...prev, password: '' }
      })
      setErrorMsg(err.response.data.error || 'An unexpected error occurred.')
      return
    }
    if (resp.status !== 200) {
      setErrorMsg('Login unsuccessful')
      setUser(prev => {
        return { ...prev, password: '' }
      })
    } else {
      setErrorMsg('Login successful')
      setGUser({
        username: resp.data.username,
        fullName: resp.data.fullName,
        token: resp.data.token,
        expirationTime: resp.data.expirationTime,
      })
      setUser({ username: '', password: '' })
      setSuccessfullyLoggedIn(true)
      // setUsernameFromApi(resp.data.username)
      // setUser({})
    }
  }

  const handleLogin = e => {
    e.preventDefault()
    setErrorMsg('')
    authenticateUser()
  }

  const updateUser = e => {
    e.persist()
    setUser(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  useEffect(() => {
    if (usernameFromApi) {
      setSuccessfullyLoggedIn(true)
    }
  }, [gUser])

  return (
    // prettier-ignore
    <section className="loginContainer">
      {successfullyLoggedIn && <Redirect to={{pathname: '/Msg', state: {msg: 'You were successfully logged in.'}}} />}
      <table className="loginBox formBox">
        <tbody>
          {/* <tr><td className="loginLabel">Login</td></tr> */}
          {errorMsg && <tr><td><section className="errorMsg">{errorMsg}</section></td></tr>}
          <tr><td><input placeholder="Username" type="text" name="username" value={user.username} onChange={updateUser}></input></td></tr>
          <tr><td><input placeholder="Password" type="password" required name="password" value={user.password} onChange={updateUser}></input></td></tr>
          <tr><td><input type="submit" name="loginButton" onClick={handleLogin} value="Log In"></input></td></tr>
        </tbody>
       </table>

      </section>
  )
}

export default Login
