import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "./miscellaneousPages.data";

const FAQs = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <HelpCircle className="text-indigo-600" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Quick answers to common questions.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-5">
        {faqs.map((item, i) => {
          const isOpen = open === i;

          return (
            <div
              key={i}
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen(null)}
              className={`border rounded-2xl bg-white transition-all duration-300
                ${isOpen ? "border-indigo-600 shadow-md" : "hover:shadow-md"}
              `}
            >
              <div className="flex justify-between items-center px-6 py-5 cursor-pointer">
                <span className="font-semibold text-gray-900">
                  {item.q}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-indigo-600" : "text-gray-400"
                  }`}
                />
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300
                  ${isOpen ? "max-h-40 px-6 pb-5" : "max-h-0"}
                `}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQs;
