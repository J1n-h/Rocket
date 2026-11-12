(() => {
  'use strict';

  /* =========================================================
   *  기본 데이터
   * ========================================================= */
  const T_START = -10;
  const T_END = 560;

  const PHASES = [
    { t: -10, title: '발사 준비', short: '발사 준비',
      desc: '발사대에 세워진 2단 로켓이 최종 점검을 마치고 카운트다운에 들어갑니다. 아래쪽 큰 몸체가 1단, 그 위가 2단이며, 맨 위 뾰족한 덮개(페어링) 안에 궤도로 보낼 인공위성이 실려 있습니다.' },
    { t: -3, title: '엔진 점화', short: '엔진 점화',
      desc: '1단 엔진이 점화되어 추력을 최대로 끌어올립니다. 엔진이 정상 추력에 도달했는지 확인될 때까지 발사대의 고정 장치가 로켓을 붙잡고 있습니다. 화염을 식히기 위해 뿌린 물이 증발하며 거대한 수증기 구름이 생깁니다.' },
    { t: 0, title: '이륙 (Liftoff)', short: '1단 연소',
      desc: '추력이 로켓의 무게보다 커지는 순간 고정 장치가 풀리며 이륙합니다. 이륙 직후의 추력 대 중량비는 약 1.2~1.5 정도라 처음에는 천천히 오르지만, 추진제를 태워 가벼워질수록 점점 빠르게 가속합니다.' },
    { t: 12, title: '피치 기동 · 중력 선회', short: '1단 연소',
      desc: '발사탑을 벗어나면 로켓이 동쪽으로 조금씩 기울기 시작합니다(피치 기동). 이후에는 중력이 자연스럽게 궤적을 눕히도록 하는 "중력 선회"로 비행합니다. 궤도에 머무르려면 높이보다 수평 속도가 훨씬 중요하기 때문입니다.' },
    { t: 62, title: 'Max-Q (최대 동압)', short: '1단 · 추력 감소',
      desc: '속도는 빨라지고 공기는 아직 짙은 구간으로, 기체가 받는 공기역학적 압력(동압)이 최대가 됩니다. 구조를 보호하기 위해 엔진 추력을 잠시 낮추고, 음속을 넘을 때 기체 주위에 수증기 구름(베이퍼 콘)이 생기기도 합니다.' },
    { t: 150, title: '1단 엔진 정지 (MECO)', short: '관성 비행',
      desc: '1단 추진제가 거의 바닥나면 1단 엔진을 끕니다(Main Engine Cut-Off). 이때 로켓은 고도 약 65km, 속도 약 8,000km/h에 도달해 있으며 공기는 지상의 1만분의 1 수준으로 희박합니다.' },
    { t: 154, title: '1단 분리', short: '단 분리',
      desc: '분리 장치(폭발 볼트와 공압 푸셔)가 작동해 1단과 2단을 떼어 냅니다. 다 쓴 무거운 1단 구조물을 버려 남은 로켓의 질량을 크게 줄이는 것이 다단 로켓의 핵심 원리입니다. 분리된 1단은 포물선 궤적을 그리며 떨어집니다.' },
    { t: 160, title: '2단 엔진 점화', short: '2단 연소',
      desc: '1단과 충분히 거리가 벌어진 뒤 2단 엔진을 점화합니다. 공기가 거의 없는 곳에서 작동하도록 만든 진공용 엔진은 노즐이 크고, 주변 기압이 없어 배기 화염이 넓게 퍼지는 것이 특징입니다.' },
    { t: 200, title: '페어링 분리', short: '2단 연소',
      desc: '고도 약 100km를 넘어 공기 저항과 공력 가열의 위험이 사라지면, 위성을 보호하던 페어링을 두 쪽으로 갈라 버립니다. 쓸모없어진 무게를 줄이면 그만큼 더 무거운 탑재체를 궤도에 올릴 수 있습니다.' },
    { t: 500, title: '2단 정지 (SECO) · 궤도 진입', short: '궤도 진입',
      desc: '목표 궤도 속도(약 7.8km/s, 시속 약 28,000km)에 도달하면 2단 엔진을 끕니다(SECO). 이제 로켓은 추력 없이도 지구 둘레를 계속 떨어지듯 도는 상태, 즉 궤도에 진입했습니다. 이 속도면 지구 한 바퀴를 약 90분에 돕니다.' },
    { t: 520, title: '위성 분리', short: '위성 분리',
      desc: '스프링 분리 장치가 위성을 2단에서 천천히 밀어냅니다. 위성은 태양전지판을 펼쳐 전력을 얻기 시작하고, 남은 2단은 우주 쓰레기가 되지 않도록 이후 궤도에서 이탈시켜 대기권에서 태워 없앱니다.' },
    { t: 545, title: '임무 완료', short: '임무 완료',
      desc: '위성이 스스로 지구 궤도를 돌기 시작했습니다. 이륙 후 약 9분 만에 고도 약 200km의 지구 저궤도에 도달하는 전 과정을 마쳤습니다. 리플레이로 원하는 단계를 다시 확인해 보세요.' },
  ];

  // 시간(s) → 고도(km), 속도(km/s) 근사 프로파일 (일반적인 2단 로켓 저궤도 발사 기준)
  const ALT = [[0, 0], [5, 0.04], [10, 0.17], [20, 0.8], [30, 2], [45, 5.5], [60, 11], [80, 20], [100, 32], [120, 45],
    [150, 65], [160, 72], [200, 105], [250, 138], [300, 162], [400, 190], [500, 200], [600, 200]];
  const VEL = [[0, 0], [5, 0.02], [10, 0.05], [20, 0.12], [30, 0.25], [45, 0.38], [60, 0.5], [80, 0.75], [100, 1.1], [120, 1.5],
    [150, 2.25], [160, 2.2], [200, 2.6], [250, 3.2], [300, 3.9], [400, 5.7], [500, 7.8], [600, 7.8]];

  const EV_SEP1 = 154, EV_FAIRING = 200, EV_DEPLOY = 520;

  /* =========================================================
   *  유틸
   * ========================================================= */
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  function table(tab, t) {
    if (t <= tab[0][0]) return tab[0][1];
    for (let i = 1; i < tab.length; i++) {
      if (t <= tab[i][0]) {
        const [t0, v0] = tab[i - 1], [t1, v1] = tab[i];
        return lerp(v0, v1, (t - t0) / (t1 - t0));
      }
    }
    return tab[tab.length - 1][1];
  }
  const altKm = (t) => (t < 0 ? 0 : table(ALT, t));
  const velKms = (t) => (t < 0 ? 0 : table(VEL, t));
  function pitchDeg(t) {
    if (t < 12) return 0;
    const u = clamp((t - 12) / 470, 0, 1);
    return 82 * (1 - Math.pow(1 - u, 1.7));
  }
  // 결정적 난수 (리플레이/탐색 시 동일한 장면)
  function rnd(seed) { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  // 비행 경로 적분 (수평 이동거리 PX, 수직 PY, m)
  const PATH_DT = 0.25;
  const PX = [0], PY = [0];
  for (let tt = 0; tt < T_END + 1; tt += PATH_DT) {
    const v = velKms(tt) * 1000, p = pitchDeg(tt) * Math.PI / 180;
    PX.push(PX[PX.length - 1] + v * Math.sin(p) * PATH_DT);
    PY.push(PY[PY.length - 1] + v * Math.cos(p) * PATH_DT);
  }
  function pathAt(t) {
    if (t <= 0) return [0, 0];
    const f = t / PATH_DT, i = Math.min(Math.floor(f), PX.length - 2), k = f - i;
    return [lerp(PX[i], PX[i + 1], k), lerp(PY[i], PY[i + 1], k)];
  }

  // 미션 1초가 실제 몇 초로 재생되는지 (분리 장면은 천천히)
  function rate(t) {
    if (t < 0) return 2;
    if ((t >= 147 && t < 168) || (t >= 196 && t < 206) || (t >= 497 && t < 532)) return 2;
    if (t < 150) return 6;
    if (t >= 532) return 3;
    return 14;
  }

  const fmtT = (t) => {
    const sign = t < 0 ? '-' : '+';
    const a = Math.abs(Math.round(t));
    return `T${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
  };
  const phaseIndexAt = (t) => { let i = 0; for (let k = 0; k < PHASES.length; k++) if (PHASES[k].t <= t + 1e-6) i = k; return i; };

  /* =========================================================
   *  상태
   * ========================================================= */
  const canvas = $('scene');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  let t = T_START;
  let running = false;
  let speed = 1;
  let prevIdx = 0;
  let particles = [];
  let prevGroundY = null;
  let toastTimer = 0;

  const stars = Array.from({ length: 220 }, (_, i) => ({
    x: rnd(i + 1), y: rnd(i + 500), r: 0.4 + rnd(i + 900) * 1.3, a: 0.4 + rnd(i + 1300) * 0.6, layer: rnd(i + 1700) < 0.5 ? 1 : 2,
  }));

  /* =========================================================
   *  카메라 (현재 남아 있는 기체 기준)
   * ========================================================= */
  // 기체 좌표: 1단 노즐 끝 y=12, 위로 갈수록 음수. 페어링 꼭대기 y=-268
  function stackAt(tt) {
    if (tt >= EV_DEPLOY) return { top: -236, bottom: -214 };
    if (tt >= EV_FAIRING) return { top: -236, bottom: -146 };
    if (tt >= EV_SEP1) return { top: -268, bottom: -146 };
    return { top: -268, bottom: 12 };
  }
  function camera(tt) {
    let cur = stackAt(tt);
    for (const ev of [EV_SEP1, EV_FAIRING, EV_DEPLOY]) {
      if (tt >= ev && tt < ev + 5) {
        const prev = stackAt(ev - 0.01), k = smooth((tt - ev) / 5);
        cur = { top: lerp(prev.top, cur.top, k), bottom: lerp(prev.bottom, cur.bottom, k) };
      }
    }
    return { center: (cur.top + cur.bottom) / 2, len: cur.bottom - cur.top };
  }

  /* =========================================================
   *  그리기: 배경
   * ========================================================= */
  const SKY = [ // 고도(km), 위쪽 색, 아래쪽 색
    [0, [58, 132, 214], [150, 200, 240]],
    [8, [30, 84, 170], [90, 150, 220]],
    [20, [14, 40, 100], [40, 90, 170]],
    [40, [5, 12, 40], [16, 40, 95]],
    [70, [2, 3, 10], [6, 12, 34]],
    [200, [1, 2, 6], [3, 5, 14]],
  ];
  function skyColors(a) {
    for (let i = 1; i < SKY.length; i++) {
      if (a <= SKY[i][0]) {
        const k = (a - SKY[i - 1][0]) / (SKY[i][0] - SKY[i - 1][0]);
        const mix = (c0, c1) => `rgb(${c0.map((v, j) => Math.round(lerp(v, c1[j], k))).join(',')})`;
        return [mix(SKY[i - 1][1], SKY[i][1]), mix(SKY[i - 1][2], SKY[i][2])];
      }
    }
    const l = SKY[SKY.length - 1];
    return [`rgb(${l[1]})`, `rgb(${l[2]})`];
  }

  function drawSky(a) {
    const [top, bot] = skyColors(a);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars(a, px, py) {
    const alpha = smooth((a - 18) / 45);
    if (alpha <= 0) return;
    const tile = Math.max(W, H);
    for (const s of stars) {
      const k = s.layer === 1 ? 0.0012 : 0.0028;
      let x = (s.x * tile - px * k) % tile; if (x < 0) x += tile;
      let y = (s.y * tile + py * k) % tile; if (y < 0) y += tile;
      if (x > W || y > H) continue;
      ctx.globalAlpha = alpha * s.a;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawEarth(a, px) {
    const k = smooth((a - 22) / 45);
    if (k <= 0) return;
    const h = smooth((a - 22) / 180);
    const horizon = H * lerp(1.12, 0.74, h);
    const R = Math.max(W, H) * lerp(5, 2.2, h);
    const cx = W / 2, cy = horizon + R;
    ctx.save();
    ctx.globalAlpha = k;
    // 대기 광채
    const glow = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.06);
    glow.addColorStop(0, 'rgba(110,180,255,0.9)');
    glow.addColorStop(0.35, 'rgba(70,140,255,0.35)');
    glow.addColorStop(1, 'rgba(40,90,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2); ctx.fill();
    // 바다
    const sea = ctx.createLinearGradient(0, horizon, 0, H);
    sea.addColorStop(0, '#2c6fc4'); sea.addColorStop(0.25, '#1b4f9a'); sea.addColorStop(1, '#0c2a5a');
    ctx.fillStyle = sea;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // 땅/구름 (지구 자전 + 비행 방향으로 흐름)
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    const span = W * 2.4;
    const off = (px * 0.0011 * (W / 600)) % span;
    for (let i = 0; i < 9; i++) {
      let x = rnd(i + 40) * span - off; if (x < -W * 0.7) x += span;
      const depth = rnd(i + 60);
      const y = horizon + 8 + depth * (H - horizon) * 0.9;
      const scale = 0.35 + depth * 0.9;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(235,240,250,0.55)' : 'rgba(70,120,60,0.85)';
      ctx.beginPath();
      ctx.ellipse(x, y, (60 + rnd(i + 80) * 120) * scale, (8 + rnd(i + 90) * 16) * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function cloudBlob(x, y, s, alpha) {
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 60 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 30 * s, y - 8 * s, 28 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 20 * s, y - 12 * s, 34 * s, 22 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  function drawClouds(a, px) {
    const layers = [[2.2, 1.0, 0.85], [5, 0.8, 0.75], [9, 0.6, 0.55]];
    const unit = Math.min(W, H) / 400;
    layers.forEach(([cAlt, sc, al], li) => {
      const y0 = H * 0.5 + (a - cAlt) * H * 0.9;
      if (y0 < -120 || y0 > H + 120) return;
      const span = W * 1.4;
      for (let i = 0; i < 5; i++) {
        let x = (rnd(li * 10 + i) * span - px * 0.03 * (li + 1)) % span; if (x < 0) x += span;
        x -= W * 0.2;
        const y = y0 + (rnd(li * 10 + i + 5) - 0.5) * H * 0.25;
        cloudBlob(x, y, sc * unit * (0.8 + rnd(i + li * 3) * 0.6), al);
      }
    });
  }

  function drawGround(groundY, s, px) {
    if (groundY > H + 40) return;
    const cx = W / 2;
    const shift = px * 0.4 * s;
    // 먼 산
    ctx.fillStyle = '#5d7f9e';
    ctx.beginPath(); ctx.moveTo(0, groundY);
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * W;
      ctx.lineTo(x, groundY - (18 + rnd(i + 7) * 40) * s * 0.6);
    }
    ctx.lineTo(W, groundY); ctx.closePath(); ctx.fill();
    // 지면
    const g = ctx.createLinearGradient(0, groundY, 0, groundY + 120);
    g.addColorStop(0, '#4f7a3d'); g.addColorStop(1, '#2c4a24');
    ctx.fillStyle = g;
    ctx.fillRect(0, groundY, W, Math.max(0, H - groundY) + 2);
    // 발사대
    const padX = cx - shift;
    ctx.fillStyle = '#9aa1ab';
    ctx.fillRect(padX - 46 * s, groundY - 4 * s, 92 * s, 8 * s);
    ctx.fillStyle = '#6b727c';
    ctx.fillRect(padX - 34 * s, groundY - 2 * s, 68 * s, 14 * s);
    // 발사탑
    const tx = padX + 26 * s, top = groundY - 262 * s, tw = 12 * s;
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = Math.max(1, 1.4 * s);
    ctx.strokeRect(tx, top, tw, groundY - top);
    ctx.beginPath();
    for (let y = top; y < groundY; y += 14 * s) {
      ctx.moveTo(tx, y); ctx.lineTo(tx + tw, y + 14 * s);
      ctx.moveTo(tx + tw, y); ctx.lineTo(tx, y + 14 * s);
    }
    ctx.stroke();
    // 엄빌리컬 암
    ctx.fillStyle = '#8a3026';
    for (const ay of [-232, -150, -60]) ctx.fillRect(tx - 12 * s, groundY + ay * s, 12 * s, 3 * s);
  }

  /* =========================================================
   *  그리기: 로켓 (기체 좌표계)
   * ========================================================= */
  function bodyGrad(w) {
    const g = ctx.createLinearGradient(-w, 0, w, 0);
    g.addColorStop(0, '#aeb5bf'); g.addColorStop(0.35, '#ffffff'); g.addColorStop(0.7, '#e4e8ee'); g.addColorStop(1, '#8f97a3');
    return g;
  }
  function bell(x, y, topW, botW, h) {
    ctx.beginPath();
    ctx.moveTo(x - topW / 2, y); ctx.lineTo(x + topW / 2, y);
    ctx.lineTo(x + botW / 2, y + h); ctx.lineTo(x - botW / 2, y + h); ctx.closePath(); ctx.fill();
  }
  function drawStage1() {
    ctx.fillStyle = '#3a3f48';
    for (const x of [-7, 0, 7]) bell(x, 2, 3, 6, 10);
    ctx.fillStyle = bodyGrad(12);
    ctx.fillRect(-12, -150, 24, 152);
    ctx.fillStyle = '#2b2f37'; ctx.fillRect(-12, -6, 24, 8);
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-12, -104, 24, 3);
    ctx.fillStyle = '#e53935'; ctx.fillRect(-12, -99, 24, 2);
    // 1단 표기
    ctx.save(); ctx.fillStyle = '#1b2230'; ctx.font = 'bold 9px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center'; ctx.translate(0, -60); ctx.rotate(-Math.PI / 2); ctx.fillText('1단 STAGE', 0, 3); ctx.restore();
    // 인터스테이지
    ctx.fillStyle = '#262a31'; ctx.fillRect(-12, -160, 24, 10);
    // 그리드 핀 / 착륙 다리
    ctx.fillStyle = '#555b66'; ctx.fillRect(-16, -158, 4, 6); ctx.fillRect(12, -158, 4, 6);
    ctx.fillStyle = '#30343c'; ctx.fillRect(-13.5, -42, 2, 40); ctx.fillRect(11.5, -42, 2, 40);
  }
  function drawStage2() {
    ctx.fillStyle = '#2f343c';
    bell(0, -160, 5, 16, 15);
    ctx.fillStyle = bodyGrad(12);
    ctx.fillRect(-12, -216, 24, 56);
    ctx.fillStyle = '#2b2f37'; ctx.fillRect(-12, -166, 24, 6);
    ctx.save(); ctx.fillStyle = '#1b2230'; ctx.font = 'bold 8px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center'; ctx.translate(0, -190); ctx.rotate(-Math.PI / 2); ctx.fillText('2단', 0, 3); ctx.restore();
  }
  function drawPayload(tt) {
    // 어댑터
    ctx.fillStyle = '#6f7682'; bell(0, -220, 10, 18, 4);
    // 태양전지판
    const k = smooth((tt - (EV_DEPLOY + 3)) / 4);
    if (k > 0) {
      const w = 34 * k;
      ctx.fillStyle = '#1c3d8f';
      ctx.fillRect(-9 - w, -230, w, 8); ctx.fillRect(9, -230, w, 8);
      ctx.strokeStyle = 'rgba(160,200,255,.55)'; ctx.lineWidth = 0.4;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) { ctx.moveTo(-9 - x, -230); ctx.lineTo(-9 - x, -222); ctx.moveTo(9 + x, -230); ctx.lineTo(9 + x, -222); }
      ctx.moveTo(-9 - w, -226); ctx.lineTo(-9, -226); ctx.moveTo(9, -226); ctx.lineTo(9 + w, -226);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1c3d8f'; ctx.fillRect(-10, -233, 2, 12); ctx.fillRect(8, -233, 2, 12);
    }
    // 본체 (금박 단열재)
    const g = ctx.createLinearGradient(-8, 0, 8, 0);
    g.addColorStop(0, '#a47a1c'); g.addColorStop(0.45, '#f4cf5c'); g.addColorStop(1, '#8c6614');
    ctx.fillStyle = g; ctx.fillRect(-8, -234, 16, 14);
    // 안테나
    ctx.fillStyle = '#d9dde3';
    ctx.beginPath(); ctx.ellipse(0, -236, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
  }
  function fairingPath(side) {
    ctx.beginPath();
    ctx.moveTo(0, -268);
    ctx.quadraticCurveTo(13 * side, -262, 13 * side, -245);
    ctx.lineTo(13 * side, -216); ctx.lineTo(0, -216); ctx.closePath();
  }
  function drawFairingHalf(side) {
    ctx.fillStyle = bodyGrad(13);
    fairingPath(side); ctx.fill();
    ctx.strokeStyle = 'rgba(40,46,56,.55)'; ctx.lineWidth = 0.6; ctx.stroke();
  }

  function flame(y, w, len, spread, alpha, hue) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const j = 0.88 + Math.random() * 0.24;
    const L = len * j;
    const g = ctx.createLinearGradient(0, y, 0, y + L);
    if (hue === 'vac') {
      g.addColorStop(0, `rgba(230,240,255,${alpha})`);
      g.addColorStop(0.2, `rgba(150,180,255,${alpha * 0.7})`);
      g.addColorStop(0.6, `rgba(110,120,255,${alpha * 0.25})`);
      g.addColorStop(1, 'rgba(80,80,255,0)');
    } else {
      g.addColorStop(0, `rgba(255,255,235,${alpha})`);
      g.addColorStop(0.18, `rgba(255,215,110,${alpha * 0.95})`);
      g.addColorStop(0.55, `rgba(255,120,40,${alpha * 0.6})`);
      g.addColorStop(1, 'rgba(255,60,20,0)');
    }
    ctx.fillStyle = g;
    const half = w / 2, bw = half * spread;
    ctx.beginPath();
    ctx.moveTo(-half, y);
    ctx.bezierCurveTo(-bw, y + L * 0.35, -bw * 0.6, y + L * 0.8, 0, y + L);
    ctx.bezierCurveTo(bw * 0.6, y + L * 0.8, bw, y + L * 0.35, half, y);
    ctx.closePath(); ctx.fill();
    // 코어
    const c = ctx.createLinearGradient(0, y, 0, y + L * 0.45);
    c.addColorStop(0, `rgba(255,255,255,${alpha})`); c.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(-half * 0.6, y); ctx.quadraticCurveTo(0, y + L * 0.6, half * 0.6, y); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function puffs(tt, ev, y, count, spreadX, seed) {
    const tau = tt - ev;
    if (tau < 0 || tau > 3) return;
    const a = 1 - tau / 3;
    for (let i = 0; i < count; i++) {
      const ang = rnd(seed + i) * Math.PI * 2;
      const sp = 6 + rnd(seed + i + 50) * 14;
      const x = Math.cos(ang) * sp * tau * spreadX;
      const yy = y + Math.sin(ang) * sp * tau * 0.6;
      ctx.fillStyle = `rgba(235,240,250,${0.55 * a})`;
      ctx.beginPath(); ctx.arc(x, yy, 1.5 + tau * 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  function vaporCone(tt) {
    const k = Math.max(0, 1 - Math.abs(tt - 67) / 11);
    if (k <= 0) return;
    ctx.save();
    const g = ctx.createLinearGradient(0, -230, 0, -120);
    g.addColorStop(0, `rgba(255,255,255,${0.5 * k})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-14, -235);
    ctx.quadraticCurveTo(-30, -180, -46 - Math.random() * 3, -120);
    ctx.lineTo(46 + Math.random() * 3, -120);
    ctx.quadraticCurveTo(30, -180, 14, -235);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function withPart(dx, dy, rot, pivotY, fn) {
    ctx.save();
    ctx.translate(dx, dy + pivotY); ctx.rotate(rot); ctx.translate(0, -pivotY);
    fn();
    ctx.restore();
  }

  function drawVehicle(tt, a) {
    const plume = smooth(a / 55);
    // 2단 화염
    if (tt >= 160 && tt < 500) {
      const ramp = smooth((tt - 160) / 1.5) * (1 - smooth((tt - 499) / 1));
      flame(-145, 14, 70 + 50 * plume, 1.6 + 2.2 * plume, 0.9 * ramp, 'vac');
    }
    // 1단 화염
    if (tt >= -3 && tt < 150) {
      let thr = tt < 0 ? 0.45 + 0.55 * smooth((tt + 3) / 3) : 1;
      if (tt > 55 && tt < 80) thr *= 0.72;
      thr *= 1 - smooth((tt - 149.2) / 0.8);
      flame(12, 22, (60 + 70 * plume) * thr, 1.2 + 2.4 * plume, 0.95, 'std');
    }

    // 1단 (분리 후 뒤로 멀어짐)
    if (tt >= EV_SEP1 && tt < EV_SEP1 + 40) {
      const tau = tt - EV_SEP1;
      withPart(0, 5 * tau + 2.4 * tau * tau, 0.01 * tau * tau, -70, drawStage1);
    }
    // 2단 (위성 분리 후 뒤로)
    {
      const tau = Math.max(0, tt - EV_DEPLOY);
      if (tau < 60) withPart(0, 2.2 * tau + 0.2 * tau * tau, 0.01 * tau, -190, drawStage2);
    }
    // 1단은 2단 위에 겹쳐 인터스테이지가 2단 노즐을 가림 → 다시 그림 순서 조정
    if (tt < EV_SEP1) drawStage1();

    // 위성
    drawPayload(tt);

    // 페어링
    if (tt < EV_FAIRING + 30) {
      const tau = Math.max(0, tt - EV_FAIRING);
      const dx = 5 * tau + 1.6 * tau * tau, dy = 2.5 * tau + 0.9 * tau * tau, r = 0.3 * tau;
      withPart(-dx, dy, -r, -216, () => drawFairingHalf(-1));
      withPart(dx, dy, r, -216, () => drawFairingHalf(1));
    }

    vaporCone(tt);
    puffs(tt, EV_SEP1, -156, 16, 1.6, 10);
    puffs(tt, EV_FAIRING, -240, 12, 1.2, 70);
    puffs(tt, EV_DEPLOY, -216, 8, 1.0, 130);
  }

  /* =========================================================
   *  연기 파티클 (화면 좌표)
   * ========================================================= */
  function emitSmoke(nx, ny, groundY, dtReal) {
    const near = clamp(1 - (ny < groundY ? (groundY - ny) / (H * 0.6) : 0), 0, 1);
    const n = Math.round((t < 0 ? 26 : 16) * dtReal * 60 * (0.3 + near));
    for (let i = 0; i < n && particles.length < 500; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const sp = near > 0.5 ? 40 + Math.random() * 160 : 10 + Math.random() * 30;
      particles.push({
        x: nx + (Math.random() - 0.5) * 10,
        y: Math.min(ny + Math.random() * 10, groundY - 4),
        vx: side * sp * (near > 0.5 ? 1 : 0.4),
        vy: -Math.random() * 20,
        r: 6 + Math.random() * 10,
        life: 0, max: 2.5 + Math.random() * 2.5,
      });
    }
  }
  function updateParticles(dtReal, shiftY) {
    for (const p of particles) {
      p.life += dtReal;
      p.x += p.vx * dtReal; p.y += p.vy * dtReal + shiftY;
      p.vx *= 0.985; p.r += 12 * dtReal;
    }
    particles = particles.filter((p) => p.life < p.max && p.y < H + 200);
  }
  function drawParticles() {
    for (const p of particles) {
      const a = (1 - p.life / p.max) * 0.5;
      ctx.fillStyle = `rgba(225,225,228,${a})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* =========================================================
   *  프레임 렌더
   * ========================================================= */
  function render(dtReal) {
    const a = altKm(t);
    const [px, py] = pathAt(t);
    const cam = camera(t);
    const s = Math.min((H * 0.62) / Math.max(cam.len, 80), W / 100);
    const cx = W / 2, cy = H * 0.5;
    const pitch = Math.min(pitchDeg(t), 62) * Math.PI / 180;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawSky(a);
    drawStars(a, px, py);
    drawEarth(a, px);
    drawClouds(a, px);

    const groundY = cy + (12 - cam.center) * s + a * 1000 * 0.5 * s;
    drawGround(groundY, s, px);

    // 화면 흔들림 (이륙 직후)
    let shakeX = 0, shakeY = 0;
    if (running && t > -3 && t < 25) {
      const m = (t < 0 ? 1.2 : 2.2) * (1 - smooth(t / 25));
      shakeX = (Math.random() - 0.5) * m; shakeY = (Math.random() - 0.5) * m;
    }

    ctx.save();
    ctx.translate(cx + shakeX, cy + shakeY);
    ctx.rotate(pitch);
    ctx.scale(s, s);
    ctx.translate(0, -cam.center);
    drawVehicle(t, a);
    ctx.restore();

    // 연기
    const shiftY = prevGroundY == null ? 0 : groundY - prevGroundY;
    prevGroundY = groundY;
    if (running && t >= -3 && t < 40 && dtReal > 0) {
      const ly = 12 + 20 - cam.center;
      const nx = cx - Math.sin(pitch) * ly * s, ny = cy + Math.cos(pitch) * ly * s;
      emitSmoke(nx, ny, groundY, dtReal);
    }
    updateParticles(dtReal, Math.abs(shiftY) < H ? shiftY : 0);
    drawParticles();
  }

  /* =========================================================
   *  UI
   * ========================================================= */
  const ui = {
    tTime: $('tTime'), tAlt: $('tAlt'), tVel: $('tVel'), tStage: $('tStage'),
    toast: $('toast'), big: $('bigStart'), play: $('btnPlay'), replay: $('btnReplay'), next: $('btnNext'),
    scrub: $('scrub'), ticks: $('ticks'), tlNow: $('tlNow'),
    nowTime: $('nowTime'), nowTitle: $('nowTitle'), nowDesc: $('nowDesc'), list: $('phaseList'), explain: $('explain'),
  };

  // 단계 목록 + 타임라인 눈금
  PHASES.forEach((p, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    for (const [cls, text] of [['time', fmtT(p.t)], ['name', p.title], ['mark', '']]) {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      b.appendChild(span);
    }
    b.addEventListener('click', () => { seek(i === 0 ? T_START : p.t - 1.5); if (!running) play(); });
    li.appendChild(b);
    ui.list.appendChild(li);
    const tick = document.createElement('i');
    tick.style.left = `${((p.t - T_START) / (T_END - T_START)) * 100}%`;
    ui.ticks.appendChild(tick);
  });
  const items = [...ui.list.children];

  let lastShownIdx = -1;
  function updateUI() {
    const idx = phaseIndexAt(t);
    const p = PHASES[idx];
    ui.tTime.textContent = fmtT(t);
    ui.tAlt.textContent = `${altKm(t).toFixed(1)} km`;
    ui.tVel.textContent = `${Math.round(velKms(t) * 3600).toLocaleString('ko-KR')} km/h`;
    ui.tStage.textContent = p.short;
    ui.scrub.value = t;
    ui.scrub.style.setProperty('--p', `${((t - T_START) / (T_END - T_START)) * 100}%`);
    ui.nowTime.textContent = fmtT(t);

    if (idx !== lastShownIdx) {
      lastShownIdx = idx;
      ui.nowTitle.textContent = p.title;
      ui.nowDesc.textContent = p.desc;
      ui.tlNow.textContent = p.title;
      items.forEach((li, i) => {
        li.classList.toggle('past', i < idx);
        li.classList.toggle('current', i === idx);
        li.querySelector('.mark').textContent = i < idx ? '✓' : i === idx ? '●' : '';
      });
      // 데스크톱처럼 설명 패널이 따로 스크롤될 때만 자동 스크롤
      const box = ui.explain;
      if (box.scrollHeight > box.clientHeight + 4 && getComputedStyle(box).overflowY === 'auto') {
        const li = items[idx];
        const nowH = box.querySelector('.now').offsetHeight;
        const target = box.scrollTop + (li.getBoundingClientRect().top - box.getBoundingClientRect().top) - nowH - 28;
        box.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
      }
    }

    ui.play.textContent = running ? '⏸ 일시정지' : t >= T_END ? '↺ 다시 보기' : t > T_START ? '▶ 계속' : '▶ 시작';
    ui.play.setAttribute('aria-pressed', String(running));
    ui.big.hidden = running || (t > T_START && t < T_END);
    ui.big.textContent = t >= T_END ? '↺ 다시 보기' : '▶ 발사 시작';
  }

  function showToast(text) {
    ui.toast.textContent = text;
    ui.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 2400);
  }

  function play() {
    if (t >= T_END) seek(T_START);
    running = true; updateUI();
  }
  function pause() { running = false; updateUI(); }
  function toggle() { running ? pause() : play(); }
  function seek(nt) {
    t = clamp(nt, T_START, T_END);
    particles = []; prevGroundY = null;
    prevIdx = phaseIndexAt(t);
    updateUI();
    if (!running) render(0);
  }
  function replay() { seek(T_START); play(); }
  function nextPhase() {
    const n = PHASES.find((p) => p.t > t + 0.05);
    if (!n) return;
    seek(n.t - 1.5);
    if (!running) play();
  }

  ui.play.addEventListener('click', toggle);
  ui.big.addEventListener('click', () => (t >= T_END ? replay() : play()));
  ui.replay.addEventListener('click', replay);
  ui.next.addEventListener('click', nextPhase);
  ui.scrub.addEventListener('input', () => seek(parseFloat(ui.scrub.value)));
  document.querySelectorAll('.seg button').forEach((b) => {
    b.addEventListener('click', () => {
      speed = parseFloat(b.dataset.speed);
      document.querySelectorAll('.seg button').forEach((x) => x.classList.toggle('on', x === b));
    });
  });
  window.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.key === 'r' || e.key === 'R') replay();
    else if (e.key === 'ArrowRight') nextPhase();
  });

  /* =========================================================
   *  크기 대응 + 루프
   * ========================================================= */
  function resize() {
    const r = canvas.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    prevGroundY = null; particles = [];
    render(0);
  }
  new ResizeObserver(resize).observe($('sim'));

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (running) {
      t += dt * rate(t) * speed;
      if (t >= T_END) { t = T_END; running = false; showToast('🛰️ 임무 완료!'); }
      const idx = phaseIndexAt(t);
      if (idx > prevIdx && idx < PHASES.length - 1) showToast(PHASES[idx].title);
      prevIdx = idx;
      updateUI();
    }
    render(running ? dt : 0);
    requestAnimationFrame(frame);
  }

  resize();
  updateUI();
  requestAnimationFrame(frame);
})();
