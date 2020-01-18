import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../UserContext'

const Logout = props => {
  const { gUser, setGUser } = useContext(UserContext)
  const [displayMsg, setDisplayMsg] = useState()

  useEffect(() => {
    setGUser({})
  }, [])

  useEffect(() => {
    switch (props.match.params.purpose) {
      case 'u': // user-initiated logout
        setDisplayMsg('You were successfully logged out.')
        break

      default:
        break
    }
  }, [props.match.params.purpose])

  return (
    <section>
      {gUser && gUser.username ? null : <span>{displayMsg}</span>}
    </section>
  )
}

export default Logout
