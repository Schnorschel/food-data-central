import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../UserContext'

const Logout = props => {
  const { gUser, setGUser } = useContext(UserContext)
  const [successFullyLoggedOut, setSuccessFullyLoggedOut] = useState(false)

  useEffect(() => {
    setGUser({})
    setSuccessFullyLoggedOut(true)
  }, [])

  return (
    <section>
      {successFullyLoggedOut && (
        <Redirect
          to={{
            pathname: '/Msg',
            state: { msg: 'You were successfully logged out.' },
          }}
        />
      )}
    </section>
  )
}

export default Logout
