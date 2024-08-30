const onlyLetterAndNumberRegex = new RegExp(/[^a-zA-Z0-9]/g)

export function clearString(text: string) {
  return text.replace(onlyLetterAndNumberRegex, '');
}
