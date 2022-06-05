// not supported [bigint]
type SupportedType = object | boolean | number | string;
type SupportedTypeName = 'object' | 'boolean' | 'number' | 'string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type validate_fn = (input: any) => [boolean, string];

export interface ObstractField {
  type: SupportedTypeName;
  validate?: validate_fn;
  nullable?: boolean;
  default?: SupportedType;
}

export interface Obstract {
  [key: string]: ObstractField;
}

export interface ObstractOptions {
  logging?: boolean;
}

export function instant_validate<T = unknown>(
  obstract: Obstract,
  target: object
): boolean {
  return new Obstractor<T>(obstract).validate(target);
}

export function instant_transform<T = unknown>(
  obstract: Obstract,
  target: object
): T {
  return new Obstractor<T>(obstract).transform(target);
}

export function instant_validate_transform<T = unknown>(
  obstract: Obstract,
  target: object
): T | undefined {
  return new Obstractor<T>(obstract).validate_transform(target);
}

export class Obstractor<T = unknown> {
  private readonly logging: boolean;

  constructor(private readonly obstract: Obstract, options?: ObstractOptions) {
    this.logging = options?.logging || false;
  }

  public validate(target: object): boolean {
    for (const [k, field] of Object.entries(this.obstract)) {
      const val = this.extract(target, k);

      if (field.nullable && val === undefined) continue;

      const [is_valid, msg] = this.check_field_is_valid(field, val);
      if (is_valid) {
      } else {
        this.log(`(target.${k} = ${val}) must to be ${msg}`);
        return false;
      }
    }

    return true;
  }

  public transform(target: object): T {
    const defaults = [];
    for (const [k, field] of Object.entries(this.obstract)) {
      const val = this.extract(target, k);

      if (
        val === undefined &&
        field.default !== undefined &&
        field.default !== null
      ) {
        defaults.push([k, field.default]);
      }
    }

    return { ...target, ...Object.fromEntries(defaults) } as T;
  }

  public validate_transform(target: object): T | undefined {
    if (this.validate(target)) {
      return this.transform(target);
    }
    return;
  }

  private extract(target: object, key: string): SupportedType | undefined {
    if (key in target) {
      return (target as never)[key];
    } else {
      return;
    }
  }

  private check_field_type(
    field: ObstractField,
    val: SupportedType | undefined
  ): boolean {
    const val_type = typeof val;
    return field.type === val_type;
  }

  private check_field_is_valid(
    field: ObstractField,
    val: SupportedType | undefined
  ): [boolean, string] {
    if (this.check_field_type(field, val)) {
      if (field.validate && val !== undefined) {
        return field.validate(val);
      } else {
        return [true, ''];
      }
    } else {
      return [false, field.type];
    }
  }

  private log(message?: unknown, ...optionalParams: unknown[]) {
    if (this.logging) {
      console.log('[Obstractor]', message, ...optionalParams);
    }
  }
}
