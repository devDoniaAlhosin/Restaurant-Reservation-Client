import { DateValidatorPipe } from './date-validator.pipe';

describe('DateValidatorPipe', () => {
  it('create an instance', () => {
    const pipe = new DateValidatorPipe();
    expect(pipe).toBeTruthy();
  });
});
