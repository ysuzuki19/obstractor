import { instant_validate, Obstract } from '../index';

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

describe('varisous type instant_transform', () => {
  test('valid:{name,body}', () => {
    const target = {
      name: 'bomb',
      body: {
        height: 170,
        weight: 60,
        foot: 26,
      },
    };
    const is_valid = instant_validate<Person>(person_obstract, target);
    expect(is_valid).toEqual(true);
  });
  test('valid:{name,body with nullable}', () => {
    const target = {
      name: 'bomb',
      body: {
        height: 170,
        weight: 60,
      },
    };
    const is_valid = instant_validate<Person>(person_obstract, target);
    expect(is_valid).toEqual(true);
  });
  test('valid:{name}, invalid:{body}', () => {
    const target = {
      name: 'bomb',
      body: {
        height: 170,
      },
    };
    const is_valid = instant_validate<Person>(person_obstract, target);
    expect(is_valid).toEqual(false);
  });
});
