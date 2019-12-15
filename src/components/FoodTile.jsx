import React from 'react'

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

  const PascalCase = s => {
    if (s.length === 0) return ''
    return s
      .split(' ')
      .map(str => sentenceCase(str))
      .join(' ')
  }

  const capitalWords = s => {
    return s
      .split(' ')
      .map(m => sentenceCase(m))
      .join(' ')
  }
  //
  const deScream = str => {
    return UpperToLowerCaseRatio(str) > 0
      ? PascalCase(str.toLowerCase())
      : capitalWords(str)
  }

  const firstXWords = (str, x) => {
    return (
      str
        .split(', ')
        .filter((el, i) => {
          return i < x
        })
        .join(', ') + ', ...'
    )
  }
  // prettier-ignore
  return <div className="foodTilesCont">
    {props.foodData && props.foodData.map((fd, i) => {
      return <section className="foodTile" key={i}><p>{deScream(fd.description)}</p> 
                {fd.gtinUpc && <p>UPC: {fd.gtinUpc}</p>}
                {fd.brandOwner && <p>Brand: {deScream(fd.brandOwner)}</p>}
                {fd.ingredients && <p>Ingredients: {firstXWords(sentenceCase(fd.ingredients),5)}</p>}
             </section>})}
  </div>
}

export default FoodTile
