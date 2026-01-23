import { FileText, AlertCircle } from "lucide-react";
import { termsList } from "./miscellaneousPages.data";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <FileText className="text-indigo-600" size={24} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Please read these terms carefully before using our website or
            purchasing any products.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed">
            By accessing or using our platform, you agree to be bound by the
            following terms and conditions. These terms apply to all users,
            customers, and visitors of our website.
          </p>

          {/* Terms List */}
          <div className="space-y-4">
            {termsList.map((term, index) => (
              <div
                key={index}
                className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg"
              >
                <span className="text-indigo-600 font-bold mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {term}
                </p>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg">
            <AlertCircle className="text-indigo-600 mt-0.5" size={18} />
            <p className="text-sm text-indigo-700 leading-relaxed">
              These terms may be updated or modified at any time without prior
              notice. Continued use of the website implies acceptance of the
              updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
