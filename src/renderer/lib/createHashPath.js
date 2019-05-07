export default str => {
  const hash = new Date().getTime()
  if (str.includes('#')) {
    return str.split('#')[0] + '#' + hash
  } else {
    return str + '#' + hash
  }
}
