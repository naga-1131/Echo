
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Map,
  Bookmark,
  Shield,
  User,
  Search,
  Bot,
  Bell,
  Mail,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/search", icon: Search, label: "Search" },
  { href: "/dashboard/messages", icon: Mail, label: "Messages" },
  { href: "/dashboard/eco-ai", icon: Bot, label: "Eco AI" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/communities", icon: Users, label: "Communities" },
  { href: "/dashboard/map", icon: Map, label: "Waste Map" },
  { href: "/dashboard/saved", icon: Bookmark, label: "Saved Posts" },
  { href: "/dashboard/moderation", icon: Shield, label: "Moderation" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
