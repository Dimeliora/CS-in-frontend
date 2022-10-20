export const isAlphanumericAndDollar = (string: string): boolean => /^[\w$]+$/g.test(string);

export const splitBy = (string: string): string[] => string.split(/[.,;]| +/g);

export const format = <T extends {}>(template: string, data: T): string =>
  template.replace(/\$\{(\w+)}/g, (_, group: string) => data[group]);

export const cleanupRepeatingGroups = (string: string): string => string.replace(/(\w{1,3}?)\1+/g, '$1');
