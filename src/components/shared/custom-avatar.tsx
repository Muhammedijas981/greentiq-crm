import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomAvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}

export default function CustomAvatar({ src, alt, fallback, className }: CustomAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-blue-600 text-white font-bold">{fallback}</AvatarFallback>
    </Avatar>
  );
}
