// app/providers.tsx
'use client';

import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useSession } from '@/lib/auth-client';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { env } from '@/lib/env';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
    try {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
      });
    } catch (error) {
      console.error('Error initializing PostHog:', error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    }
  }, [session]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
