import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomAvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  name?: string;
  className?: string;
}

export default function CustomAvatar({ src, alt, fallback, name, className }: CustomAvatarProps) {
  // Use provided src, otherwise generate deterministic photo avatar from name/fallback
  const seed = name || fallback;
  const avatarSrc = src || (seed ? `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}` : undefined);

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarSrc} alt={alt || seed} />
      <AvatarFallback className="bg-blue-600 text-white font-bold">{fallback}</AvatarFallback>
    </Avatar>
  );
}
