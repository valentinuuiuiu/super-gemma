
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the layout to avoid server-side issues with window/animations initially if needed,
// though standard react components are fine.
const AgentLayout = dynamic(() => import('../components/AgentLayout'), { ssr: false });

export default function AgentPage() {
  return <AgentLayout />;
}
