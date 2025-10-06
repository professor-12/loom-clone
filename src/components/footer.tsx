"use client"
import React from "react"
import Link from "next/link"

const footerLinks = [
      {
            title: "APP",
            links: [
                  "Pricing",
                  "loopSDK",
                  "Screen Recorder",
                  "Screenshot",
                  "Chrome Screen Recorder",
                  "Mac Screen Recorder",
                  "Windows Screen Recorder",
                  "iPhone Screen Recorder",
                  "Android Screen Recorder",
            ],
      },
      {
            title: "SOLUTIONS",
            links: [
                  "Sales",
                  "Engineering",
                  "Design",
                  "Marketing",
                  "Product Management",
                  "Support",
                  "Presentation",
                  "Team Alignment",
                  "Education",
                  "Webcam Recorder",
            ],
      },
      {
            title: "FOR BUSINESS",
            links: [
                  "Loop AI",
                  "Enterprise",
                  "Loom HQ",
                  "Customer Stories",
                  "Security",
                  "Video Hosting",
                  "Video Library",
            ],
      },
      {
            title: "DOWNLOADS",
            links: ["Desktop App", "Chrome Extension", "Mobile Apps"],
      },
      {
            title: "RESOURCES",
            links: [
                  "The Replay | Loom’s Blog",
                  "Help Center",
                  "Community",
                  "eBooks",
                  "Status",
                  "What's New",
                  "Webcam Mic Test",
                  "Webcam Recorder",
            ],
      },
      {
            title: "COMPANY",
            links: [
                  "About Us",
                  "Diversity, Equity & Inclusion",
                  "Careers",
                  "Newsroom",
                  "Media Kit",
                  "vs Vidyard",
                  "vs Zoom Clips",
                  "vs Microsoft Clipchamp",
                  "Sitemap",
                  "Privacy Policy",
            ],
      },
]

const Footer = () => {
      return (
            <footer className="bg-[#e8f0f9] font-poppins py-16 text-gray-800">
                  <div className="max-w-[95%] mx-auto ">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full lg:grid-cols-6 gap-10">
                              {footerLinks.map((section) => (
                                    <div key={section.title}>
                                          <h3 className="font-extrabold text-sm mb-4 uppercase tracking-wide">
                                                {section.title}
                                          </h3>
                                          <ul className="space-y-4">
                                                {section.links.map((link) => (
                                                      <li key={link}>
                                                            <Link
                                                                  href="#"
                                                                  className="text-[15px] hover:text-blue-600 transition-colors"
                                                            >
                                                                  {link}
                                                            </Link>
                                                      </li>
                                                ))}
                                          </ul>
                                    </div>
                              ))}
                        </div>
                  </div>
            </footer>
      )
}

export default Footer
