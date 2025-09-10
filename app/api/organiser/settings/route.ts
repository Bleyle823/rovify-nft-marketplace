import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getSession } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();
        const userId = session.user.id;

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        // Get organiser settings
        const { data: settings, error: settingsError } = await supabase
            .from('organiser_settings')
            .select('*')
            .eq('organiser_id', userId)
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Settings query error:', settingsError);
            return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
        }

        // Get user preference details
        const { data: preferences } = await supabase
            .from('user_preference_details')
            .select('*')
            .eq('user_id', userId)
            .single();

        // Get payment methods
        const { data: paymentMethods } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // Default settings if none exist
        const defaultSettings = {
            business_name: user.name || '',
            business_type: 'individual',
            tax_id: '',
            business_address: {},
            payout_preferences: {
                method: 'bank_transfer',
                schedule: 'weekly',
                minimum_amount: 100
            },
            notification_preferences: {
                new_registration: true,
                payment_received: true,
                event_reminder: true,
                marketing_updates: false
            },
            branding_settings: {
                logo: '',
                primary_color: '#f97316',
                secondary_color: '#fb923c',
                custom_css: ''
            },
            api_settings: {
                webhook_url: '',
                api_key_enabled: false,
                allowed_origins: []
            }
        };

        const organiserSettings = settings || defaultSettings;

        return NextResponse.json({
            success: true,
            data: {
                profile: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                    verified: user.verified,
                    twitter: user.twitter,
                    instagram: user.instagram,
                    website: user.website,
                    followers_count: user.followers_count,
                    following_count: user.following_count
                },
                settings: organiserSettings,
                preferences: preferences || {
                    theme: 'light',
                    language: 'en',
                    timezone: 'UTC',
                    email_notifications: {
                        events: true,
                        friends: true,
                        security: true,
                        marketing: false
                    },
                    push_notifications: {
                        events: true,
                        friends: true,
                        reminders: true
                    },
                    privacy_settings: {
                        show_friends: true,
                        show_activity: true,
                        profile_public: true
                    },
                    display_preferences: {
                        currency: 'USD',
                        date_format: 'MM/dd/yyyy',
                        time_format: '12h'
                    },
                    event_preferences: {
                        show_weather: true,
                        reminder_times: [24, 2],
                        auto_add_to_calendar: false
                    }
                },
                paymentMethods: paymentMethods || []
            }
        });

    } catch (error) {
        console.error('Settings GET API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();
        const userId = session.user.id;
        const { section, data } = await request.json();

        // Check if user is an organiser
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_organiser')
            .eq('id', userId)
            .single();

        if (userError || !user?.is_organiser) {
            return NextResponse.json({ error: 'Access denied. Organiser account required.' }, { status: 403 });
        }

        let result;
        let message = 'Settings updated successfully';

        switch (section) {
            case 'profile':
                // Update user profile
                const { data: updatedUser, error: profileError } = await supabase
                    .from('users')
                    .update({
                        name: data.name,
                        bio: data.bio,
                        image: data.image,
                        twitter: data.twitter,
                        instagram: data.instagram,
                        website: data.website,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId)
                    .select()
                    .single();

                if (profileError) {
                    console.error('Profile update error:', profileError);
                    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
                }

                result = updatedUser;
                message = 'Profile updated successfully';
                break;

            case 'business':
                // Update organiser settings
                const { data: existingSettings } = await supabase
                    .from('organiser_settings')
                    .select('id')
                    .eq('organiser_id', userId)
                    .single();

                if (existingSettings) {
                    // Update existing settings
                    const { data: updatedSettings, error: updateError } = await supabase
                        .from('organiser_settings')
                        .update({
                            business_name: data.business_name,
                            business_type: data.business_type,
                            tax_id: data.tax_id,
                            business_address: data.business_address,
                            updated_at: new Date().toISOString()
                        })
                        .eq('organiser_id', userId)
                        .select()
                        .single();

                    if (updateError) {
                        console.error('Business settings update error:', updateError);
                        return NextResponse.json({ error: 'Failed to update business settings' }, { status: 500 });
                    }
                    result = updatedSettings;
                } else {
                    // Create new settings
                    const { data: newSettings, error: createError } = await supabase
                        .from('organiser_settings')
                        .insert({
                            organiser_id: userId,
                            business_name: data.business_name,
                            business_type: data.business_type,
                            tax_id: data.tax_id,
                            business_address: data.business_address
                        })
                        .select()
                        .single();

                    if (createError) {
                        console.error('Business settings create error:', createError);
                        return NextResponse.json({ error: 'Failed to create business settings' }, { status: 500 });
                    }
                    result = newSettings;
                }

                message = 'Business settings updated successfully';
                break;

            case 'notifications':
                // Update notification preferences in organiser_settings
                const { data: settingsData } = await supabase
                    .from('organiser_settings')
                    .select('id')
                    .eq('organiser_id', userId)
                    .single();

                if (settingsData) {
                    const { data: updatedNotifications, error: notificationError } = await supabase
                        .from('organiser_settings')
                        .update({
                            notification_preferences: data,
                            updated_at: new Date().toISOString()
                        })
                        .eq('organiser_id', userId)
                        .select()
                        .single();

                    if (notificationError) {
                        console.error('Notification settings update error:', notificationError);
                        return NextResponse.json({ error: 'Failed to update notification settings' }, { status: 500 });
                    }
                    result = updatedNotifications;
                } else {
                    // Create settings with notification preferences
                    const { data: newNotificationSettings, error: createNotificationError } = await supabase
                        .from('organiser_settings')
                        .insert({
                            organiser_id: userId,
                            notification_preferences: data
                        })
                        .select()
                        .single();

                    if (createNotificationError) {
                        console.error('Notification settings create error:', createNotificationError);
                        return NextResponse.json({ error: 'Failed to create notification settings' }, { status: 500 });
                    }
                    result = newNotificationSettings;
                }

                message = 'Notification preferences updated successfully';
                break;

            case 'branding':
                // Update branding settings
                const { data: brandingSettings } = await supabase
                    .from('organiser_settings')
                    .select('id')
                    .eq('organiser_id', userId)
                    .single();

                if (brandingSettings) {
                    const { data: updatedBranding, error: brandingError } = await supabase
                        .from('organiser_settings')
                        .update({
                            branding_settings: data,
                            updated_at: new Date().toISOString()
                        })
                        .eq('organiser_id', userId)
                        .select()
                        .single();

                    if (brandingError) {
                        console.error('Branding settings update error:', brandingError);
                        return NextResponse.json({ error: 'Failed to update branding settings' }, { status: 500 });
                    }
                    result = updatedBranding;
                } else {
                    const { data: newBrandingSettings, error: createBrandingError } = await supabase
                        .from('organiser_settings')
                        .insert({
                            organiser_id: userId,
                            branding_settings: data
                        })
                        .select()
                        .single();

                    if (createBrandingError) {
                        console.error('Branding settings create error:', createBrandingError);
                        return NextResponse.json({ error: 'Failed to create branding settings' }, { status: 500 });
                    }
                    result = newBrandingSettings;
                }

                message = 'Branding settings updated successfully';
                break;

            case 'payout':
                // Update payout preferences
                const { data: payoutSettings } = await supabase
                    .from('organiser_settings')
                    .select('id')
                    .eq('organiser_id', userId)
                    .single();

                if (payoutSettings) {
                    const { data: updatedPayout, error: payoutError } = await supabase
                        .from('organiser_settings')
                        .update({
                            payout_preferences: data,
                            updated_at: new Date().toISOString()
                        })
                        .eq('organiser_id', userId)
                        .select()
                        .single();

                    if (payoutError) {
                        console.error('Payout settings update error:', payoutError);
                        return NextResponse.json({ error: 'Failed to update payout settings' }, { status: 500 });
                    }
                    result = updatedPayout;
                } else {
                    const { data: newPayoutSettings, error: createPayoutError } = await supabase
                        .from('organiser_settings')
                        .insert({
                            organiser_id: userId,
                            payout_preferences: data
                        })
                        .select()
                        .single();

                    if (createPayoutError) {
                        console.error('Payout settings create error:', createPayoutError);
                        return NextResponse.json({ error: 'Failed to create payout settings' }, { status: 500 });
                    }
                    result = newPayoutSettings;
                }

                message = 'Payout preferences updated successfully';
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid settings section' },
                    { status: 400 }
                );
        }

        // Log activity
        await supabase
            .from('user_activity')
            .insert({
                user_id: userId,
                activity_type: 'settings_updated',
                reference_type: 'settings',
                metadata: {
                    section,
                    updated_fields: Object.keys(data)
                }
            });

        return NextResponse.json({
            success: true,
            data: result,
            message
        });

    } catch (error) {
        console.error('Settings PUT API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
