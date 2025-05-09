"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// Komponen: Background Gradient
const BackgroundGradient = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 z-0" />
);

// Komponen: Animated Particles
const AnimatedParticles = () => (
  <div className="absolute inset-0 z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-blue-500/20 blur-sm"
        style={{
          width: Math.random() * 12 + 4 + "px",
          height: Math.random() * 12 + 4 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
        }}
        animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: Math.random() * 5 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// Komponen: Content Area (Title, Description, Button)
const ContentArea = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center pt-20 relative z-10">
    {/* Decorative top glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
    
    {/* Title */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-xl md:text-6xl font-bold pb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-sm"
    >
      {title || `DinsSphere InterConnected`}
    </motion.p>

    {/* Description */}
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="text-sm md:text-lg font-normal text-center text-neutral-300 mt-2 max-w-lg mx-auto backdrop-blur-sm px-4 py-2 rounded-full bg-white/5"
    >
      {description || "Vibecheck your digital ecosystem with DinsSphere 🔥"}
    </motion.p>

    {/* Button */}
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-8 py-3 mt-10 z-30 text-white text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 border border-white/10"
    >
      DinsSphere InterConnected
    </motion.button>
  </div>
);

// Komponen: SVG Animation
const SVGAnimation = ({ pathLengths }) => {
  const transition = { duration: 1.2, ease: "easeInOut" };

  return (
    <svg
      width="100%"
      height="700"
      viewBox="0 0 1440 890"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -bottom-20 w-full z-0"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Path 1 */}
      <motion.path
        d="M0 663C145.5 663 191 666.265 269 647C326.5 630 339.5 621 397.5 566C439 531.5 455 529.5 490 523C509.664 519.348 521 503.736 538 504.236C553.591 504.236 562.429 514.739 584.66 522.749C592.042 525.408 600.2 526.237 607.356 523.019C624.755 515.195 641.446 496.324 657 496.735C673.408 496.735 693.545 519.572 712.903 526.769C718.727 528.934 725.184 528.395 730.902 525.965C751.726 517.115 764.085 497.106 782 496.735C794.831 496.47 804.103 508.859 822.469 518.515C835.13 525.171 850.214 526.815 862.827 520.069C875.952 513.049 889.748 502.706 903.5 503.736C922.677 505.171 935.293 510.562 945.817 515.673C954.234 519.76 963.095 522.792 972.199 524.954C996.012 530.611 1007.42 534.118 1034 549C1077.5 573.359 1082.5 594.5 1140 629C1206 670 1328.5 662.5 1440 662.5"
        stroke="url(#pinkGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: pathLengths[0], opacity: 0.9 }}
        transition={transition}
      />
      {/* Path 2 */}
      <motion.path
        d="M0 587.5C147 587.5 277 587.5 310 573.5C348 563 392.5 543.5 408 535C434 523.5 426 526.235 479 515.235C494 512.729 523 510.435 534.5 512.735C554.5 516.735 555.5 523.235 576 523.735C592 523.735 616 496.735 633 497.235C648.671 497.235 661.31 515.052 684.774 524.942C692.004 527.989 700.2 528.738 707.349 525.505C724.886 517.575 741.932 498.33 757.5 498.742C773.864 498.742 791.711 520.623 810.403 527.654C816.218 529.841 822.661 529.246 828.451 526.991C849.246 518.893 861.599 502.112 879.5 501.742C886.47 501.597 896.865 506.047 907.429 510.911C930.879 521.707 957.139 519.639 982.951 520.063C1020.91 520.686 1037.5 530.797 1056.5 537C1102.24 556.627 1116.5 570.704 1180.5 579.235C1257.5 589.5 1279 587 1440 588"
        stroke="url(#orangeGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: pathLengths[1], opacity: 0.9 }}
        transition={{ ...transition, delay: 0.1 }}
      />
      {/* Path 3 */}
      <motion.path
        d="M0 514C147.5 514.333 294.5 513.735 380.5 513.735C405.976 514.94 422.849 515.228 436.37 515.123C477.503 514.803 518.631 506.605 559.508 511.197C564.04 511.706 569.162 512.524 575 513.735C588 516.433 616 521.702 627.5 519.402C647.5 515.402 659 499.235 680.5 499.235C700.5 499.235 725 529.235 742 528.735C757.654 528.735 768.77 510.583 791.793 500.59C798.991 497.465 807.16 496.777 814.423 499.745C832.335 507.064 850.418 524.648 866 524.235C882.791 524.235 902.316 509.786 921.814 505.392C926.856 504.255 932.097 504.674 937.176 505.631C966.993 511.248 970.679 514.346 989.5 514.735C1006.3 515.083 1036.5 513.235 1055.5 513.235C1114.5 513.235 1090.5 513.235 1124 513.235C1177.5 513.235 1178.99 514.402 1241 514.402C1317.5 514.402 1274.5 512.568 1440 513.235"
        stroke="url(#blueGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: pathLengths[2], opacity: 0.9 }}
        transition={{ ...transition, delay: 0.2 }}
      />
      {/* Path 4 */}
      <motion.path
        d="M0 438.5C150.5 438.5 261 438.318 323.5 456.5C351 464.5 387.517 484.001 423.5 494.5C447.371 501.465 472 503.735 487 507.735C503.786 512.212 504.5 516.808 523 518.735C547 521.235 564.814 501.235 584.5 501.235C604.5 501.235 626 529.069 643 528.569C658.676 528.569 672.076 511.63 695.751 501.972C703.017 499.008 711.231 498.208 718.298 501.617C735.448 509.889 751.454 529.98 767 529.569C783.364 529.569 801.211 507.687 819.903 500.657C825.718 498.469 832.141 499.104 837.992 501.194C859.178 508.764 873.089 523.365 891 523.735C907.8 524.083 923 504.235 963 506.735C1034.5 506.735 1047.5 492.68 1071 481.5C1122.5 457 1142.23 452.871 1185 446.5C1255.5 436 1294 439 1439.5 439"
        stroke="url(#brightBlueGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: pathLengths[3], opacity: 0.9 }}
        transition={{ ...transition, delay: 0.3 }}
      />
      {/* Path 5 */}
      <motion.path
        d="M0.5 364C145.288 362.349 195 361.5 265.5 378C322 391.223 399.182 457.5 411 467.5C424.176 478.649 456.916 491.677 496.259 502.699C498.746 503.396 501.16 504.304 503.511 505.374C517.104 511.558 541.149 520.911 551.5 521.236C571.5 521.236 590 498.736 611.5 498.736C631.5 498.736 652.5 529.236 669.5 528.736C685.171 528.736 697.81 510.924 721.274 501.036C728.505 497.988 736.716 497.231 743.812 500.579C761.362 508.857 778.421 529.148 794 528.736C810.375 528.736 829.35 508.68 848.364 502.179C854.243 500.169 860.624 500.802 866.535 502.718C886.961 509.338 898.141 519.866 916 520.236C932.8 520.583 934.5 510.236 967.5 501.736C1011.5 491 1007.5 493.5 1029.5 480C1069.5 453.5 1072 440.442 1128.5 403.5C1180.5 369.5 1275 360.374 1439 364"
        stroke="url(#deepBlueGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: pathLengths[4], opacity: 0.9 }}
        transition={{ ...transition, delay: 0.4 }}
      />
      {/* Background effect rectangle */}
      <motion.rect
        x="0"
        y="300"
        width="100%"
        height="600"
        fill="url(#enhancedGradient)"
        filter="url(#complexBlur)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2 }}
      />
      {/* Definitions: Filters and Gradients */}
      <defs>
        <filter id="blurMe">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
        <filter id="complexBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="enhancedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4FABFF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#B1C5FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB7C5" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6CAB" />
          <stop offset="100%" stopColor="#FFB7C5" />
        </linearGradient>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#FFDDB7" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D8BF4" />
          <stop offset="100%" stopColor="#B1C5FF" />
        </linearGradient>
        <linearGradient id="brightBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0074D9" />
          <stop offset="100%" stopColor="#4DABFF" />
        </linearGradient>
        <linearGradient id="deepBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004E92" />
          <stop offset="100%" stopColor="#076EFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Komponen: Interactive Orbs di background
const InteractiveOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`orb-${i}`}
        className="absolute rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/30 mix-blend-screen"
        style={{
          width: (i + 2) * 40 + "px",
          height: (i + 2) * 40 + "px",
        }}
        initial={{ x: Math.random() * 1000, y: Math.random() * 500 + 200 }}
        animate={{
          x: Math.random() * 1000,
          y: Math.random() * 500 + 200,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10 + i * 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    ))}
  </div>
);

// Komponen utama: GoogleGeminiEffect
const GoogleGeminiEffect = ({ pathLengths, title, description, className }) => {
  return (
    <div className={cn("relative overflow-hidden w-full h-screen", className)}>
      <BackgroundGradient />
      <AnimatedParticles />
      <ContentArea title={title} description={description} />
      <SVGAnimation pathLengths={pathLengths} />
      <InteractiveOrbs />
    </div>
  );
};

export default GoogleGeminiEffect;
