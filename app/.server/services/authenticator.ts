import { User } from "~/types";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session-service";
import { FormStrategy } from "remix-auth-form";
import { UserDao } from "~/.server/dao/user-dao";
import { z } from "zod";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const user = z
      .object({
        email: z.string(),
        password: z.string(),
      })
      .parse(Object.fromEntries(form.entries()));

    const userDao = new UserDao();

    return userDao.login(user.email, user.password).then((user) => {
      if (!user) throw new Error("Invalid credentials");
      return user;
    });
  }),
  "user-pass",
);
