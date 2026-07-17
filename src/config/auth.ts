const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const googleAuthFlagEnabled =
    import.meta.env.VITE_GOOGLE_AUTH_ENABLED?.trim().toLowerCase() === 'true';

export const isGoogleAuthEnabled = googleAuthFlagEnabled && Boolean(apiBaseUrl);

export const getGoogleAuthStartUrl = () => `${apiBaseUrl}/auth/google/start`;

export const getUnauthenticatedAuthUrl = () =>
    isGoogleAuthEnabled ? getGoogleAuthStartUrl() : '/login';

