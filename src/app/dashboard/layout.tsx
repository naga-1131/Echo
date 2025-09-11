
import React from 'react';
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
import SidebarUser from './components/sidebar-user';
import { NotificationsProvider } from './components/notifications-provider';
import { WasteReportsProvider } from './map/components/waste-reports-provider';
import ProtectedLayout from './components/protected-layout';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
        <WasteReportsProvider>
            <ProtectedLayout>
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
            </ProtectedLayout>
        </WasteReportsProvider>
    </NotificationsProvider>
  );
}
