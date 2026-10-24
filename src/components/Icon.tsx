import { asset } from '../lib/format';

interface IconProps {
  /** Path inside public/assets, e.g. "icons/plus-18-dark.svg" */
  src: string;
  size: number;
  height?: number;
  className?: string;
  alt?: string;
}

/** Static Figma asset rendered at its exact design size. */
export function Icon({ src, size, height, className, alt = '' }: IconProps) {
  return (
    <img
      src={asset(src)}
      width={size}
      height={height ?? size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      style={{ flexShrink: 0, width: size, height: height ?? size }}
      draggable={false}
    />
  );
}
