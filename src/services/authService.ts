import { LoginCredentials, LoginResponse, User } from "../types/auth";

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV
    ? "/api"
    : "https://hostel-app-backend-b8ct.onrender.com/api";
const AUTH_STORAGE_KEY = "hostel_auth";

interface StoredAuth {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

class AuthService {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `Login failed: ${response.statusText}`
                );
            }

            const data: LoginResponse = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Login failed");
            }

            // Store authentication data
            this.storeAuth({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                expiresAt: data.data.session.expires_at,
            });

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unexpected error occurred during login");
        }
    }

    /**
     * Store authentication data in localStorage
     */
    private storeAuth(auth: StoredAuth): void {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    }

    /**
     * Get stored authentication data
     */
    getStoredAuth(): StoredAuth | null {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            if (!stored) return null;

            const auth: StoredAuth = JSON.parse(stored);

            // Check if token is expired
            const now = Math.floor(Date.now() / 1000);
            if (auth.expiresAt && auth.expiresAt < now) {
                this.clearAuth();
                return null;
            }

            return auth;
        } catch (error) {
            console.error("Error reading stored auth:", error);
            return null;
        }
    }

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        const auth = this.getStoredAuth();
        return auth?.accessToken || null;
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        const auth = this.getStoredAuth();
        return auth?.refreshToken || null;
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        const auth = this.getStoredAuth();
        return auth?.user || null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.getStoredAuth() !== null;
    }

    /**
     * Clear authentication data (logout)
     */
    clearAuth(): void {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    /**
   * Logout
   */
    async logout(): Promise<void> {
        const token = this.getAccessToken();

        // Call logout API if token exists
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error("Logout API error:", error);
                // Continue with local logout even if API fails
            }
        }

        // Clear local storage regardless of API result
        this.clearAuth();
    }

    /**
     * Create authenticated fetch request
     */
    async authenticatedFetch(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const token = this.getAccessToken();

        if (!token) {
            throw new Error("No authentication token available");
        }

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        return fetch(url, {
            ...options,
            headers,
        });
    }
}

export const authService = new AuthService();
