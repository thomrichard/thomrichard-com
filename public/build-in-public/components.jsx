/* Header, KPIs, categories, top videos, table, modal */

const { useState, useEffect, useMemo, useRef } = React;

// ────────── Icons (inline SVG, lucide style, stroke 1.5) ──────────
const I = {
  chevron: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  search: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  arrowUp: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>,
  arrowDown: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>,
  sparkle: (p) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>,
  external: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  refresh: (p) => <svg viewBox="0 0 24 24" width={p.size||14} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>,
  sort: (p) => <svg viewBox="0 0 24 24" width={p.size||12} height={p.size||12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>,
  play: (p) => <svg viewBox="0 0 24 24" width={p.size||18} height={p.size||18} fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
};

// ────────── Helpers ──────────
function formatUpdatedAt(iso) {
  if (!iso) return 'Données fraîches';
  const d = new Date(iso);
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 60) return `Mis à jour il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `Mis à jour il y a ${diffH}h`;
  const diffJ = Math.round(diffH / 24);
  return `Mis à jour il y a ${diffJ} j`;
}

// ────────── Header ──────────
function Header({ period, setPeriod, granularity, setGranularity }) {
  const [open, setOpen] = useState(false);
  const periods = [
    'Semaine en cours', 'Semaine dernière', 'Mois en cours', 'Mois dernier', 'Période custom'
  ];
  return (
    <header className="dash-header">
      <div className="dash-container header-row">
        <div className="brand">
          <img src="/build-in-public/assets/logo-club-smart.svg" alt="Club SMART" className="brand-logo" />
          <div className="brand-divider" />
          <div>
            <div className="eyebrow" style={{ marginBottom: 2 }}>YouTube · Build-in-public</div>
            <h1 className="brand-title">Dashboard analytics</h1>
          </div>
        </div>

        <div className="header-controls">
          <div className="dropdown-wrap">
            <button className="dropdown-btn" onClick={() => setOpen(o => !o)}>
              <span>{period}</span>
              <I.chevron />
            </button>
            {open && (
              <>
                <div className="dropdown-overlay" onClick={() => setOpen(false)} />
                <div className="dropdown-menu">
                  {periods.map(p => (
                    <button key={p} className={`dropdown-item ${p === period ? 'active' : ''}`}
                      onClick={() => { setPeriod(p); setOpen(false); }}>
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="seg">
            <button className={granularity === 'weekly' ? 'on' : ''} onClick={() => setGranularity('weekly')}>Hebdo</button>
            <button className={granularity === 'monthly' ? 'on' : ''} onClick={() => setGranularity('monthly')}>Mensuel</button>
          </div>

          <div className="updated">
            <span className="dot-pulse" />
            <span>{formatUpdatedAt(window.DATA?.meta?.generatedAt)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ────────── KPI Cards ──────────
function KpiGrid({ kpis, sparks, accent }) {
  const cards = [
    { key: 'views', label: 'Vues', value: window.DATA.fmtNum(kpis.views.value), delta: kpis.views.delta, sparkData: sparks.views, sparkColor: accent === 'amber' ? 'var(--amber)' : 'var(--teal)', subtitle: 'vs période précédente' },
    { key: 'watch', label: 'Watch time', value: window.DATA.fmtHours(kpis.watchHours.value), delta: kpis.watchHours.delta, sparkData: sparks.watchHours, sparkColor: 'var(--amber)', subtitle: 'vs période précédente' },
    { key: 'sg',  label: 'Abonnés gagnés', value: (kpis.subsGained.value > 0 ? '+' : '') + kpis.subsGained.value, delta: kpis.subsGained.delta, sparkData: sparks.subsGained, sparkColor: 'var(--n-700)', subtitle: 'net sur la période', overline: 'Net' },
    { key: 'st',  label: 'Abonnés total', value: window.DATA.fmtNum(kpis.cumulSubs.value), delta: null, sparkData: sparks.cumulSubs, sparkColor: 'var(--ink)', subtitle: 'cumul à date', overline: 'Cumul', sparkFill: true },
  ];
  return (
    <div className="kpi-grid">
      {cards.map(c => <KpiCard key={c.key} {...c} />)}
    </div>
  );
}

function KpiCard({ label, value, delta, sparkData, sparkColor, subtitle, overline, sparkFill }) {
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;
  return (
    <div className="card kpi">
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        {overline && <span className="kpi-tag">{overline}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-meta">
        {delta !== null ? (
          <span className={`delta ${isUp ? 'up' : isDown ? 'down' : 'flat'}`}>
            {isUp ? <I.arrowUp /> : isDown ? <I.arrowDown /> : null}
            {Math.abs(delta)}%
          </span>
        ) : (
          <span className="delta flat">—</span>
        )}
        <span className="kpi-sub">{subtitle}</span>
      </div>
      <div className="kpi-spark">
        <Sparkline data={sparkData} color={sparkColor} width={260} height={48} fill={sparkFill} />
      </div>
    </div>
  );
}

// ────────── AI Insight block ──────────
function InsightBlock({ kpis, period }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fallback = useMemo(() => buildFallback(kpis, period), [kpis, period]);

  const fetchInsight = async () => {
    // Sur le site public, pas d'accès direct à Claude.
    // Le bouton "Régénérer" rejoue simplement le fallback déterministe.
    setLoading(true); setError(null);
    setTimeout(() => { setText(fallback); setLoading(false); }, 200);
  };

  useEffect(() => { setText(fallback); }, [fallback]);

  return (
    <div className="insight">
      <div className="insight-mark">
        <I.sparkle size={18} />
      </div>
      <div className="insight-body">
        <div className="insight-head">
          <span className="eyebrow">Ce qui se passe — {period}</span>
          <button className="insight-refresh" onClick={fetchInsight} disabled={loading} title="Régénérer avec Claude">
            <I.refresh /> {loading ? 'Génération…' : 'Régénérer'}
          </button>
        </div>
        <p className="insight-text">{text}</p>
        {error && <small style={{color:'var(--danger)'}}>Hors ligne — texte par défaut affiché.</small>}
      </div>
    </div>
  );
}

function buildFallback(k, period) {
  const dV = k.views.delta, dS = k.subsGained.delta;
  const drop = dV < -10;
  return drop
    ? `Les vues baissent de ${Math.abs(dV)}% cette période — ${k.views.value} vues, contre une base plus haute la semaine d'avant. Le watch time tient (${k.watchHours.value}h, ${k.watchHours.delta>0?'+':''}${k.watchHours.delta}%), donc l'audience qui regarde est toujours engagée ; c'est l'acquisition qui ralentit. À regarder côté CTR et thumbnails sur les 3 dernières publications.`
    : `${window.DATA.fmtNum(k.views.value)} vues sur ${period.toLowerCase()}, ${dV>0?'+':''}${dV}% vs précéd. ${k.subsGained.value>0?'+':''}${k.subsGained.value} abos nets — ${k.cumulSubs.value} au total. ${dS<0?`L'abonnement net ralentit (${dS}%) malgré l'audience stable.`:`Croissance régulière, rien à signaler côté red flags.`}`;
}

// ────────── Categories ──────────
function CategoriesSection({ data, accent }) {
  const colors = {
    short: accent === 'amber' ? 'var(--amber)' : 'var(--teal)',
    mid:   'var(--navy)',
    long:  accent === 'amber' ? 'var(--teal)'  : 'var(--amber)',
  };
  const slices = data.map(d => ({ value: d.views, color: colors[d.key] }));

  return (
    <section className="section">
      <SectionHead title="Répartition par durée"
        subtitle="Trois plages, trois usages. Les courts captent plus de monde, les longs retiennent plus longtemps." />

      <div className="cat-grid">
        <div className="card cat-donut-card">
          <div className="cat-donut">
            <Donut slices={slices} size={150} stroke={22} />
          </div>
          <div className="cat-legend">
            {data.map(d => (
              <div key={d.key} className="cat-legend-row">
                <span className="cat-dot" style={{ background: colors[d.key] }} />
                <span className="cat-leg-label">{d.label}</span>
                <span className="cat-leg-val">{Math.round((d.views / slices.reduce((a, s) => a + s.value, 0)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {data.map(d => (
          <div key={d.key} className="card cat-card">
            <div className="cat-head">
              <span className="cat-stripe" style={{ background: colors[d.key] }} />
              <h3 className="cat-title">{d.label}</h3>
            </div>
            <div className="cat-stat-line">
              <span className="cat-bignum">{d.videos}</span>
              <span className="cat-bigsub">vidéos · {window.DATA.fmtNum(d.views)} vues</span>
            </div>
            <dl className="cat-dl">
              <div><dt>Durée moy.</dt><dd>{window.DATA.fmtSec(d.avgViewSec)}</dd></div>
              <div><dt>% regardé</dt><dd>{d.avgPctWatched}%</dd></div>
              <div><dt>CTR moy.</dt><dd>{d.avgCtr}%</dd></div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────── Top 5 ──────────
function TopVideos({ tops, onOpen }) {
  const [tab, setTab] = useState('views');
  const tabs = [
    { key: 'views', label: 'Vues' },
    { key: 'watchH', label: 'Watch time' },
    { key: 'subs', label: 'Abonnés' },
    { key: 'ctr', label: 'CTR' },
  ];
  const list = tops[tab];

  return (
    <section className="section">
      <SectionHead title="Top 5 vidéos" subtitle="Switche les onglets pour voir le palmarès par métrique." />

      <div className="tab-strip">
        {tabs.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'on' : ''}`}
            onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="top-list">
        {list.map((v, i) => (
          <button key={v.id} className="top-card" onClick={() => onOpen(v)}>
            <div className="top-rank">{String(i + 1).padStart(2, '0')}</div>
            <Thumb id={v.id} title={v.title} thumb={v.thumb} />
            <div className="top-meta">
              <h4 className="top-title">{v.title}</h4>
              <div className="top-stats">
                <span><strong>{window.DATA.fmtNum(v.views)}</strong> vues</span>
                <span className="dot-sep">·</span>
                <span><strong>{window.DATA.fmtHours(v.watchH)}</strong> watch</span>
                <span className="dot-sep">·</span>
                <span><strong>{v.subs > 0 ? '+' : ''}{v.subs}</strong> abos</span>
                <span className="dot-sep">·</span>
                <span>CTR <strong>{v.ctr}%</strong></span>
              </div>
              <div className="top-tags">
                <span className="tag">{window.DATA.catLabel(v.cat)}</span>
                <span className="tag muted">publié {v.published}</span>
              </div>
            </div>
            <div className="top-arrow"><I.external /></div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ────────── Thumbnail (real YouTube image with fallback chain) ──────────
function Thumb({ id, title, thumb, size = 'md' }) {
  const [step, setStep] = useState(0);
  // step 0 = thumb (Airtable URL si fourni)
  // step 1 = YouTube maxresdefault
  // step 2 = YouTube hqdefault
  // step 3 = placeholder géométrique
  const candidates = [
    thumb || null,
    id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null,
    id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null,
  ];
  const src = candidates[step];

  if (src) {
    return (
      <div className={`thumb thumb-${size}`}>
        <img
          src={src}
          alt={title || ''}
          loading="lazy"
          onError={() => setStep(s => s + 1)}
        />
        <div className="thumb-play"><I.play /></div>
      </div>
    );
  }

  // Placeholder géométrique en dernier recours
  const palette = [
    ['var(--teal)', 'var(--navy)'],
    ['var(--amber)', 'var(--ink)'],
    ['var(--navy)', 'var(--teal)'],
    ['var(--ink)', 'var(--amber)'],
  ];
  const safeId = id || (title || 'aa');
  const idx = ((safeId.charCodeAt(0) || 0) + (safeId.charCodeAt(1) || 0)) % palette.length;
  const [bg, fg] = palette[idx];
  return (
    <div className={`thumb thumb-${size}`} style={{ background: bg }}>
      <svg viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        {idx === 0 && <circle cx="80" cy="14" r="22" fill={fg} opacity="0.3" />}
        {idx === 1 && <rect x="60" y="6" width="34" height="34" fill={fg} opacity="0.3" />}
        {idx === 2 && <polygon points="80,4 100,40 60,40" fill={fg} opacity="0.3" />}
        {idx === 3 && <polygon points="82,4 100,22 82,40 64,22" fill={fg} opacity="0.3" />}
      </svg>
      <div className="thumb-play"><I.play /></div>
    </div>
  );
}

// ────────── Section heading ──────────
function SectionHead({ title, subtitle, right }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// ────────── Full table ──────────
function FullTable({ rows, onOpen }) {
  const [sort, setSort] = useState({ key: 'views', dir: 'desc' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    let r = rows;
    if (filter !== 'all') r = r.filter(v => v.cat === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(v => v.title.toLowerCase().includes(q));
    }
    r = [...r].sort((a, b) => {
      const dir = sort.dir === 'desc' ? -1 : 1;
      const va = a[sort.key], vb = b[sort.key];
      if (typeof va === 'string') return va.localeCompare(vb) * dir;
      return (va - vb) * dir;
    });
    return r;
  }, [rows, sort, search, filter]);

  const setSortKey = k => setSort(s => ({ key: k, dir: s.key === k ? (s.dir === 'desc' ? 'asc' : 'desc') : 'desc' }));

  const cols = [
    { key: 'thumb', label: '', sortable: false, w: 64 },
    { key: 'title', label: 'Titre', align: 'left' },
    { key: 'cat', label: 'Cat.', w: 90 },
    { key: 'views', label: 'Vues', align: 'right', w: 84 },
    { key: 'watchH', label: 'Watch', align: 'right', w: 84 },
    { key: 'subs', label: 'Abos', align: 'right', w: 70 },
    { key: 'ctr', label: 'CTR', align: 'right', w: 70 },
    { key: 'avgViewSec', label: 'Durée moy.', align: 'right', w: 96 },
    { key: 'avgPctWatched', label: '% regardé', align: 'right', w: 90 },
  ];

  return (
    <section className="section">
      <SectionHead title="Toutes les vidéos actives"
        subtitle={`${filtered.length} sur ${rows.length} vidéos. Tri par défaut : vues décroissantes.`}
        right={
          <div className="table-controls">
            <div className="search">
              <I.search />
              <input placeholder="Rechercher un titre…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="seg seg-sm">
              {[
                { k: 'all', l: 'Tout' },
                { k: 'short', l: '< 10' },
                { k: 'mid', l: '10–20' },
                { k: 'long', l: '> 20' },
              ].map(o => (
                <button key={o.k} className={filter === o.k ? 'on' : ''} onClick={() => setFilter(o.k)}>{o.l}</button>
              ))}
            </div>
          </div>
        }
      />

      <div className="card table-card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c.key} style={{ width: c.w, textAlign: c.align || 'left' }}
                    className={c.sortable === false ? '' : 'sortable'}
                    onClick={() => c.sortable !== false && setSortKey(c.key)}>
                    <span className="th-inner">
                      {c.label}
                      {c.sortable !== false && (
                        <span className={`sort-ind ${sort.key === c.key ? 'on ' + sort.dir : ''}`}><I.sort /></span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} onClick={() => onOpen(v)}>
                  <td><Thumb id={v.id} title={v.title} thumb={v.thumb} size="sm" /></td>
                  <td className="td-title">{v.title}</td>
                  <td><span className="tag">{window.DATA.catLabel(v.cat)}</span></td>
                  <td className="num">{window.DATA.fmtNum(v.views)}</td>
                  <td className="num">{window.DATA.fmtHours(v.watchH)}</td>
                  <td className="num">{v.subs > 0 ? '+' + v.subs : v.subs}</td>
                  <td className="num">{v.ctr}%</td>
                  <td className="num">{window.DATA.fmtSec(v.avgViewSec)}</td>
                  <td className="num">{v.avgPctWatched}%</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={cols.length} className="empty">Aucune vidéo ne correspond.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ────────── Modal ──────────
function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!video) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><I.close /></button>
        <div className="modal-head">
          <Thumb id={video.id} title={video.title} thumb={video.thumb} size="lg" />
          <div>
            <span className="eyebrow">Détail vidéo</span>
            <h3 className="modal-title">{video.title}</h3>
            <div className="modal-tags">
              <span className="tag">{window.DATA.catLabel(video.cat)}</span>
              <span className="tag muted">publié {video.published}</span>
              <span className="tag muted">durée {window.DATA.fmtSec(video.duration)}</span>
            </div>
          </div>
        </div>

        <div className="modal-grid">
          <Stat label="Vues" value={window.DATA.fmtNum(video.views)} />
          <Stat label="Watch time" value={window.DATA.fmtHours(video.watchH)} />
          <Stat label="Abonnés gagnés" value={(video.subs > 0 ? '+' : '') + video.subs} />
          <Stat label="CTR" value={video.ctr + '%'} />
          <Stat label="Durée moy. de visionnage" value={window.DATA.fmtSec(video.avgViewSec)} />
          <Stat label="% regardé" value={video.avgPctWatched + '%'} />
        </div>

        <div className="modal-actions">
          <a className="btn btn-primary" href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
            Ouvrir sur YouTube <I.external />
          </a>
          <a className="btn btn-ghost" href="#" onClick={e => e.preventDefault()}>Voir dans Studio</a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="modal-stat">
      <div className="modal-stat-label">{label}</div>
      <div className="modal-stat-value">{value}</div>
    </div>
  );
}

// ────────── Footer ──────────
function Footer({ granularity }) {
  return (
    <footer className="dash-footer">
      <div className="dash-container footer-row">
        <div>
          <div className="footer-brand">Club SMART · Build-in-public</div>
          <small>Données fournies par YouTube Analytics API, mises à jour {granularity === 'weekly' ? 'hebdomadairement' : 'mensuellement'}.</small>
        </div>
        <div className="footer-links">
          <a href="#">Dashboard Airtable brut <I.external /></a>
          <a href="#">Méthodo &amp; sources</a>
          <a href="#">Rejoindre le Club</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Header, KpiGrid, KpiCard, InsightBlock,
  CategoriesSection, TopVideos, Thumb, SectionHead,
  FullTable, VideoModal, Footer, Icons: I,
});
