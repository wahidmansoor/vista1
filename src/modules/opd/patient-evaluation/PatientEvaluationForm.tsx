import React from "react";

export default function PatientEvaluationForm() {
  return (
    <form className="space-y-4 text-sm">
      <div>
        <label className="block font-medium">Performance Status (ECOG):</label>
        <select className="border px-3 py-2 rounded w-full">
          <option value="0">0 - Fully Active</option>
          <option value="1">1 - Restricted</option>
          <option value="2">2 - Ambulatory</option>
          <option value="3">3 - Limited Self-care</option>
          <option value="4">4 - Completely Disabled</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Cachexia Present?</label>
        <input type="checkbox" className="mr-2" /> Yes
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save (Client-side Only)
      </button>
    </form>
  );
}