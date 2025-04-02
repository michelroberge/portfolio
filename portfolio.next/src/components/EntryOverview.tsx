// portfolio.next/src/components/EntryOverview.tsx
import React from "react";

interface EntryProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  skills: string[];
  onClick: () => void;
}

const EntryOverview: React.FC<EntryProps> = ({ title, company, startDate, endDate, location, skills, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg shadow-md bg-primary cursor-pointer hover:bg-primary-100 transition"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{company}</p>
      <p className="text-sm">
        {startDate} - {endDate}
      </p>
      <p className="text-sm">
        {location}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EntryOverview;
