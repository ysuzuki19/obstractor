import { instant_validate, Obstract, Obstractor } from '../index';
interface Person {
  name: string;
  age: number;
}

describe('standart obstract.validate', () => {
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
    const target = { name: 'yuya', age: 2 };
    expect(obstractor.validate(target)).toBe(true);
  });

  test('valid:{name}', () => {
    const target = { name: 'yuya' };
    expect(obstractor.validate(target)).toBe(true);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'yuya', age: '0' };
    expect(obstractor.validate(target)).toBe(false);
  });
});

describe('functional-validated obstract.validate', () => {
  const person_obstract: Obstract = {
    name: { type: 'string', nullable: false },
    age: {
      type: 'number',
      validate: (input: number) => [0 <= input, 'number and over-zero'],
      nullable: true,
      default: 0,
    },
  };

  let obstractor: Obstractor<Person>;

  beforeEach(() => {
    obstractor = new Obstractor<Person>(person_obstract, {
      logging: false,
    });
  });

  test('valid:{name,age}', () => {
    const target = { name: 'yuya', age: 25 };
    expect(obstractor.validate(target)).toBe(true);
  });

  test('valid:{name}', () => {
    const target = { name: 'yuya' };
    expect(obstractor.validate(target)).toBe(true);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'yuya', age: -1 };
    expect(obstractor.validate(target)).toBe(false);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'yuya', age: '0' };
    expect(obstractor.validate(target)).toBe(false);
  });
});

describe('instant validate.validate', () => {
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
    const target = { name: 'yuya', age: 25 };
    const is_valid = instant_validate(person_obstract, target);
    expect(is_valid).toBe(true);
  });

  test('valid:{name}', () => {
    const target = { name: 'yuya' };
    const is_valid = instant_validate(person_obstract, target);
    expect(is_valid).toBe(true);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'yuya', age: -1 };
    const is_valid = instant_validate(person_obstract, target);
    expect(is_valid).toBe(false);
  });

  test('valid:{name},invalid:{age}', () => {
    const target = { name: 'yuya', age: '0' };
    const is_valid = instant_validate(person_obstract, target);
    expect(is_valid).toBe(false);
  });
});
