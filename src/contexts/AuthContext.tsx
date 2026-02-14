import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import {
    AuthContextType,
    AuthState,
    LoginCredentials,
    User,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for stored authentication on mount
    useEffect(() => {
        const storedAuth = authService.getStoredAuth();
        if (storedAuth) {
            setAuthState({
                user: storedAuth.user,
                accessToken: storedAuth.accessToken,
                refreshToken: storedAuth.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const response = await authService.login(credentials);

            setAuthState({
                user: response.data.user,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });

            // Navigate to dashboard after successful login
            navigate("/dashboard");
        } catch (error) {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAuthState({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
            navigate("/login");
        }
    };

    const refreshAccessToken = async (): Promise<void> => {
        // TODO: Implement token refresh logic when refresh endpoint is available
        console.log("Token refresh not yet implemented");
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        refreshAccessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
