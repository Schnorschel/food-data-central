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
export { sentenceCase, pascalCaseExcept }
