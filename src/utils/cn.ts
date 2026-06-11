type ClassValue = false | null | string | undefined;

export const cn = (...classes: ClassValue[]) =>
  classes.filter(Boolean).join(' ');
