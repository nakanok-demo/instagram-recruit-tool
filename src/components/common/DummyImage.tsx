import { IMAGE_CONFIGS } from '../../services/apiMock';

interface DummyImageProps {
  imageIndex: number;
  className?: string;
}

export default function DummyImage({ imageIndex, className = '' }: DummyImageProps) {
  const cfg = IMAGE_CONFIGS[imageIndex % IMAGE_CONFIGS.length];
  return (
    <div
      className={`bg-gradient-to-br ${cfg.gradient} flex flex-col items-center justify-center gap-2 select-none ${className}`}
    >
      <span className="text-5xl drop-shadow-sm">{cfg.emoji}</span>
      <span className="text-white/90 text-sm font-semibold tracking-wide drop-shadow">
        {cfg.label}
      </span>
    </div>
  );
}
