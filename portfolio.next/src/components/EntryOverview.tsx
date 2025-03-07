// portfolio.next/src/components/EntryOverview.tsx
import React from "react";

interface EntryProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  onClick: () => void;
}

const EntryOverview: React.FC<EntryProps> = ({ title, company, startDate, endDate, location, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{company}</p>
      <p className="text-sm">
        {startDate} - {endDate}
      </p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  );
};

export default EntryOverview;
