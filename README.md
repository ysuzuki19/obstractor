# validate and transform library for Object

## Basic Usage

```typescript
import { Obstract, Obstractor } from 'obstractor';

interface Person {
  name: string;
  age: number;
}

const person_obstract: Obstract = {
  name: { type: 'string' },
  age: { type: 'number', nullable: true, default: 0 },
};

const obstractor = new Obstractor<Person>(person_obstract, {
  logging: false,
});

const target_with_age = { name: 'bomb', age: 2 };
const is_valid = obstractor.validate(target_with_age);

const target_without_age = { name: 'bomb' };
const is_valid = obstractor.validate(target_without_age);
// ok because "age" is nullable

if (is_valid) {
  const transformed = obstractor.transform(target_with_age);
  // set default value(0) on "age"
  // {name: "bomb", age: 0}
}
```

## Supported Type

`string`, `number`, `object`, `boolean`

## Instant Use

You can call abstractor-api more instantly.

```typescript
const is_valid = instant_validate(obstract, target);
// return valid_or_not

const transformed = instant_transform(obstract, valid_target);
// return transformed from validated target

const transformed = instant_validate_transform(obstract, target);
// return transformed if valid
// return undefined if invalid
```

## Advanced

### Functional Condition

You can add condition by using function

```typescript
const person_obstract: Obstract = {
  name: { type: 'string', nullable: false },
  age: {
    type: 'number',
    validate: (input: number) => [0 <= input, 'over-zero'], // second value is message for invalid log
    nullable: true,
    default: 0,
  },
};

const obstractor = new Obstractor<Person>(person_obstract, {
  logging: false,
});

const target_with_age = { name: 'bomb', age: 2 };
const is_valid = obstractor.validate(target);

const target_without_age = { name: 'bomb' };
const is_valid = obstractor.validate(target);
// ok because "age" is nullable

if (is_valid) {
  const transformed = obstractor.transform(target);
  // set default value(0) on "age"
  // {name: "bomb", age: 0}
}
```

### Nested Obstract

```typescript
import { instant_validate, Obstract } from 'obstractor';

interface Body {
  height: number;
  weight: number;
  foot?: number;
}

const body_obstract: Obstract = {
  height: {
    type: 'number',
    validate: (input: number) => [0 < input, 'over-zero'],
  },
  weight: {
    type: 'number',
    validate: (input: number) => [0 < input, 'over-zero'],
  },
  foot: {
    type: 'number',
    nullable: true,
  },
};

interface Person {
  name: string;
  age: number;
  body: Body;
}

const person_obstract: Obstract = {
  name: {
    type: 'string',
    validate: (input: string) => [0 < input.length, 'non-empty'],
    nullable: false,
  },
  body: {
    type: 'object',
    validate: (input: object) => [
      instant_validate<Body>(body_obstract, input),
      'body',
    ],
  },
};

const target = {
  name: 'bomb',
  body: {
    height: 170,
    weight: 60,
  },
};
const is_valid = instant_validate<Person>(person_obstract, target);
// is true
```
