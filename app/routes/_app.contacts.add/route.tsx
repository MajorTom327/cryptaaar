import { useFetcher } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AddContactFormData, resolverAddContact } from "./resolver";

export const ContactAddRoute = () => {
  const fetcher = useFetcher();

  const form = useRemixForm<AddContactFormData>({
    mode: "onBlur",
    fetcher,
    resolver: resolverAddContact,
    submitConfig: {
      replace: true,
      method: "POST",
    },
  });

  return (
    <>
      <RemixFormProvider {...form}>
        {/* @ts-expect-error typing */}
        <Form {...form}>
          <fetcher.Form method="post" onSubmit={form.handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Add contact</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Wallet Address"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Add</Button>
              </CardFooter>
            </Card>
          </fetcher.Form>
        </Form>
      </RemixFormProvider>
    </>
  );
};

export default ContactAddRoute;
