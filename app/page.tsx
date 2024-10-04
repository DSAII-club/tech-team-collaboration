"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

// Fetch the HTML content based on filename
const getHTMLContent = async (filename: string) => {
  const response = await fetch(`/html/${filename}`);
  return response.text();
};

// Fetch the list of HTML files
const getHTMLFiles = async () => {
  const response = await fetch("/api/html-files");
  if (response.ok) {
    return response.json();
  }
  return [];
};

const CircleOfCards: React.FC = () => {
  const [contents, setContents] = useState<{ filename: string; content: string }[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showCenterCard, setShowCenterCard] = useState<boolean>(false);

  // Responsive radius values
  const [radius, setRadius] = useState(270);

  // Adjust radius based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 640) {
        setRadius(130); // Small screens
      } else if (screenWidth <= 1024) {
        setRadius(200); // Tablets
      } else {
        setRadius(270); // Large screens
      }
    };

    handleResize(); // Set initial radius
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch the HTML files and their contents
  useEffect(() => {
    const fetchData = async () => {
      const filenames = await getHTMLFiles();
      const contentPromises = filenames.map(async (filename: string) => ({
        filename,
        content: await getHTMLContent(filename),
      }));
      const results = await Promise.all(contentPromises);
      setContents(results);
    };

    fetchData();
  }, []);

  const handleCardClick = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index); // Toggle expansion
  };

  const handleCenterClick = () => {
    setShowCenterCard(!showCenterCard); // Toggle center card popup on reclick
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Center Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Image
          src="/dsaii logo.jpeg"
          alt="Center Image"
          className="w-20 h-20 md:w-40 md:h-40 rounded-full border border-gray-300 shadow-lg"
          width={160}
          height={160}
          onClick={handleCenterClick} // Show card on click
        />
      </div>

      {/* Center Card (Popup) */}
      {showCenterCard && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute z-20 bg-white border rounded-lg shadow-lg flex items-center justify-center p-4 w-40 h-40 md:w-60 md:h-60"
        >
          <div className="text-black text-center">
            Welcome to the DSAII tech team!
          </div>
        </motion.div>
      )}

      {/* Container of Cards */}
      <div className="relative w-full h-[80vh] flex items-center justify-center">
        {contents.map(({ filename, content }, index) => {
          const anglePerCard = (index / contents.length) * 2 * Math.PI;
          const x = radius * Math.cos(anglePerCard);
          const y = radius * Math.sin(anglePerCard);
          const isExpanded = expandedCard === index;

          return (
            <motion.div
              key={index}
              className={`absolute bg-white border rounded-lg shadow-lg flex items-center justify-center p-2 transition-all cursor-pointer overflow-hidden ${
                isExpanded ? "w-72 h-72 md:w-80 md:h-80 z-20" : "w-36 h-36 md:w-36 md:h-36 z-10"
              }`} // Responsive card size
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              onClick={() => handleCardClick(index)} // Handle card click to expand
            >
              <div className="text-black text-center w-full h-full flex items-center justify-center">
                {!isExpanded ? (
                  // Filename with text overflow handling
                  <p className="truncate px-2 text-sm md:text-base">{filename}</p>
                ) : (
                  // Render full HTML content when expanded
                  <div className="overflow-auto w-full h-full" dangerouslySetInnerHTML={{ __html: content }} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CircleOfCards;
