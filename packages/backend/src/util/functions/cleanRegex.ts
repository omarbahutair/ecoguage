export function cleanRegex(regex: string): string {
  const specialCharacters = [
    '\\',
    '.',
    '+',
    '*',
    '?',
    '^',
    '$',
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    '|',
  ];

  for (let i = 0; i < specialCharacters.length; i += 1) {
    const specialCharacter = specialCharacters[i];

    regex = regex.replaceAll(specialCharacter, `\\${specialCharacter}`);
  }

  return regex;
}
