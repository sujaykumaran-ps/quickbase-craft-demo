const maximum_choices = 50

export function validate (choicesArray) {

  const errors = { duplicateChoice: '', maxLimitError: '' }

  // Checks for duplicate Choices
  const duplicates = findDuplicates(choicesArray)
  if (duplicates.length !== 0) {
    errors.duplicateChoice = `* Duplicate Choices Found !!! Please Remove: ${duplicates.join(', ')}`
  }

  // Choice limit to 50
  if (choicesArray.length > maximum_choices) {
    errors.maxLimitError = `* You have entered ${choicesArray.length} choices (maximum of ${maximum_choices} allowed)`
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