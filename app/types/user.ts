import { UserDao } from "~/.server/dao/user-dao";

export type User = Awaited<ReturnType<UserDao["login"]>>;
