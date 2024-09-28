"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
const getHTMLContent = async (filename: string) => {
  const response = await fetch(`/html/${filename}`);
  return response.text();
};

const getHTMLFiles = async () => {
  const response = await fetch("/api/html-files");
  if (response.ok) {
    return response.json();
  }
  return [];
};

const CircleOfCards: React.FC = () => {
  const [contents, setContents] = useState<string[]>([]);
  const radius = 330;

  useEffect(() => {
    const fetchData = async () => {
      const filenames = await getHTMLFiles();
      const contentPromises = filenames.map((filename: string) => getHTMLContent(filename));
      const results = await Promise.all(contentPromises);
      setContents(results);
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Image
          src="/dsaii logo.jpeg"
          alt="Center Image"
          className="w-40 h-40 rounded-full border border-gray-300 shadow-lg"
          width={160}
          height={160}
        />
      </div>

      <div className="relative w-[660px] h-[660px] flex items-center justify-center">
        {contents.map((content, index) => {
          const anglePerCard = (index / contents.length) * 2 * Math.PI; 
          const x = radius * Math.cos(anglePerCard); 
          const y = radius * Math.sin(anglePerCard); 

          return (
            <motion.div
              key={index}
              className="absolute w-40 h-40 bg-white border rounded-lg shadow-lg flex items-center justify-center p-2"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <div className="text-black" dangerouslySetInnerHTML={{ __html: content }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CircleOfCards;
