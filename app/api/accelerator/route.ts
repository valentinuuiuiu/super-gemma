import { NextRequest, NextResponse } from 'next/server';

const TEMPLATES = {
  'marketplace': {
    name: 'Piata-Style Marketplace',
    revenue: 'Subscription + 2% txn fee',
    tech: 'Next.js 14 + Supabase + Stripe',
    time: '3 days',
    price: '$2,997'
  },
  'dropship': {
    name: 'Automated Dropshipping',
    revenue: 'Product margins 30-50%',
    tech: 'Django + Shopify API',
    time: '2 days', 
    price: '$1,497'
  },
  'course': {
    name: 'AI Course Platform',
    revenue: 'One-time + recurring',
    tech: 'Next.js + Gumroad',
    time: '1 day',
    price: '$997'
  }
};

export async function POST(request: NextRequest) {
  const { template } = await request.json();
  
  if (!TEMPLATES[template]) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }
  
  // Generate invoice / deployment URL / etc
  const invoiceId = `SG-${Date.now()}`;
  
  return NextResponse.json({
    success: true,
    template: TEMPLATES[template],
    next_steps: [
      '1. Stripe checkout',
      '2. Repo cloned + deployed',
      '3. Custom config applied',
      '4. Revenue live in 24h'
    ],
    invoice_id: invoiceId
  });
}
