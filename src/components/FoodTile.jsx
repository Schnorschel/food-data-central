import React from 'react'
import { Link } from 'react-router-dom'
import { sentenceCase, pascalCaseExcept } from '../utils'
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
  // Returns a number that expresses the ratio between the count of
  // lower and upper case letters in string s.
  // If the returned number is greater than 0, there are more upper case
  // than lower case letters, vice versa if negative.
  // prettier-ignore
  const UpperToLowerCaseRatio = (s) => {
    return s.split('').reduce((total, letter) => {
      return (total += letter >= 'A' && letter <= 'Z' ? 1 : 
                       letter >= 'a' && letter <= 'z' ? -1 : 0)
    }, 0)
  }

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

  // Converts string into PascalCase if more than half of capitals are used
  const quietPlease = str => {
    return UpperToLowerCaseRatio(str) > 0 ? pascalCaseExcept(str, 2) : str
  }

  // Crops string of words delimited with delim after x words and
  // adds ellipsis (...) at the end if there is more content
  const firstXWords = (str, x, delim) => {
    return (
      str
        .split(delim)
        .filter((el, i) => {
          return i < x
        })
        .join(delim) + (str.split(delim).length > x ? delim + '...' : '')
    )
  }
  // prettier-ignore
  return <div className="foodTilesCont">
    {props.foodData && props.foodData.map((fd, i) => {
      return <section className="foodTile" key={i}>
                <table>
                  <tbody>
                    <tr>
                      <td className="tileDetailTitle">{(props.currentPageNumber -1) * 50 + (i+1)}. <Link to={`/foodDetail/${fd.fdcId}`}>{quietPlease(fd.description)}</Link></td>
                      <td className="tileDetailFavorite">{props.uLoggedIn && (<button id={i} fdcid={fd.fdcId} key={i} onClick={props.handleFavoriteClick} className={(props.favorites.indexOf(fd.fdcId)>-1 ? 'favorited' : 'unfavorited').concat(' favoriteButton')} title="Set/reset as a favorite">{fav}</button>)}</td>
                    </tr>
                    {fd.gtinUpc && <tr>
                      <td colSpan="2">GTIN/UPC: {fd.gtinUpc}</td>
                    </tr>}
                    {fd.brandOwner && <tr>
                      <td colSpan="2">Brand: {quietPlease(fd.brandOwner)}</td>
                    </tr>}
                    {fd.ingredients &&  <tr>
                          <td colSpan="2">Ingredients: {firstXWords(sentenceCase(fd.ingredients), 3, ', ')}</td>
                    </tr>}
                    {fd.additionalDescriptions && <tr>
                              <td colSpan="2">Includes: {firstXWords(fd.additionalDescriptions, 3, '; ')}</td>
                    </tr>}
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
