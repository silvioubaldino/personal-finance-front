'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import SimpleMenu from "@/app/shared/components/simplemenu/ui/simplemenu";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <>
            {!isLoginPage && <SimpleMenu />}
            {children}
        </>
    );
};

export default AuthLayout;