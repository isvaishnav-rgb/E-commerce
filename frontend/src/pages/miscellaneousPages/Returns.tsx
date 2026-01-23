import { Link } from "react-router-dom";
import { returns } from "./miscellaneousPages.data";

const Returns = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Returns & Refunds
                </h1>
                <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                    We want you to shop with confidence. If something isn’t right, we’ll
                    make it right.
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white border rounded-2xl shadow-md p-8">
                {/* Intro */}
                <div className="mb-8">
                    <p className="text-gray-700 text-lg">
                        If you’re not satisfied with your purchase, you may request a return
                        or refund under the conditions below.
                    </p>
                </div>

                {/* Policies Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {returns.map((policy, index) => {
                        const Icon = policy.icon; // dynamically get icon component
                        return (
                            <div key={index} className="flex gap-4 p-5 border rounded-xl">
                                <Icon className="text-indigo-600" size={24} />
                                <div>
                                    <h3 className="font-semibold">{policy.title}</h3>
                                    <p className="text-sm text-gray-600">{policy.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-10 bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-indigo-700 text-sm">
                        Need help with a return? Our support team is always here for you.
                    </p>

                    <Link
                        to="/contact"
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Returns;