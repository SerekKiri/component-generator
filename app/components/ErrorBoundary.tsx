import { useRouteError, isRouteErrorResponse, Link } from "@remix-run/react";

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50">
                <div className="w-full max-w-2xl p-8 bg-white border border-primary-100 rounded-lg">
                    <h1 className="text-3xl font-bold mb-4 text-primary-700">
                        {error.status} {error.statusText}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error.data?.message || "Something went wrong"}
                    </p>
                    <Link
                        to="/app"
                        className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
            <div className="w-full max-w-2xl p-8 bg-white border border-primary-100 rounded-lg">
                <h1 className="text-3xl font-bold mb-4 text-primary-700">
                    Unexpected Error
                </h1>
                <p className="text-gray-600 mb-6">
                    {error instanceof Error ? error.message : "An unexpected error occurred"}
                </p>
                <Link
                    to="/app"
                    className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
} 