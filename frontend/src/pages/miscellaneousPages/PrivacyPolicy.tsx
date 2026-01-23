import { ShieldCheck } from "lucide-react";
import { policies } from "./miscellaneousPages.data";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <ShieldCheck className="text-indigo-600" size={24} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Here’s how we collect, use, and
            protect your information.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-md border p-8 space-y-8">
          {/* Intro */}
          <p className="text-gray-700 leading-relaxed">
            We are committed to keeping your information safe and secure. This
            privacy policy explains how we handle the data you provide.
          </p>

          {/* Policy Sections */}
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg"
              >
                <span className="text-indigo-600 font-bold mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {policy}
                </p>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg">
            <ShieldCheck className="text-indigo-600 mt-0.5" size={18} />
            <p className="text-sm text-indigo-700 leading-relaxed">
              By using our website, you agree to this privacy policy. This
              policy may be updated at any time without prior notice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
