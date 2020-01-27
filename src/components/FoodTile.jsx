import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
// prettier-ignore
import { sentenceCase, quietPlease, firstXWords} from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'

// import yFav from '../images/bookmark-solid.svg'
// import nFav from '../images/bookmark-hollow.svg'

//Icon attribution: <a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>
// https://www.onlinewebfonts.com/icon/278814 hollow
// https://www.onlinewebfonts.com/icon/280568 solid

const fav = <FontAwesomeIcon icon={faHeart} />
// const fav = <FontAwesomeIcon icon={faBookmark} />
// const nFav = <FontAwesomeIcon icon={farFaBookmark} />

const FoodTile = props => {
  // Returns lower case version of incoming string with capital first letter
  // const sentenceCase = s => {
  //   if (s.length === 0) return ''
  //   return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()
  // }

  // Returns string with all words' first letters only capitalized, rest in lower case
  // const pascalCase = s => {
  //   if (s.length === 0) return ''
  //   return s
  //     .split(' ')
  //     .map(str => sentenceCase(str))
  //     .join(' ')
  // }

  useEffect(() => {
    console.log('props.location:')
    console.dir(props)
  }, [props])

  // prettier-ignore
  return <div className="foodTilesCont">
    {props.foodData && props.foodData.map((fd, i) => {
      return <section className={props.handleFavoriteClick} className={(props.favorites.indexOf(fd.fdcId)>-1 ? 'favorited' : 'unfavorited').concat(' foodTile')} key={i}>
      <table>
        <tbody>
          <tr>
            <td className="tileDetailTitle">{(props.currentPageNumber -1) * 50 + (i+1)}. <Link to={`/foodDetail/${fd.fdcId}`}>{quietPlease(fd.description)}</Link></td>
            <td className="tileDetailFavorite">{props.uLoggedIn ? (<button id={i} fdcid={fd.fdcId} key={i} onClick={props.handleFavoriteClick} className={(props.favorites.indexOf(fd.fdcId)>-1 ? 'favorited' : 'unfavorited').concat(' favoriteButton')} title={(props.origin==='favorites' ? 'Delete' : 'Set/delete as a') + ' favorite'}>{fav}</button>) : null}</td>
          </tr>
          {fd.gtinUpc ? (<tr> <td colSpan="2">UPC: {fd.gtinUpc}</td></tr>) : null}
          {fd.brandOwner ? (<tr><td colSpan="2">Brand: {quietPlease(fd.brandOwner)}</td></tr>) : null}
          {fd.ingredients ? (<tr><td colSpan="2">Ingredients: {firstXWords(sentenceCase(fd.ingredients), 3, ', ')}</td></tr>) : null}
          {fd.additionalDescriptions ? (<tr><td colSpan="2">Includes: {firstXWords(fd.additionalDescriptions, 3, '; ')}</td></tr>) : null}
        </tbody>
      </table>
      {/* <p>{props.uLoggedIn && (<button id={i} fdcid={fd.fdcId} key={i} onClick={props.handleFavoriteClick} className={(props.favorites.indexOf(fd.fdcId)>-1 ? 'favorited' : 'unfavorited').concat(' favoriteButton')} title="Set/reset as a favorite">{fav}</button>)} {(props.currentPageNumber -1) * 50 + (i+1)}. <Link to={`/foodDetail/${fd.fdcId}`}>{quietPlease(fd.description)}</Link></p> 
      {fd.gtinUpc && <p>GTIN/UPC: {fd.gtinUpc}</p>}
      {fd.brandOwner && <p>Brand: {quietPlease(fd.brandOwner)}</p>}
      {fd.ingredients && <p>Ingredients: {firstXWords(sentenceCase(fd.ingredients), 3, ', ')}</p>}
      {typeof fd.ingredients === 'undefined' && fd.additionalDescriptions && <p>Includes: {firstXWords(fd.additionalDescriptions, 3, '; ')}</p>} */}
    </section>})}
  </div>
}

export default FoodTile
