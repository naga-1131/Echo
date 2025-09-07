"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Map,
  Bookmark,
  Shield,
  User,
  Search,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/search", icon: Search, label: "Search" },
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
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
