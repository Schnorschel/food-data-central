import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import config from '../config'
import { UserContext } from '../UserContext'

// prettier-ignore
const Signup = () => {
  const { gUser, setGUser } = useContext(UserContext)
  const [user, setUser] = useState({})
  const [errMsg, setErrMsg] = useState()
  const [repeatPW, setRepeatPW] = useState()

  const updateUser = (e) => {
    e.persist()
    setErrMsg('')
    setUser(prev => { return {...prev, [e.target.name]: e.target.value }})
  }

  const submitForm = async e => {
    e.preventDefault()
    let resp
    if (user.password !== repeatPW) {
      setErrMsg('Please check your password, it does not match the repeat password.')
      return
    }
    const apiUrl = `${config.apiServer}${config.apiAuthEP}/signup`
    try {
      resp = await axios.post(apiUrl, user)
    } catch (err) {
      console.dir(err.response)
      setErrMsg(err.response.data.error || 'An unexpected error occurred.')
      return
    }
    if (resp.status !== 200) {
      console.dir(resp.data)
      setErrMsg('Sign-up unsuccessful.')
    } else {
      console.dir(resp.data)
      setErrMsg('Sign-up successful. You are now logged in.')
      setGUser({
        username: resp.data.username,
        fullName: resp.data.fullName,
        token: resp.data.token,
        expirationTime: resp.data.expirationTime,
      })
    }
  }

  return (
    <section>
      {errMsg && (<section className="errorMsg" colSpan="2">{errMsg}</section>)}
      <table>
        <tbody>
          <tr><td className="loginLabel">User name:</td><td><input type="text" required name="username" value={user.username} onChange={updateUser}></input></td></tr>
          <tr><td className="loginLabel">Password:</td><td><input type="password" required name="password" value={user.password} onChange={updateUser}></input></td></tr>
          <tr><td className="loginLabel">Repeat password:</td><td><input type="password" required name="repeatPassword" value={repeatPW} onChange={e => {setErrMsg(''); setRepeatPW(e.target.value)}}></input></td></tr>
          <tr><td className="loginLabel">Name:</td><td><input type="text" required name="fullName" value={user.fullName} onChange={updateUser}></input></td></tr>
          <tr><td className="loginLabel">Email:</td><td><input type="text" required name="email" value={user.email} onChange={updateUser}></input></td></tr>
          <tr><td></td><td><button className="button signupButton" onClick={submitForm}>Sign Up</button></td></tr>
        </tbody>
      </table>
    </section>
  );
}

export default Signup
