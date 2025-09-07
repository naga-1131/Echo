

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useUser } from './components/user-provider';
import SidebarUser from './components/sidebar-user';
import { NotificationsProvider } from './components/notifications-provider';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If there's no user and we are not on the server, redirect to login.
    // The check `typeof window !== 'undefined'` is to prevent this from running during SSR.
    if (typeof window !== 'undefined' && !user) {
      router.push('/');
    }
  }, [user, router]);
  
  // Render nothing or a loading spinner while checking for user
  if (!user) {
    return null; 
  }

  return (
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
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <PostsProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </PostsProvider>
    </NotificationsProvider>
  );
}
