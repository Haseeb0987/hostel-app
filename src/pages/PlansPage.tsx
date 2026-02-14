import React, { useEffect, useState } from "react";
import { Check, CreditCard, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { subscriptionService } from "../services/subscriptionService";
import { useAuth } from "../contexts/AuthContext";
import { Plan, UserSubscription } from "../types/subscription";

export const PlansPage: React.FC = () => {
    const { accessToken } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch all plans (public endpoint)
                const plansResponse = await subscriptionService.getPlans();
                if (plansResponse.success) {
                    setPlans(plansResponse.data.plans);
                }

                // Fetch user's active subscription (requires authentication)
                if (accessToken) {
                    try {
                        const subscriptionResponse = await subscriptionService.getCurrentSubscription(accessToken);
                        if (subscriptionResponse.success && subscriptionResponse.data.subscription) {
                            setActiveSubscription(subscriptionResponse.data.subscription);
                        }
                    } catch (err) {
                        // User might not have an active subscription - this is okay
                        // Don't show error to user, just log it
                        console.log("No active subscription or subscription fetch failed:", err);
                    }
                } else {
                    console.log("No access token available for fetching subscription");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load plans");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

    const isActivePlan = (planId: string): boolean => {
        return activeSubscription?.plan_id === planId;
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="text-center">
                    <Loader2 size={48} className="text-primary mb-3" style={{ animation: "spin 1s linear infinite" }} />
                    <p className="text-muted">Loading subscription plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
                <AlertCircle size={20} className="me-2" />
                <div>
                    <strong>Error:</strong> {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h4 className="mb-1">Subscription Plans</h4>
                <p className="text-muted mb-0">
                    {activeSubscription
                        ? "Your current subscription plan and available options"
                        : "Choose the perfect plan for your hostel stay"}
                </p>
            </div>

            {activeSubscription && (
                <div className="alert alert-success border-0 mb-4">
                    <div className="d-flex align-items-start">
                        <CheckCircle2 size={20} className="me-2 mt-1 flex-shrink-0" />
                        <div>
                            <h6 className="fw-semibold mb-1">Active Subscription</h6>
                            <p className="mb-1">
                                You are currently subscribed to <strong>{activeSubscription.plans.name}</strong>
                            </p>
                            <small className="text-muted">
                                Valid from {formatDate(activeSubscription.start_date)} to {formatDate(activeSubscription.end_date)}
                            </small>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {plans.map((plan) => {
                    const isActive = isActivePlan(plan.id);

                    return (
                        <div key={plan.id} className="col-lg-4 col-md-6">
                            <div
                                className={`card border-0 shadow-sm h-100 ${isActive ? "border-success" : ""
                                    }`}
                                style={{
                                    borderWidth: isActive ? "2px" : "0",
                                    borderStyle: "solid",
                                    position: "relative",
                                    opacity: isActive ? 1 : 0.85,
                                }}
                            >
                                {isActive && (
                                    <div
                                        className="position-absolute top-0 start-50 translate-middle"
                                        style={{ zIndex: 1 }}
                                    >
                                        <span className="badge bg-success px-3 py-2">
                                            <CheckCircle2 size={14} className="me-1" />
                                            Your Current Plan
                                        </span>
                                    </div>
                                )}

                                <div className="card-body p-4">
                                    <div className="text-center mb-4">
                                        <h5 className="fw-bold mb-2">{plan.name}</h5>
                                        <p className="text-muted small mb-3">{plan.description}</p>

                                        <div className="mb-3">
                                            <span className="display-5 fw-bold text-primary">
                                                {plan.currency} {plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-muted">/{plan.interval}</span>
                                        </div>

                                        {!isActive && (
                                            <button
                                                className="btn btn-outline-secondary w-100"
                                                disabled
                                            >
                                                <CreditCard size={18} className="me-2" />
                                                View Details
                                            </button>
                                        )}
                                        {isActive && (
                                            <button
                                                className="btn btn-success w-100"
                                                disabled
                                            >
                                                <CheckCircle2 size={18} className="me-2" />
                                                Active Plan
                                            </button>
                                        )}
                                    </div>

                                    <hr className="my-4" />

                                    <div>
                                        <h6 className="fw-semibold mb-3">Plan Information:</h6>
                                        <ul className="list-unstyled">
                                            <li className="mb-2 d-flex align-items-start">
                                                <Check size={18} className="me-2 mt-1 flex-shrink-0 text-success" />
                                                <span className="small">Billing: {plan.interval}</span>
                                            </li>
                                            <li className="mb-2 d-flex align-items-start">
                                                <Check size={18} className="me-2 mt-1 flex-shrink-0 text-success" />
                                                <span className="small">Currency: {plan.currency}</span>
                                            </li>
                                            <li className="mb-2 d-flex align-items-start">
                                                <Check size={18} className="me-2 mt-1 flex-shrink-0 text-success" />
                                                <span className="small">
                                                    Status: {plan.is_active ? "Available" : "Unavailable"}
                                                </span>
                                            </li>
                                            {isActive && activeSubscription && (
                                                <>
                                                    <li className="mb-2 d-flex align-items-start">
                                                        <Check size={18} className="me-2 mt-1 flex-shrink-0 text-success" />
                                                        <span className="small">
                                                            Expires: {formatDate(activeSubscription.end_date)}
                                                        </span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h5 className="fw-bold mb-2">Need help with your subscription?</h5>
                            <p className="text-muted mb-md-0">
                                Contact our support team for assistance with plan changes, billing questions, or custom requirements.
                            </p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button className="btn btn-outline-primary">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="alert alert-info border-0">
                    <h6 className="fw-semibold mb-2">
                        <AlertCircle size={18} className="me-2" />
                        Subscription Information
                    </h6>
                    <ul className="mb-0 small">
                        <li>Plans shown are for informational purposes only</li>
                        <li>Your active plan is highlighted with a green badge</li>
                        <li>Contact administration to change or upgrade your subscription</li>
                        <li>All prices are in Pakistani Rupees (PKR)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
