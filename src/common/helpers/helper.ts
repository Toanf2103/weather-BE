export const capitalizeName = (name: string): string => {
  if (!name) return ''
  return name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const convertToTitleCase = (inputString: string): string => {
  const formattedText = inputString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, char => char.toLowerCase())

  return formattedText.charAt(0).toUpperCase() + formattedText.slice(1)
}
