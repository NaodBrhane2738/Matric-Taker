import { NextResponse } from 'next/server';
import { generateProductionTurnstileToken } from '../../../../../lib/server/turnstile';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { isTrusted, webdriver, clickDeltaMs, mouseMoveCount, clientTimestamp, honeypot } = body;

    // Reject immediately if honeypot trap triggered
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: 'Automated agent activity detected. Access permanently denied.' },
        { status: 403 }
      );
    }

    const outcome = generateProductionTurnstileToken({
      isTrusted: Boolean(isTrusted),
      webdriver: Boolean(webdriver),
      clickDeltaMs: typeof clickDeltaMs === 'number' ? clickDeltaMs : 0,
      mouseMoveCount: typeof mouseMoveCount === 'number' ? mouseMoveCount : 0,
      clientTimestamp: typeof clientTimestamp === 'number' ? clientTimestamp : Date.now(),
    });

    if (!outcome.success) {
      return NextResponse.json(
        { success: false, error: outcome.error || 'Human verification failed' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      token: outcome.token,
    });
  } catch (err) {
    console.error('[Turnstile Challenge API Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Challenge generation failed' },
      { status: 500 }
    );
  }
}
