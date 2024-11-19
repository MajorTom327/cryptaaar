import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Form, Link } from "@remix-run/react";
import { PropsWithChildren } from "react";
import {
  ArrowLeftRight,
  BookCheck,
  BookUser,
  ChartNoAxesCombined,
  Cog,
  LayoutDashboard,
  LogOut,
  Mailbox,
  Palette,
  UserRound,
} from "lucide-react";
import { useUser } from "~/hooks/use-user";

type LinkItemProps = PropsWithChildren<{
  to: string;
  icon?: React.ReactNode;
}>;

const LinkItem: React.FC<LinkItemProps> = ({ to, icon, children }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link prefetch="intent" to={to}>
          {icon}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  return (
    <Sidebar collapsible={"icon"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <LinkItem icon={<LayoutDashboard />} to="/">
                Dashboard
              </LinkItem>
              <LinkItem icon={<ChartNoAxesCombined />} to="/portfolio">
                Portfolio
              </LinkItem>
              <LinkItem icon={<Palette />} to="/nfts">
                NFTs
              </LinkItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <LinkItem icon={<ArrowLeftRight />} to="/transactions">
                Transactions
              </LinkItem>
              <LinkItem icon={<BookCheck />} to="/contracts">
                Contracts
              </LinkItem>
              <LinkItem icon={<BookUser />} to="/contacts">
                Contacts
              </LinkItem>
              <LinkItem icon={<Mailbox />} to="/addresses">
                Addresses
              </LinkItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <LinkItem icon={<UserRound />} to="/profile">
                Account
              </LinkItem>
              <LinkItem icon={<Cog />} to="/settings">
                Settings
              </LinkItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserConnectionButton />
      </SidebarFooter>
    </Sidebar>
  );
}

export const UserConnectionButton: React.FC = () => {
  const user = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Form method="post" action="/logout">
          <SidebarMenuButton type={"submit"}>
            <LogOut />
            <span>{user?.ens ?? user?.address ?? "Log out"}</span>
          </SidebarMenuButton>
        </Form>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
