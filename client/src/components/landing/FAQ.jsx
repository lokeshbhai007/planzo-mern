import { Badge, ChevronDown } from "lucide-react";
import { useState } from "react";

/* ─── FAQ ─────────────────────────────────────────────────────── */
const faqs = [
  { q: "Is Planzo free to use?", a: "Yes! Planzo offers a comprehensive free tier with all essential features. Premium analytics are coming soon.", icon: "💰" },
  { q: "How is my data stored?", a: "Your data is encrypted with bank-grade security. We never share or sell your personal financial information.", icon: "🔒" },
  { q: "Do I need finance knowledge?", a: "Not at all! Our AI explains everything in simple terms and guides you step by step through every decision.", icon: "🧠" },
  { q: "Does it work on mobile?", a: "Absolutely! Planzo is fully responsive and works seamlessly on all devices — desktop, tablet, and mobile.", icon: "📱" },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge icon={<span className="text-sm">❓</span>} label="Got Questions?" colors="from-orange-100 to-red-100 text-orange-700" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-semibold text-gray-900">{f.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-400 ${open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-5">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-2 border-blue-400">
                    <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default FAQ