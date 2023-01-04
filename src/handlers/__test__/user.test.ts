import * as user from "../user";

describe("user handler", () => {
  /* it("should do something when something happens", () => {
    expect(1).toEqual(1);
  }); */

  it("should create new user", async () => {
    const req = { body: { username: "hel", password: "world" } };
    const res = {
      // @ts-ignore
      json({ token }) {
        console.log({ token });

        expect(token).toBeTruthy();
      },
    };
    // @ts-ignore
    const newUser = await user.createNewUser(req, res, () => {});
  });
});
