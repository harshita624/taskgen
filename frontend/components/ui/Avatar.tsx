import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg"
};

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white">
          {initials || <User className="w-1/2 h-1/2" />}
        </span>
      )}
    </div>
  );
}