// TableSkeleton.js
import React from 'react';

const TableSkeleton = ({ rows = 10, cols = 7 }) => {
    // Membuat array untuk baris dan kolom
    const rowArray = Array(rows).fill(0);
    const colArray = Array(cols).fill(0);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
            {/* Header Placeholder */}
            <div className="flex bg-gray-100 p-2 mb-2 rounded">
                {colArray.map((_, i) => (
                    <div key={i} className={`flex-1 h-3 bg-gray-300 rounded ${i > 0 ? 'ml-4' : ''} animate-pulse`}></div>
                ))}
            </div>

            {/* Rows with Shimmer Effect */}
            {rowArray.map((_, rowIndex) => (
                <div key={rowIndex} className="flex py-3 border-b border-gray-100">
                    {colArray.map((_, colIndex) => (
                        <div key={colIndex} className={`flex-1 h-4 bg-gray-200 rounded ${colIndex > 0 ? 'ml-4' : ''} animate-pulse`} 
                             style={{ 
                                 width: `${Math.floor(Math.random() * (70 - 30) + 30)}%`, // Lebar acak untuk ilusi data 
                                 animationDelay: `${rowIndex * 50}ms` // Delay untuk efek stagger
                             }}>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;