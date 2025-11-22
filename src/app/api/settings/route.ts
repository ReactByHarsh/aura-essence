import { NextRequest, NextResponse } from 'next/server';
import { getShippingConfig, getCODConfig, getDefaultPrices } from '@/lib/neon/settings';

/**
 * GET /api/settings
 * Returns site-wide configuration settings
 */
export async function GET(request: NextRequest) {
    try {
        const type = request.nextUrl.searchParams.get('type');

        // Return specific setting type if requested
        if (type === 'shipping') {
            const config = await getShippingConfig();
            return NextResponse.json({ success: true, data: config });
        }

        if (type === 'cod') {
            const config = await getCODConfig();
            return NextResponse.json({ success: true, data: config });
        }

        if (type === 'prices') {
            const prices = await getDefaultPrices();
            return NextResponse.json({ success: true, data: prices });
        }

        // Return all settings
        const [shipping, cod, prices] = await Promise.all([
            getShippingConfig(),
            getCODConfig(),
            getDefaultPrices()
        ]);

        return NextResponse.json({
            success: true,
            data: {
                shipping,
                cod,
                prices
            }
        });
    } catch (error) {
        console.error('Settings API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}
