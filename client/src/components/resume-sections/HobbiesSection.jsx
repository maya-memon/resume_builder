import React, { useState } from 'react';
import { FaPlus, FaTimes, FaHeart, FaMagic } from 'react-icons/fa';

export default function HobbiesSection({ data, onChange }) {
  const hobbies = data || [];
  const [newHobby, setNewHobby] = useState('');

  const addHobby = () => {
    const hobby = newHobby.trim();
    if (hobby && !hobbies.includes(hobby)) {
      onChange([...hobbies, hobby]);
      setNewHobby('');
    }
  };

  const removeHobby = (index) => {
    const updated = hobbies.filter((_, i) => i !== index);
    onChange(updated);
  };

  const generateHobbies = async () => {
    // TODO: Integrate with Gemini AI
    const aiHobbies = [
      'Reading', 'Photography', 'Hiking', 'Cooking', 'Traveling', 
      'Music', 'Fitness', 'Gaming', 'Gardening', 'Writing'
    ];
    
    const newHobbies = aiHobbies.filter(hobby => !hobbies.includes(hobby));
    
    if (newHobbies.length > 0) {
      const updated = [...hobbies, ...newHobbies.slice(0, 5)]; // Add up to 5 suggestions
      onChange(updated);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHobby();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 flex items-center">
          <FaHeart className="text-red-500 mr-2" />
          Hobbies & Interests
        </h4>
        <button
          onClick={generateHobbies}
          className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaMagic className="text-xs" />
          <span>AI Suggest</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {hobbies.map((hobby, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
          >
            {hobby}
            <button
              onClick={() => removeHobby(index)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <FaTimes className="text-xs" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Photography, Hiking, Reading..."
        />
        <button
          onClick={addHobby}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Add hobbies and interests that showcase your personality and well-roundedness.
      </p>
    </div>
  );
}
