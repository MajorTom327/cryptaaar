import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ActionFunctionArgs, data, redirect } from "@remix-run/node";
import { z } from "zod";
import { UserDao } from "~/.server/dao/user-dao";

const formDataSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
      return false;
    }
    return true;
  });

export const RegisterRoute = () => {
  return (
    <Form
      method="post"
      action="/auth/register"
      className={"flex flex-col gap-2"}
    >
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />
      <Input
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
      />

      <div className="flex flex-row gap-2 w-full justify-end">
        <Button asChild variant={"link"}>
          <Link prefetch={"intent"} to="/auth/login" viewTransition>
            I already have an account
          </Link>
        </Button>
        <Button type="submit">Register</Button>
      </div>
    </Form>
  );
};

export default RegisterRoute;

export async function action({ request }: ActionFunctionArgs) {
  const requestBody = await request.clone().json();

  const formData = formDataSchema.safeParse(requestBody);
  if (!formData.success) {
    console.log("ERROR", formData.error.issues);
    return data(formData.error.issues, {
      status: 400,
    });
  }

  // * Save user to database
  const userDao = new UserDao();
  return await userDao
    .createUser(formData.data.email, formData.data.password)
    .then(() => {
      return redirect("/auth/login");
    });
}
