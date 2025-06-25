interface ProgressRingProps {
  percentage: number;
  color?: "green" | "blue" | "red" | "purple" | "yellow";
  size?: number;
  strokeWidth?: number;
}

const colorClasses = {
  green: {
    stroke: "stroke-green-500",
    bg: "stroke-green-100"
  },
  blue: {
    stroke: "stroke-blue-500", 
    bg: "stroke-blue-100"
  },
  red: {
    stroke: "stroke-red-500",
    bg: "stroke-red-100"
  },
  purple: {
    stroke: "stroke-purple-500",
    bg: "stroke-purple-100"
  },
  yellow: {
    stroke: "stroke-yellow-500",
    bg: "stroke-yellow-100"
  }
};

export default function ProgressRing({ 
  percentage, 
  color = "blue", 
  size = 120, 
  strokeWidth = 8 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colors = colorClasses[color];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none ${colors.bg}`}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`fill-none ${colors.stroke} transition-all duration-300 ease-in-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
    </div>
  );
}