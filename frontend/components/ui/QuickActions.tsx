import { Plus, Zap, Calendar, Users } from "lucide-react";
import Button from "./Button";

interface QuickActionsProps {
  onCreateTask?: () => void;
  onCreateVitalTask?: () => void;
  onScheduleTask?: () => void;
  onInviteTeam?: () => void;
}

export default function QuickActions({
  onCreateTask,
  onCreateVitalTask,
  onScheduleTask,
  onInviteTeam
}: QuickActionsProps) {
  const actions = [
    {
      label: "New Task",
      icon: Plus,
      onClick: onCreateTask,
      variant: "primary" as const
    },
    {
      label: "Vital Task",
      icon: Zap,
      onClick: onCreateVitalTask,
      variant: "secondary" as const
    },
    {
      label: "Schedule",
      icon: Calendar,
      onClick: onScheduleTask,
      variant: "outline" as const
    },
    {
      label: "Invite",
      icon: Users,
      onClick: onInviteTeam,
      variant: "ghost" as const
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant}
          size="sm"
          onClick={action.onClick}
          className="justify-start"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}