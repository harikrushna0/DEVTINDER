const { validateSignupData } = require("./validation");

// Helper to build a fake Express request with the given body.
const makeReq = (body) => ({ body });

describe("validateSignupData", () => {
  const validBody = {
    firstName: "Alice",
    lastName: "Anderson",
    emailId: "alice@example.com",
    password: "StrongPass1!",
  };

  test("accepts a fully valid signup payload without throwing", () => {
    expect(() => validateSignupData(makeReq(validBody))).not.toThrow();
  });

  test("rejects a payload that is missing the last name", () => {
    const req = makeReq({ ...validBody, lastName: undefined });
    expect(() => validateSignupData(req)).toThrow(
      "First name and Last name are required"
    );
  });

  test("rejects a payload with an invalid email address", () => {
    const req = makeReq({ ...validBody, emailId: "not-an-email" });
    expect(() => validateSignupData(req)).toThrow("Invalid Email ID");
  });
});
