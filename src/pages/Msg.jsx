import React from 'react'

const Msg = props => {
  return (
    <section className="mainMsgContainer bigMessage messageFont">
      {props.location.state.msg}
    </section>
  )
}

export default Msg
