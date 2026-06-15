import { Camera } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: ["How It Works", "Features", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers"],
  },
  {
    heading: "Support",
    links: ["Help Center", "Contact", "Privacy"],
  },
  {
    heading: "Social",
    links: ["Instagram", "Twitter", "LinkedIn"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#F0F7F3] pt-20 pb-10 px-6 border-t border-[#00A86B]/10">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Left – Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Camera className="size-5 text-[#00A86B]" />
              <span className="text-lg font-semibold text-[#0A1A12]">
                SnapClaim
              </span>
            </div>
            <p className="text-[#3A6A4E] text-sm mt-2">
              Upload. Share. Find.
            </p>
          </div>

          {/* Right – Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <p className="text-[#0A1A12] text-sm font-medium mb-4">
                  {col.heading}
                </p>
                <ul>
                  {col.links.map((link) => (
                    <li key={link} className="mb-2.5">
                      <a
                        href="#"
                        className="text-[#4A7A5E] hover:text-[#0A1A12] text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-6 border-t border-[#00A86B]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9ABFAD] text-xs">
            © 2026 SnapClaim. All rights reserved.
          </p>
          <p className="text-[#9ABFAD] text-xs">
            Made with ❤️ for photographers
          </p>
        </div>
      </div>
    </footer>
  );
}
