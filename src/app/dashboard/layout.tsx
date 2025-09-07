
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { EcoNexusLogo } from '@/components/icons';
import Header from './components/header';
import MainNav from './components/main-nav';
import { PostsProvider } from './components/posts-provider';
import { UserProvider } from './components/user-provider';
import SidebarUser from './components/sidebar-user';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <PostsProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="flex items-center gap-2">
              <EcoNexusLogo className="size-8 shrink-0 text-primary" />
              <span className="text-lg font-semibold font-headline text-primary">EcoNexus</span>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              <SidebarUser />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </PostsProvider>
    </UserProvider>
  );
}
