import { redirect, useFetcher } from "react-router";
import {
  getValidatedFormData,
  RemixFormProvider,
  useRemixForm,
} from "remix-hook-form";
import { ContactDao } from "~/.server/dao/contact-dao";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { ChainFormat } from "~/components/formatters/chain-format";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Route } from "./+types/route";
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
    defaultValues: {
      network: SimpleHashChain.ethereum,
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
                        <Textarea
                          {...field}
                          placeholder="An optional description of the contact"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
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
                  <FormField
                    control={form.control}
                    name="ens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ENS Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="ENS Name"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Network" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(SimpleHashChain).map((chain) => (
                              <SelectItem key={chain} value={chain}>
                                <ChainFormat chain={chain} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

export async function action({ request }: Route.ActionArgs) {
  const user = await preventNotConnected(request);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<AddContactFormData>(
    request,
    resolverAddContact
  );
  if (errors) {
    return {
      errors,
      defaultValues,
      success: false,
      message: "Invalid project",
    };
  }

  const contactDao = new ContactDao();

  await contactDao.createContact(user.id, data);

  return redirect("/contacts");
}
