/* eslint-disable no-constant-condition */
function normalizeWildcardTemplate(template: string): string {
  return template.replace(/(?<=\*{2})(.\*)+|(\*.)+(?=\*{2})/g, '');
}

export default function wildcardMatcher(targetString: string, template: string, delimiter: string): boolean {
  const target = targetString.split(delimiter);
  const key = normalizeWildcardTemplate(template).split(delimiter);

  let state: 'regular' | 'deep' = 'regular';
  const keyIter = key[Symbol.iterator]();
  const targetIter = target[Symbol.iterator]();

  let keyResult = keyIter.next();
  let targetResult = targetIter.next();

  while (true) {
    switch (state) {
      case 'deep':
        if (targetResult.value === keyResult.value) {
          targetResult = targetIter.next();
          keyResult = keyIter.next();
          state = 'regular';
          break;
        }

        targetResult = targetIter.next();
        if (targetResult.done) return false;
        break;

      default:
        if (keyResult.value === '**') {
          keyResult = keyIter.next();
          if (keyResult.done) return true;

          state = 'deep';
          break;
        }

        if (keyResult.value !== targetResult.value && keyResult.value !== '*') return false;

        keyResult = keyIter.next();
        targetResult = targetIter.next();

        if (keyResult.value === '**') break;
        if (targetResult.done && keyResult.done) return true;
        if (targetResult.done || keyResult.done) return false;
    }
  }
}
