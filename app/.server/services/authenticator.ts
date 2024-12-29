import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import { UserDao } from "~/.server/dao/user-dao";
import type { User } from "~/types";

export const authenticator = new Authenticator<User>();

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
  "user-pass"
);
