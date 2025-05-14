import { NextRequest, NextResponse } from 'next/server';
import { fetchStock } from '@/lib/yahoo';

export async function GET(
  _req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const data = await fetchStock(params.symbol.toUpperCase());
    return NextResponse.json(data);
  } catch (e) {
    console.error('Yahoo error:', e);
    return NextResponse.json(
      { error: 'Ticker not found' },
      { status: 404 }
    );
  }
}