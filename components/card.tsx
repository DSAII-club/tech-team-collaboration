import React from 'react';

interface CardProps {
  content: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-60 h-60 bg-white text-black shadow-lg rounded-lg p-4 cursor-pointer"
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Card;
