import type { PropsWithChildren } from "react";
import { AppSidebar } from "~/components/app-layout/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppNavbar } from "./app-navbar";

type Props = PropsWithChildren;

export const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className={"flex flex-col w-full "}>
        <AppNavbar />

        <div className={"grow w-full h-full p-4"}>{children}</div>
      </main>
    </SidebarProvider>
  );
};
