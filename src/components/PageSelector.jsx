import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const ltChevron = <FontAwesomeIcon icon={faChevronLeft} />
const gtChevron = <FontAwesomeIcon icon={faChevronRight} />

const PageSelector = props => {
  const pages = []

  // Conditionally push page objects into array
  // An array item has the format {label: '1', page: 1}
  const myPush = (arr, num) => {
    // console.log({ arr }, { num })
    if (typeof num === 'undefined' || num === null || isNaN(num) || num <= 0)
      return
    const len = arr.length
    if (len > 0) {
      const lastEl = arr[len - 1].page
      if (lastEl >= num) return
      if (num - lastEl > 1) arr.push({ label: '...', page: -1 })
    }
    arr.push({ label: num.toString(), page: num })
  }

  if (props.allPages > 1) {
    if (props.allPages > 0) myPush(pages, 1)
    if (props.allPages > 1) myPush(pages, 2)
    myPush(pages, parseInt(props.currentPage) - 1)
    myPush(pages, parseInt(props.currentPage))
    if (props.currentPage + 1 <= props.allPages)
      myPush(pages, parseInt(props.currentPage) + 1)
    // for (let i = parseInt(props.currentPage) - 1; i <= parseInt(props.currentPage) + 1; i++)
    //   myPush(pages, i)
    if (props.allPages > 0) myPush(pages, parseInt(props.allPages) - 1)
    if (props.allPages > 0) myPush(pages, parseInt(props.allPages))

    if (parseInt(props.currentPage) > 1)
      pages.unshift({ label: '<', page: parseInt(props.currentPage) - 1 })

    if (parseInt(props.currentPage) < parseInt(props.allPages))
      pages.push({ label: '>', page: parseInt(props.currentPage) + 1 })
  }

  return (
    // prettier-ignore
    <section className="PageSelectorCont">
      {pages.map((el, i) => {
        return (<>
          {el.label === '...' ? <span className="ellipsis" key={i}><i className="fas fa-ellipsis-h"></i></span> : 
          //  el.label === '<' ? <button className={'pageButton' + (el.page === props.currentPage ? ' thisPage' : '')} key={i} value={el.page} onClick={props.handleButtonClick}><i className="fas fa-chevron-left"></i></button> :
          //  el.label === '>' ? <button className={'pageButton' + (el.page === props.currentPage ? ' thisPage' : '')} key={i} value={el.page} onClick={props.handleButtonClick}><i className="fas fa-chevron-right"></i></button> :
          <button className={'pageButton' + (el.page === props.currentPage ? ' thisPage' : '')} key={i} value={el.page} onClick={props.handleButtonClick}>{el.label}</button> // === '<' ? ltChevron : el.label === '>' ? gtChevron : el.label}</button> //  === '<' ? <i class="fas fa-chevron-left"></i> : el.label === '>' ? <i class="fas fa-chevron-right"></i> : el.label
          }
        </>)
      })}
    </section>
  )
}

export default PageSelector
