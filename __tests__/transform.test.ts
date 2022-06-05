import {
  instant_validate,
  instant_validate_transform,
  Obstract,
  Obstractor,
} from '../index';

interface Person {
  name: string;
  age: number;
}

describe('standart obstract.transform', () => {
  const person_obstract: Obstract = {
    name: { type: 'string', nullable: false },
    age: { type: 'number', nullable: true, default: 0 },
  };

  let obstractor: Obstractor<Person>;

  beforeEach(() => {
    obstractor = new Obstractor<Person>(person_obstract, {
      logging: false,
    });
  });

  test('valid:{name,age}', () => {
    const target = { name: 'bomb', age: 2 };
    if (obstractor.validate(target)) {
      const transformed = obstractor.transform(target);
      expect(target).toEqual({ name: 'bomb', age: 2 });
      expect(transformed).toEqual({ name: 'bomb', age: 2 });
    }
  });

  test('valid:{name}', () => {
    const target = { name: 'bomb' };
    if (obstractor.validate(target)) {
      const transformed = obstractor.transform(target);
      expect(target).toEqual({ name: 'bomb' });
      expect(transformed).toEqual({ name: 'bomb', age: 0 });
    }
  });
});

describe('instant transform', () => {
  const person_obstract: Obstract = {
    name: { type: 'string', nullable: false },
    age: {
      type: 'number',
      validate: (input: number) => [0 <= input, 'number and over-zero'],
      nullable: true,
      default: 0,
    },
  };

  test('valid:{name,age}', () => {
    const target = { name: 'bomb', age: 25 };
    const is_valid = instant_validate(person_obstract, target);
    expect(is_valid).toBe(true);
  });

  test('valid:{name}', () => {
    const target = { name: 'bomb' };
    const transformed = instant_validate_transform<Person>(
      person_obstract,
      target
    );
    expect(target).toEqual({ name: 'bomb' });
    expect(transformed).toEqual({ name: 'bomb', age: 0 });
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'bomb', age: -1 };
    const transformed = instant_validate_transform<Person>(
      person_obstract,
      target
    );
    expect(target).toEqual({ name: 'bomb', age: -1 });
    expect(transformed).toEqual(undefined);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'bomb', age: '0' };
    const transformed = instant_validate_transform<Person>(
      person_obstract,
      target
    );
    expect(target).toEqual({ name: 'bomb', age: '0' });
    expect(transformed).toEqual(undefined);
  });
});
