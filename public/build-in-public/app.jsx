/* App principal du dashboard YouTube — Build-in-public Club SMART
   Adapté du Claude Design : la granularité Hebdo/Mensuel switche aussi
   les catégories, top 5 et tableau (en plus des KPIs et de la trend). */

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = { accent: 'amber', chartStyle: 'line' };

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [period, setPeriod] = useState('Semaine en cours');
  const [granularity, setGranularity] = useState('weekly');
  const [openVideo, setOpenVideo] = useState(null);

  useEffect(() => {
    document.body.dataset.accent = tweaks.accent;
  }, [tweaks.accent]);

  const isWeekly = granularity === 'weekly';
  const series  = isWeekly ? window.DATA.TIMESERIES_WEEKLY  : window.DATA.TIMESERIES_MONTHLY;
  const kpis    = isWeekly ? window.DATA.KPIS_WEEKLY        : window.DATA.KPIS_MONTHLY;
  const sparks  = isWeekly ? window.DATA.KPI_SPARKS_WEEKLY  : window.DATA.KPI_SPARKS_MONTHLY;
  const cats    = isWeekly ? window.DATA.CATEGORIES         : window.DATA.CATEGORIES_MONTHLY;
  const tops    = isWeekly ? window.DATA.TOPS               : window.DATA.TOPS_MONTHLY;
  const metrics = isWeekly ? window.DATA.VIDEO_METRICS      : window.DATA.VIDEO_METRICS_MONTHLY;

  return (
    <>
      <Header period={period} setPeriod={setPeriod}
        granularity={granularity} setGranularity={setGranularity} />

      <main>
        <div className="dash-container">
          <KpiGrid kpis={kpis} sparks={sparks} accent={tweaks.accent} />

          <InsightBlock kpis={kpis} period={period} />

          <section className="section">
            <SectionHead
              title={isWeekly ? 'Tendance sur 12 semaines' : 'Tendance sur 6 mois'}
              subtitle="Vues + watch time côte à côte. Les abonnés gagnés sont en barres au fond."
            />
            <div className="card chart-card">
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-swatch line" style={{background: tweaks.accent === 'amber' ? 'var(--amber)' : 'var(--teal)'}} />
                  Vues (axe gauche)
                </span>
                <span className="legend-item">
                  <span className="legend-swatch dash" style={{color: tweaks.accent === 'amber' ? 'var(--teal)' : 'var(--amber)'}} />
                  Watch time (axe droite, h)
                </span>
                <span className="legend-item">
                  <span className="legend-swatch" style={{background: 'var(--n-200)'}} />
                  Abonnés gagnés
                </span>
              </div>
              <MainChart series={series} accent={tweaks.accent} style={tweaks.chartStyle} />
            </div>
          </section>

          <CategoriesSection data={cats} accent={tweaks.accent} />

          <TopVideos tops={tops} onOpen={setOpenVideo} />

          <FullTable rows={metrics} onOpen={setOpenVideo} />
        </div>
      </main>

      <Footer granularity={granularity} />

      {openVideo && <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('dash-root')).render(<App />);
