import Avatar from "./Avatar";

interface UserProfileProps {
  user: any;
  name: string;
  email: string;
}

export default function UserProfile({ user, name, email }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        src={user?.imageUrl} 
        name={name}
        size="lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-white">{name}</h3>
        <p className="text-red-100 text-sm opacity-90">{email}</p>
      </div>
    </div>
  );
}