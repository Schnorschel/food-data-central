import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import config from '../config'
import axios from 'axios'
import { UserContext } from '../UserContext'

const Login = props => {
  const { gUser, setGUser } = useContext(UserContext)
  const [successfullyCreated, setSuccessfullyCreated] = useState(false)
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
      setUser(prev => {
        return { ...prev, password: '' }
      })
      setErrorMsg(err.response.data.message)
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
      // setUsernameFromApi(resp.data.username)
      // setUser({})
    }
  }

  const handleLogin = () => {
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
      setSuccessfullyCreated(true)
    }
  }, [gUser])

  return (
    // prettier-ignore
    <section>
      {successfullyCreated && <Redirect to="/" />}
      {errorMsg && <section className="errorMsg">{errorMsg}</section>}
      <table>
        <tbody>
          <tr><td className="loginLabel">User Name:</td><td><input type="text" name="username" value={user.username} onChange={updateUser}></input></td></tr>
          <tr><td className="loginLabel">Password:</td><td><input type="password" required name="password" value={user.password} onChange={updateUser}></input></td></tr>
          <tr><td></td><td><button name="loginButton" onClick={handleLogin}>Log In</button></td></tr>
        </tbody>
       </table>

      </section>
  )
}

export default Login
