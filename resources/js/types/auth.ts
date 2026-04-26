export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_admin: boolean;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Plan = {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string;
    can_create_recurring_invoices: boolean;
};

export type Auth = {
    user: User;
    plan: Plan | null;
    features: {
        can_create_recurring_invoices: boolean;
    };
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
