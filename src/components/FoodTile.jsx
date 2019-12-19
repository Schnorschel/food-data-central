import React from 'react'
import { Link } from 'react-router-dom'

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
  const sentenceCase = s => {
    if (s.length === 0) return ''
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()
  }

  // Returns string with all words' first letters only capitalized, rest in lower case
  // const pascalCase = s => {
  //   if (s.length === 0) return ''
  //   return s
  //     .split(' ')
  //     .map(str => sentenceCase(str))
  //     .join(' ')
  // }

  // Capitalize each word in incoming string s, except words with length x or less
  const pascalCaseExcept = (s, x) => {
    return s
      .split(' ')
      .map(m => {
        return m.length <= x ? m : sentenceCase(m)
      })
      .join(' ')
  }

  // Converts string into PascalCase if more than half of capitals are used
  const quietPlease = str => {
    return UpperToLowerCaseRatio(str) > 0 ? pascalCaseExcept(str, 2) : str
  }

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
      return <section className="foodTile" key={i}><p>{(props.currentPageNumber -1) * 50 + (i+1)}. <Link to={`/foodDetail/${fd.fdcId}`}>{quietPlease(fd.description)}</Link></p> 
                {fd.gtinUpc && <p>GTIN/UPC: {fd.gtinUpc}</p>}
                {fd.brandOwner && <p>Brand: {quietPlease(fd.brandOwner)}</p>}
                {fd.ingredients && <p>Ingredients: {firstXWords(sentenceCase(fd.ingredients), 3, ', ')}</p>}
                {typeof fd.ingredients === 'undefined' && fd.additionalDescriptions && <p>Description: {firstXWords(fd.additionalDescriptions, 3, '; ')}</p>}
             </section>})}
  </div>
}

export default FoodTile