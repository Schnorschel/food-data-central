import React from 'react'

const Msg = props => {
  return <section className="mainContainer">{props.location.state.msg}</section>
}

export default Msg
