/* Hand-drawn SVG charts — Club SMART YouTube dashboard */

// Sparkline — small trend line for KPI cards
function Sparkline({ data, color = 'var(--teal)', width = 220, height = 44, fill = false }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, pad + h - ((v - min) / range) * h]);
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1][0]},${pad + h} L${pts[0][0]},${pad + h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && (
        <path d={areaPath} fill={color} opacity="0.10" />
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

// Main multi-series chart: views (line/area), watch hours (line, secondary axis), subs (bars)
function MainChart({ series, accent = 'teal', style = 'line' }) {
  const W = 1080, H = 360;
  const padL = 56, padR = 56, padT = 32, padB = 48;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const views = series.map(p => p.views);
  const watch = series.map(p => p.watchHours);
  const subs  = series.map(p => p.subsGained);

  const vMax = Math.ceil(Math.max(...views) / 200) * 200;
  const wMax = Math.ceil(Math.max(...watch) / 20) * 20;
  const sMax = Math.ceil(Math.max(...subs) / 10) * 10;

  const stepX = innerW / (series.length - 1);
  const pxX = i => padL + i * stepX;
  const pyV = v => padT + innerH - (v / vMax) * innerH;
  const pyW = v => padT + innerH - (v / wMax) * innerH;
  const pyS = v => padT + innerH - (v / sMax) * innerH;

  const accentCol = accent === 'amber' ? 'var(--amber)' : 'var(--teal)';
  const secondCol = accent === 'amber' ? 'var(--teal)'  : 'var(--amber)';

  // Views path
  const viewsPath = views.map((v, i) => `${i === 0 ? 'M' : 'L'}${pxX(i)},${pyV(v)}`).join(' ');
  const viewsArea = `${viewsPath} L${pxX(views.length - 1)},${padT + innerH} L${pxX(0)},${padT + innerH} Z`;

  // Smooth path for "area" style
  const smoothPath = (pts, yFn) => {
    if (pts.length < 2) return '';
    let d = `M${pxX(0)},${yFn(pts[0])}`;
    for (let i = 1; i < pts.length; i++) {
      const x0 = pxX(i - 1), y0 = yFn(pts[i - 1]);
      const x1 = pxX(i),     y1 = yFn(pts[i]);
      const cx = (x0 + x1) / 2;
      d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
    }
    return d;
  };
  const viewsSmooth = smoothPath(views, v => pyV(v));
  const viewsSmoothArea = `${viewsSmooth} L${pxX(views.length - 1)},${padT + innerH} L${pxX(0)},${padT + innerH} Z`;
  const watchPath = watch.map((v, i) => `${i === 0 ? 'M' : 'L'}${pxX(i)},${pyW(v)}`).join(' ');
  const watchSmooth = smoothPath(watch, v => pyW(v));

  // Y axis ticks (left = views, right = watch hours)
  const yTicks = 4;
  const yTicksArr = Array.from({ length: yTicks + 1 }, (_, i) => i);

  const [hover, setHover] = React.useState(null);
  const svgRef = React.useRef(null);

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    if (x < padL || x > W - padR) { setHover(null); return; }
    const idx = Math.round((x - padL) / stepX);
    setHover(Math.max(0, Math.min(series.length - 1, idx)));
  };

  const isBar = style === 'bar';
  const isArea = style === 'area';

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* horizontal gridlines */}
        {yTicksArr.map(i => {
          const y = padT + (innerH * i) / yTicks;
          return <line key={i} x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--border)" strokeDasharray={i === yTicks ? '0' : '2 4'} />;
        })}

        {/* subscribers bars (background) */}
        {subs.map((v, i) => {
          const barW = Math.max(8, stepX * 0.42);
          const x = pxX(i) - barW / 2;
          const y = pyS(v);
          return (
            <rect key={i} x={x} y={y} width={barW} height={padT + innerH - y}
              fill="var(--n-200)" opacity={hover === i ? 0.7 : 0.45} rx="2" />
          );
        })}

        {/* views series */}
        {isBar ? (
          views.map((v, i) => {
            const barW = Math.max(10, stepX * 0.32);
            const x = pxX(i) - barW / 2 - barW * 0.55;
            const y = pyV(v);
            return <rect key={i} x={x} y={y} width={barW} height={padT + innerH - y} fill={accentCol} rx="2" />;
          })
        ) : (
          <>
            {(isArea) && <path d={viewsSmoothArea} fill={accentCol} opacity="0.12" />}
            <path d={isArea ? viewsSmooth : viewsPath} fill="none" stroke={accentCol} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {views.map((v, i) => (
              <circle key={i} cx={pxX(i)} cy={pyV(v)} r={hover === i ? 4.5 : 2.5} fill={accentCol} stroke="var(--bg-2)" strokeWidth="1.5" />
            ))}
          </>
        )}

        {/* watch hours series (secondary) */}
        {isBar ? (
          watch.map((v, i) => {
            const barW = Math.max(10, stepX * 0.32);
            const x = pxX(i) - barW / 2 + barW * 0.55;
            const y = pyW(v);
            return <rect key={i} x={x} y={y} width={barW} height={padT + innerH - y} fill={secondCol} rx="2" />;
          })
        ) : (
          <>
            <path d={isArea ? watchSmooth : watchPath} fill="none" stroke={secondCol} strokeWidth="2" strokeDasharray={isArea ? '0' : '4 4'} strokeLinecap="round" strokeLinejoin="round" />
            {watch.map((v, i) => (
              <circle key={i} cx={pxX(i)} cy={pyW(v)} r={hover === i ? 4 : 2} fill={secondCol} stroke="var(--bg-2)" strokeWidth="1.5" />
            ))}
          </>
        )}

        {/* x axis labels */}
        {series.map((p, i) => (
          <text key={i} x={pxX(i)} y={H - 18} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">{p.label}</text>
        ))}

        {/* y axis labels left (views) */}
        {yTicksArr.map(i => {
          const y = padT + (innerH * i) / yTicks;
          const v = Math.round(vMax - (vMax * i) / yTicks);
          return <text key={i} x={padL - 10} y={y + 3} textAnchor="end"
            fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">{v.toLocaleString('fr-FR').replace(/,/g, ' ')}</text>;
        })}

        {/* y axis labels right (watch hours) */}
        {yTicksArr.map(i => {
          const y = padT + (innerH * i) / yTicks;
          const v = Math.round(wMax - (wMax * i) / yTicks);
          return <text key={i} x={W - padR + 10} y={y + 3} textAnchor="start"
            fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">{v}h</text>;
        })}

        {/* hover line */}
        {hover !== null && (
          <line x1={pxX(hover)} y1={padT} x2={pxX(hover)} y2={padT + innerH}
            stroke="var(--ink)" strokeOpacity="0.2" strokeDasharray="2 3" />
        )}
      </svg>

      {hover !== null && (() => {
        const p = series[hover];
        const xPct = ((pxX(hover) / W) * 100);
        const align = xPct > 70 ? 'right' : 'left';
        return (
          <div style={{
            position: 'absolute',
            left: align === 'left' ? `calc(${xPct}% + 12px)` : 'auto',
            right: align === 'right' ? `calc(${100 - xPct}% + 12px)` : 'auto',
            top: 16,
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '10px 14px',
            borderRadius: 'var(--r-md)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            boxShadow: 'var(--shadow-3)',
            pointerEvents: 'none',
            minWidth: 180,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--paper)' }}>{p.date || p.label}</div>
            <Row dot={accentCol} label="Vues" val={window.DATA.fmtNum(p.views)} />
            <Row dot={secondCol} label="Watch" val={window.DATA.fmtHours(p.watchHours)} />
            <Row dot="var(--n-300)" label="Abos" val={(p.subsGained > 0 ? '+' : '') + p.subsGained} />
          </div>
        );
      })()}
    </div>
  );
}

function Row({ dot, label, val }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', padding: '2px 0' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: dot, display: 'inline-block' }} />
        <span style={{ color: 'var(--n-300)' }}>{label}</span>
      </span>
      <span style={{ color: 'var(--paper)', fontWeight: 600 }}>{val}</span>
    </div>
  );
}

// Donut for category distribution
function Donut({ slices, size = 160, stroke = 22 }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="var(--n-100)" strokeWidth={stroke} />
        {slices.map((s, i) => {
          const len = (s.value / total) * c;
          const dash = `${len} ${c - len}`;
          const offset = -acc;
          acc += len;
          return (
            <circle key={i} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="butt" />
          );
        })}
      </g>
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle"
        fontFamily="var(--font-display)" fontWeight="800" fontSize="22" fill="var(--ink)">
        {window.DATA.fmtNum(total)}
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-3)">VUES</text>
    </svg>
  );
}

Object.assign(window, { Sparkline, MainChart, Donut });
