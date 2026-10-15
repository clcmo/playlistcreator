import { useMemo } from 'react';

export function Wordmark() {
  return <span className="logo word"><b>urbanna</b></span>;
}

/** Divisor de barras de equalizador: gerado em JS, animado em CSS. */
export function Equalizer({ bars = 36 }) {
  const items = useMemo(() => Array.from({ length: bars }, (_, i) => ({
    d: `${(0.5 + Math.random() * 0.9).toFixed(2)}s`,
    delay: `${(-Math.random() * 1.2).toFixed(2)}s`,
    h: (0.25 + Math.random() * 0.75).toFixed(2),
    c: ['var(--pink)', 'var(--blue)', 'var(--amber)'][i % 3]
  })), [bars]);
  return (
    <div className="eq" aria-hidden="true">
      {items.map((b, i) => (
        <i key={i} style={{ '--d': b.d, '--delay': b.delay, '--h': b.h, '--c': b.c }} />
      ))}
    </div>
  );
}

/** Pontos de 5px alternando rosa, azul e âmbar. */
export function DotDivider() {
  return (
    <div className="dots" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
    </div>
  );
}
