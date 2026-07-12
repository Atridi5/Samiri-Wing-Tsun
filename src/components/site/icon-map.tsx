import {
  Sparkles,
  Target,
  Shield,
  ShieldCheck,
  ShieldOff,
  Frown,
  Brain,
  BrainCircuit,
  Heart,
  Scale,
  TrendingDown,
  TrendingUp,
  Clock,
  XCircle,
  Zap,
  Users,
  Wind,
  Check,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  target: Target,
  shield: Shield,
  "shield-check": ShieldCheck,
  "shield-off": ShieldOff,
  frown: Frown,
  brain: Brain,
  "brain-circuit": BrainCircuit,
  heart: Heart,
  scale: Scale,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  clock: Clock,
  "x-circle": XCircle,
  zap: Zap,
  users: Users,
  wind: Wind,
  check: Check,
};

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICONS[name] ?? Check;
  return <IconComponent className={className} />;
}
