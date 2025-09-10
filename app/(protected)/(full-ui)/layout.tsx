'use client';

import { UIProvider } from '@/context/UIContext';
import FloatingActionManager from '@/components/FloatingActionManager';
import PageLayout from '@/components/PageLayout';
import ScrollToTop from '@/components/ScrollToTop';

export default function FullUILayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <UIProvider>
            <FloatingActionManager>
                <PageLayout>
                    {children}
                    <ScrollToTop />
                </PageLayout>
            </FloatingActionManager>
        </UIProvider>
    );
}