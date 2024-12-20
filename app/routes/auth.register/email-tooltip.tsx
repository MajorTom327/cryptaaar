import { Info } from "lucide-react";
import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const EmailTooltip: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-row gap-2 items-center">
          {children}
          <Info className="size-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[500px]">
        <h1 className="text-lg font-bold">
          This informations is stored securely
        </h1>
        <p>
          This is only used to simplify the login process. It's hashed as soon
          as your account is created (Never saved in clear). We don't have any
          use for your email except connecting to the app. Would be useless to
          store it.
        </p>

        <div className="flex flex-col gap-2 items-center mt-8">
          <p>
            Sceptical? Want more technical stuff ? We hash your email using
            SHA256. It ensure your data is unreadable after being stored. It's
            the same technology that power most of the password storage!
          </p>
          <Button asChild size="sm" variant="accent">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://en.wikipedia.org/wiki/SHA-2"
            >
              Learn more on wikipedia
            </a>
          </Button>

          <p>Here is the code for hashing:</p>
          <pre className="font-mono bg-background text-foreground p-2 rounded-md">
            {`crypto.createHash("sha256").update(email).digest("hex");`}
          </pre>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
