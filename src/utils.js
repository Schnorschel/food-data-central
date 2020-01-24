// Returns lower case version of incoming string with capital first letter
const sentenceCase = s => {
  if (s.length === 0) return ''
  return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()
}

// prettier-ignore
const sentencesCase = s => {
  if (s.length === 0) return ''
  return s.split('. ').map(el => sentenceCase(el)).join('. ')
}

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

export { sentenceCase, pascalCaseExcept, quietPlease, UpperToLowerCaseRatio }
