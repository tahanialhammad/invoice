import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 70 70"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>

            {/* Background Rounded Rect */}
            <rect x="0" y="0" width="70" height="70" rx="18" fill="url(#iconGrad)" />

            {/* Invoice Lines (drawn with stroke) */}
            <path
                d="M22 25h26M22 35h26M22 45h14"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity={0.9}
            />

            {/* Checkmark (drawn with stroke) */}
            <path
                d="M44 43.5 L48 47.5 L56 39.5"
                stroke="#10b981"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

