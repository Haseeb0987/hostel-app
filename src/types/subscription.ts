// Subscription and Plans Types

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    is_active: boolean;
    created_at: string;
}

export interface PlansResponse {
    success: boolean;
    message: string;
    data: {
        plans: Plan[];
    };
    error: null | string;
}

export interface UserSubscription {
    id: number;
    user_id: string;
    plan_id: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    plans: {
        id: string;
        name: string;
        price: number;
        currency: string;
        interval: string;
        description: string;
    };
}

export interface CurrentSubscriptionResponse {
    success: boolean;
    message: string;
    data: {
        subscription: UserSubscription | null;
    };
    error: null | string;
}
