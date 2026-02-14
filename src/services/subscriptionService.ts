import { PlansResponse, CurrentSubscriptionResponse } from "../types/subscription";

const API_BASE_URL = import.meta.env.DEV
    ? "/api"
    : "https://hostel-app-backend-b8ct.onrender.com/api";

class SubscriptionService {
    /**
     * Get all available subscription plans
     */
    async getPlans(): Promise<PlansResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/plans`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch plans: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching plans:", error);
            throw error;
        }
    }

    /**
     * Get current user's active subscription
     */
    async getCurrentSubscription(token: string): Promise<CurrentSubscriptionResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/current`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch subscription: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching current subscription:", error);
            throw error;
        }
    }
}

export const subscriptionService = new SubscriptionService();
