
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./user-provider";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
