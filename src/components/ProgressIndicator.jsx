import React from 'react';
import { getProgressColor } from '../utils/progressCalculator';

const ProgressIndicator = ({ progress, size = 'md', showLabel = true, className = '' }) => {
    const sizeMap = {
        sm: { width: 60, strokeWidth: 6, fontSize: '0.75rem' },
        md: { width: 80, strokeWidth: 8, fontSize: '0.875rem' },
        lg: { width: 120, strokeWidth: 10, fontSize: '1rem' }
    };

    const { width, strokeWidth, fontSize } = sizeMap[size];
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const color = getProgressColor(progress);

    return (
        <div className={`circular-progress ${className}`} style={{ width, height: width }}>
            <svg width={width} height={width}>
                <defs>
                    <linearGradient id={`gradient-${progress}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-electric-blue)" />
                        <stop offset="100%" stopColor="var(--color-electric-violet)" />
                    </linearGradient>
                </defs>
                <circle
                    className="circular-progress-bg"
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="circular-progress-fill"
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke={`url(#gradient-${progress})`}
                />
            </svg>
            {showLabel && (
                <div className="circular-progress-text" style={{ fontSize }}>
                    {progress}%
                </div>
            )}
        </div>
    );
};

export default ProgressIndicator;
