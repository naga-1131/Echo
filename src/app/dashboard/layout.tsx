
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
import { EchoSyncLogo } from '@/components/icons';
import Header from './components/header';
import MainNav from './components/main-nav';
import { PostsProvider } from './components/posts-provider';
import { UserProvider, useUser } from './components/user-provider';
import SidebarUser from './components/sidebar-user';
import { NotificationsProvider } from './components/notifications-provider';
import { WasteReportsProvider } from './map/components/waste-reports-provider';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  // While loading, render nothing or a loading spinner
  if (loading || !user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center gap-2">
          <EchoSyncLogo className="size-8 shrink-0 text-primary" />
          <span className="text-lg font-semibold font-headline text-primary">EchoSync</span>
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
    <UserProvider>
        <NotificationsProvider>
        <PostsProvider>
            <WasteReportsProvider>
                <ProtectedLayout>{children}</ProtectedLayout>
            </WasteReportsProvider>
        </PostsProvider>
        </NotificationsProvider>
    </UserProvider>
  );
}
