"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
}

export const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        const container = e.currentTarget.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const position = ((x - container.left) / container.width) * 100;

        if (position >= 0 && position <= 100) {
            setSliderPosition(position);
        }
    };

    return (
        <div
            className="relative w-full aspect-[16/9] overflow-hidden cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
            {/* After Image (Background) */}
            <Image
                src={afterImage}
                alt="After"
                fill
                className="object-cover"
                draggable={false}
            />

            {/* Before Image (Foreground with Clip) */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={beforeImage}
                    alt="Before"
                    fill
                    priority
                    className="object-cover"
                    draggable={false}
                />

                {/* Label Antes */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs uppercase font-bold z-20">
                    Antes
                </div>
            </div>

            {/* Slider Line/Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-30"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-4 bg-zinc-300 rounded-full"></div>
                        <div className="w-0.5 h-4 bg-zinc-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Label Después */}
            <div className="absolute top-4 right-4 bg-secondary text-white px-2 py-1 rounded text-xs uppercase font-bold z-20">
                Después
            </div>
        </div>
    );
};
