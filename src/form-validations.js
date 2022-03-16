const MAX_CHOICES = 50

export function validate (choicesArray) {

  const errors = { duplicatesError: '', choicesError: '', lengthError: '' }

  // Checks for duplicate Choices
  const duplicates = findDuplicates(choicesArray)
  if (duplicates.length !== 0) {
    errors.duplicatesError = `* Duplicate choices are not allowed. Please remove the following duplicates: ${duplicates.join(', ')}`
  }

  // Choice limit to 50
  if (choicesArray.length > MAX_CHOICES) {
    errors.choicesError = `* You have entered ${choicesArray.length} choices (maximum of ${MAX_CHOICES} allowed). Please delete ${choicesArray.length - MAX_CHOICES} before saving. Note: Default Choice should not be deleted.`
  }

  return errors
}

// Find duplicate entries
function findDuplicates (choicesArray) {
  const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

  const duplicates = choicesArrayLowerCase.reduce(function (acc, curr, index, srcArr) {
    if (srcArr.indexOf(curr) !== index && acc.indexOf(curr) < 0) acc.push(curr)
    return acc
  }, [])
  return duplicates
}