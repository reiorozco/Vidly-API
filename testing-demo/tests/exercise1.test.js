const { fizzBuzz } = require("../exercise1");

describe("fizzBuzz", () => {
  it("should throw an exception if input isn't a number", () => {
    expect(() => fizzBuzz("string")).toThrow();
    expect(() => fizzBuzz(true)).toThrow();
    expect(() => fizzBuzz(undefined)).toThrow();
    expect(() => fizzBuzz({})).toThrow();
  });

  it("should return FizzBuzz if number is divisible by 3 and 5", () => {
    const result = fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if number is divisible only by 3", () => {
    const result = fizzBuzz(6);
    expect(result).toBe("Fizz");
  });

  it("should return Buzz if number is divisible only by 5", () => {
    const result = fizzBuzz(10);
    expect(result).toBe("Buzz");
  });

  it("should return input if number isn't divisible by 3 or 5", () => {
    const result = fizzBuzz(4);
    expect(result).toBe(4);
  });
});
