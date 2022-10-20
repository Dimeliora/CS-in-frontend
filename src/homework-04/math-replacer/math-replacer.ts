export default class MathReplacer {
  static #mathRegexp: RegExp = /\(*-?\d+( [\\\-+*]+ \(*-?\d+\)*)+/g;

  static #mathReplaceFunction(match: string): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      return new Function('', `{ return ${match}; }`)();
    } catch (error) {
      throw new SyntaxError('Inappropriate math expression found');
    }
  }

  static calculate(string: string): string {
    return string.replace(MathReplacer.#mathRegexp, MathReplacer.#mathReplaceFunction);
  }
}
