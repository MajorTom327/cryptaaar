import { ActionFunctionArgs, data, redirect } from "react-router";
import { Form, Link } from "react-router";
import { z } from "zod";
import { UserDao } from "~/.server/dao/user-dao";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { formDataToObject } from "~/lib/formDataToObject";
import { EmailTooltip } from "./email-tooltip";

const formDataSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
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
      <div className="flex flex-col gap-2">
        <EmailTooltip>
          <Label>Email</Label>
        </EmailTooltip>
        <Input name="email" type="email" placeholder="Email" />
      </div>
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
  const requestBody = await request.clone().formData();

  const formData = formDataSchema.safeParse(formDataToObject(requestBody));
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
