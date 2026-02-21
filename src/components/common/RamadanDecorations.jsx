import React from 'react';
import { useRamadan } from '../../context/RamadanContext';
import bgRamadhan from '../../assets/ramadhan-bg-dark.jpg';

const RamadanDecorations = () => {
  const { isRamadan } = useRamadan();

  if (!isRamadan) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgRamadhan}
          alt="Ramadan Background"
          className="w-full h-full object-cover opacity-100"
        />
        {/* Dark overlay to ensure content readability if image is too bright,
            or to tint it. Since it's a 'dark' image, we use a light overlay?
            No, let's stick to a subtle dark gradient to ensure top/bottom text contrast. */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Optional: Animated elements (Stars/Fireflies?) - Keeping it simple for now as per image focus */}
      {/* If the image has its own lanterns, we might not need CSS lanterns.
          The user's file "buat background..." suggests it's a complete design.
          I will comment out the CSS lanterns to avoid clashing. */}

      {/*
      <div className="absolute top-0 left-4 w-12 h-24 bg-emerald-500/10 blur-xl animate-pulse"></div>
      <div className="absolute top-0 right-10 w-16 h-32 bg-emerald-400/10 blur-xl animate-pulse delay-700"></div>
      */}
    </div>
  );
};

export default RamadanDecorations;
