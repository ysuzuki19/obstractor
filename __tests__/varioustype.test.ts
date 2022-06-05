import { instant_validate_transform, Obstract } from '../index';

// interface Person {
//   name: string;
//   age: number;
//   living?: boolean;
//   memo: object;
// }

describe('varisous type instant_transform', () => {
  const person_obstract: Obstract = {
    name: {
      type: 'string',
      validate: (input: string) => [0 < input.length, 'non-empty'],
      nullable: false,
    },
    age: {
      type: 'number',
      validate: (input: number) => [0 <= input, 'over-zero'],
    },
    living: {
      type: 'boolean',
      nullable: true,
      default: true,
    },
    memo: {
      type: 'object',
    },
  };

  test('valid:{name,age}', () => {
    const target = {
      name: 'bomb',
      age: 25,
      memo: {},
    };
    const transformed = instant_validate_transform(person_obstract, target);
    expect(transformed).toEqual({
      name: 'bomb',
      age: 25,
      living: true,
      memo: {},
    });
  });
});
