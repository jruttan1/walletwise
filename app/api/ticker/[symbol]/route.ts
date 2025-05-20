import { NextRequest, NextResponse } from 'next/server';
import { fetchChart, fetchStock } from '@/lib/yahoo';
import { askSonar } from '@/lib/sonar';
import type { ChartResult, QuoteSummaryResult } from '@/lib/yahoo';

export async function GET(
  _req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = (await params.symbol).toUpperCase();
  try {

    // Fetch API response from Yahoo
    const { quote, chart } = await fetchStock(symbol);

    // Fetch API response from Sonar
    const explanation = await askSonar(
      `Explain today's price move for ${symbol} in two sentences with citations.`
    );

    // Return JSON from API
    return NextResponse.json({ quote, chart, explanation });
  } catch (e: any) {
    console.error('error', e);
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}