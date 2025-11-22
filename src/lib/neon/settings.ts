import { sql } from './db';

export interface ShippingConfig {
    free_shipping_threshold: number;
    standard_shipping_charge: number;
    currency: string;
}

export interface CODConfig {
    amount: number;
    currency: string;
}

export interface DefaultPrices {
    '20ml': number;
    '50ml': number;
    '100ml': number;
}

/**
 * Get shipping configuration from database
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
    try {
        const result = await sql`
      SELECT value FROM public.site_settings WHERE key = 'shipping_config'
    `;

        if (result && result.length > 0) {
            return result[0].value as ShippingConfig;
        }

        // Fallback to default values
        return {
            free_shipping_threshold: 400,
            standard_shipping_charge: 40,
            currency: 'INR'
        };
    } catch (error) {
        console.error('Error fetching shipping config:', error);
        // Return defaults on error
        return {
            free_shipping_threshold: 400,
            standard_shipping_charge: 40,
            currency: 'INR'
        };
    }
}

/**
 * Get COD charge configuration from database
 */
export async function getCODConfig(): Promise<CODConfig> {
    try {
        const result = await sql`
      SELECT value FROM public.site_settings WHERE key = 'cod_charge'
    `;

        if (result && result.length > 0) {
            return result[0].value as CODConfig;
        }

        // Fallback to default values
        return {
            amount: 49,
            currency: 'INR'
        };
    } catch (error) {
        console.error('Error fetching COD config:', error);
        return {
            amount: 49,
            currency: 'INR'
        };
    }
}

/**
 * Get default product prices by size from database
 */
export async function getDefaultPrices(): Promise<DefaultPrices> {
    try {
        const result = await sql`
      SELECT value FROM public.site_settings WHERE key = 'default_prices'
    `;

        if (result && result.length > 0) {
            return result[0].value as DefaultPrices;
        }

        // Fallback to default values
        return {
            '20ml': 269,
            '50ml': 499,
            '100ml': 699
        };
    } catch (error) {
        console.error('Error fetching default prices:', error);
        return {
            '20ml': 269,
            '50ml': 499,
            '100ml': 699
        };
    }
}

/**
 * Calculate shipping charge based on subtotal
 */
export async function calculateShipping(subtotal: number): Promise<number> {
    const config = await getShippingConfig();
    return subtotal >= config.free_shipping_threshold ? 0 : config.standard_shipping_charge;
}

/**
 * Update site setting
 */
export async function updateSiteSetting(key: string, value: any, description?: string): Promise<void> {
    await sql`
    INSERT INTO public.site_settings (key, value, description)
    VALUES (${key}, ${JSON.stringify(value)}, ${description || null})
    ON CONFLICT (key)
    DO UPDATE SET
      value = EXCLUDED.value,
      description = COALESCE(EXCLUDED.description, public.site_settings.description),
      updated_at = now()
  `;
}
