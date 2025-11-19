import { NextRequest, NextResponse } from 'next/server';

const MOCK_DEBT_LEDGER = {
  total_debt: 24750,
  paid_off: 3250,
  remaining: 21500,
  revenue_today: 127,
  revenue_30d: 2847,
  community_contributions: 12,
  ai_research_hours: 847
};

export async function GET() {
  return NextResponse.json(MOCK_DEBT_LEDGER);
}
