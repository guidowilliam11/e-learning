import React from 'react';

const Tag = ({ value, color = 'bg-blue-500'}) => {
    return (
        <span
            className={`inline-block px-4 py-2 rounded-full text-white text-sm font-bold ${color}`}
        >
            {value}
        </span>
    );
};

export default Tag;
