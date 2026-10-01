const $ = (id) => document.getElementById(id),
  GMIN = 38,
  GMAX = 62;
const I = {
  veggies: ["🥬", "야채"],
  meat: ["🥩", "돼지고기"],
  oil: ["🛢️", "식용유"],
  chunjang: ["🟫", "춘장"],
  sugar: ["🍬", "설탕"],
  garlic: ["🧄", "마늘"],
  noodles: ["🍜", "생면"],
  water: ["🫖", "물"],
  friedVeg: ["🥘", "볶은야채"],
  friedChun: ["🟤", "볶은춘장"],
  jajang: ["🍲", "짜장"],
  boiled: ["🍝", "삶은면"],
};
const K = ["friedVeg", "friedChun", "jajang", "boiled"];
$("shelf").innerHTML = [
  "veggies",
  "meat",
  "oil",
  "chunjang",
  "sugar",
  "garlic",
  "noodles",
  "water",
]
  .map(
    (k) =>
      `<div class="ing" data-id="${k}"><i>${ic(k, 42)}</i>${I[k][1]}</div>`,
  )
  .join("");

/* ---------- 소리 ---------- */
const sfx = {
  c: null,
  n: null,
  i() {
    this.c = this.c || new (window.AudioContext || window.webkitAudioContext)();
    if (this.c.state == "suspended") this.c.resume();
  },
  b(f, d, ty = "triangle", v = 0.15, at = 0) {
    this.i();
    const c = this.c,
      t = c.currentTime + at,
      o = c.createOscillator(),
      g = c.createGain();
    o.type = ty;
    o.frequency.value = f;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + d);
  },
  drop() {
    this.b(420, 0.1);
    this.b(300, 0.08, "sine", 0.1, 0.06);
  },
  ding() {
    this.b(1046, 0.25);
    this.b(1568, 0.3, "sine", 0.1, 0.1);
  },
  cheer() {
    [523, 659, 784, 1046].forEach((f, i) =>
      this.b(f, 0.2, "triangle", 0.18, i * 0.12),
    );
  },
  crash() {
    this.b(110, 0.5, "sawtooth", 0.18);
    this.b(80, 0.5, "square", 0.1, 0.15);
  },
  no() {
    this.b(160, 0.18, "square", 0.1);
  },
  sizzle(on) {
    this.i();
    if (on) {
      const c = this.c,
        r = c.sampleRate,
        b = c.createBuffer(1, r, r),
        d = b.getChannelData(0);
      for (let i = 0; i < r; i++) d[i] = Math.random() * 2 - 1;
      const s = c.createBufferSource(),
        f = c.createBiquadFilter(),
        g = c.createGain();
      s.buffer = b;
      s.loop = true;
      f.type = "highpass";
      f.frequency.value = 3000;
      g.gain.value = 0.05;
      s.connect(f);
      f.connect(g);
      g.connect(c.destination);
      s.start();
      this.n = s;
    } else if (this.n) {
      this.n.stop();
      this.n = null;
    }
  },
};

/* ---------- 주방장 (황근출 해병님) ---------- */
function chef(m) {
  $("chef").innerHTML = $("tchef").innerHTML =
    `<img class="bob ${m}" src="chef.png" alt="황근출 해병님" draggable="false">`;
  minsu(m);
}

let S, ty, tt, fadeT;
function say(t, ms = 2600) {
  talk(t);
  return new Promise((res) => {
    clearInterval(ty);
    clearTimeout(tt);
    const b = $("bubble");
    b.style.display = "block";
    b.textContent = "";
    $("chef").classList.add("talking");
    let i = 0;
    ty = setInterval(() => {
      b.textContent = t.slice(0, ++i);
      if (i >= t.length) {
        clearInterval(ty);
        $("chef").classList.remove("talking");
        tt = setTimeout(() => (b.style.display = "none"), ms);
        res();
      }
    }, 32);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hl = (h) =>
  document
    .querySelectorAll(".ing")
    .forEach((e) => e.classList.toggle("hl", h.includes(e.dataset.id)));
function mood(m, ms = 1800) {
  chef(m);
  clearTimeout(fadeT);
  if (m != "idle") fadeT = setTimeout(() => chef("idle"), ms);
}

/* ---------- 상태 ---------- */
function reset() {
  if (S && S.cook) {
    sfx.sizzle(false);
  }
  S = {
    pan: [],
    pot: [],
    plate: [],
    landed: { pan: [], pot: [], plate: [] },
    slots: {},
    q: {},
    sc: {},
    cook: null,
    heat: 0,
    last: "pan",
    phase: "intro",
    wrong: 0,
  };
  ["pan", "pot"].forEach((v) => $("f_" + v).classList.remove("on"));
  $("needle").style.left = "0%";
  $("cook").textContent = "요리시작";
  $("cook").classList.remove("alt");
  render();
  renderAllCont();
}
function render() {
  for (const v of ["pan", "pot", "plate"])
    $(v + "c").innerHTML = S[v]
      .map((x) => `<span class="chip" title="${I[x][1]}">${ic(x, 20)}</span>`)
      .join("");
  K.forEach((k) => {
    const e = $("p_" + k),
      q = S.slots[k];
    e.className = "prod" + (q ? " have" : "");
    e.innerHTML = q
      ? ic(k, 36) +
        "<span>" +
        I[k][1] +
        "<small>" +
        (q == "good" ? "✨ 잘익음" : q == "burnt" ? "🔥 탐" : "설익음") +
        "</small></span>"
      : I[k][1];
  });
}
function fx(v, c) {
  const e = $(v);
  e.classList.remove("bounce", "shake");
  void e.offsetWidth;
  e.classList.add(c);
}
function recipe(v) {
  const p = S.pan,
    t = S.pot,
    has = (a, ...x) => x.every((i) => a.includes(i));
  if (v == "pan") {
    if (
      p.length == 6 &&
      has(p, "friedVeg", "friedChun", "garlic", "sugar", "oil", "water")
    )
      return "jajang";
    if (p.length == 3 && has(p, "oil", "veggies", "meat")) return "friedVeg";
    if (
      p.length &&
      p.includes("chunjang") &&
      p.every((x) => x == "chunjang" || x == "oil")
    )
      return "friedChun";
  }
  if (v == "pot" && t.length == 2 && has(t, "water", "noodles"))
    return "boiled";
  return null;
}

function drop(id, v) {
  if (S.cook) return;
  const prod = K.includes(id);
  const ok =
    id == "water"
      ? v != "plate"
      : prod
        ? id == "jajang" || id == "boiled"
          ? v == "plate"
          : v == "pan"
        : id == "noodles"
          ? v == "pot"
          : v == "pan";
  if (!ok || S[v].includes(id)) {
    sfx.no();
    fx(v, "shake");
    say(
      !ok ? "새애끼 기열! 거기가 아니다!" : "새애끼 기열! 이미 넣었다 아쎄이!",
      1500,
    );
    return;
  }
  if (prod) S.slots[id] = null;
  S[v].push(id);
  S.last = v;
  const dl = fall(id, v);
  setTimeout(() => {
    if (S[v].includes(id) && !S.landed[v].includes(id)) {
      S.landed[v].push(id);
      renderCont(v, id);
      fx(v, "bounce");
    }
  }, dl);
  sfx.drop();
  render();
  if (v != "plate" && recipe(v)) say("좋다! 요리시작 눌러라 아쎄이!", 1800);
  else if (S.plate.includes("jajang") && S.plate.includes("boiled"))
    say("준비 끝! 완성을 눌러라!", 2000);
}

/* ---------- 요리 ---------- */
function toggleCook() {
  if (S.phase != "play") return;
  if (S.cook) return stop();
  const v = [S.last, "pan", "pot"].find((x) => x != "plate" && recipe(x));
  if (!v) {
    sfx.no();
    if (++S.wrong >= 3) return badEnd();
    mood("mad", 1500);
    say("새애끼 기열! 레시피가 틀렸다! (틀림 " + S.wrong + "/3)");
    return;
  }
  S.cook = { v, r: recipe(v), t: performance.now(), p: 0 };
  S.heat = 0;
  $("cook").textContent = "꺼내기";
  $("cook").classList.add("alt");
  $("f_" + v).classList.add("on");
  $("sc_" + v).classList.add(v == "pot" ? "boil" : "sizz");
  sfx.sizzle(true);
  say("초록일 때 꺼내라! 타이밍이 군기다 아쎄이!", 1500);
  requestAnimationFrame(tick);
}
function tick(now) {
  if (!S.cook || S.cook.paused) return;
  const dt = Math.max(0, Math.min(0.1, (now - S.cook.t) / 1000));
  S.cook.t = now;
  const prev = S.heat;
  S.heat = Math.min(100, S.heat + dt * SPD);
  if (prev < GMIN && S.heat >= GMIN) {
    sfx.ding();
    mood("happy", 900);
  }
  if (prev <= GMAX && S.heat > GMAX) {
    mood("mad", 4000);
    quake();
  }
  $("needle").style.left = S.heat + "%";
  tintUpdate();
  if ((S.cook.p += dt) > 0.12) {
    S.cook.p = 0;
    puff();
  }
  if (S.heat >= 100) return stop();
  requestAnimationFrame(tick);
}
function puff() {
  const e = $(S.cook.v),
    x = e.offsetLeft + e.offsetWidth / 2,
    y = e.offsetTop + e.offsetHeight - 8,
    b = S.heat > GMAX;
  emit(x, y, b ? 3 : 4, {
    w: e.offsetWidth * 0.5,
    v: b ? 50 : 70,
    s: 0.6,
    g: -30,
    t: b ? 1.5 : 1,
    r: b ? 18 : 5,
    c: b ? "70,70,70" : e.id == "pan" ? "255,170,60" : "210,235,255",
    gr: b ? 1.6 : 0.8,
    m: b,
  });
}
function stop() {
  const { v, r } = S.cook,
    z = S.heat < GMIN ? "raw" : S.heat > GMAX ? "burnt" : "good";
  const h0 = S.heat;
  S.sc[r] =
    z == "good"
      ? Math.round(60 + 40 * (1 - Math.min(1, Math.abs(h0 - 50) / 12)))
      : z == "raw"
        ? Math.round((h0 / GMIN) * 30)
        : 10;
  pop(S.sc[r], z, v);
  if (z == "burnt") quake();
  S.cook = null;
  S.q[r] = z;
  S.slots[r] = z;
  S[v] = [];
  S.landed[v] = [];
  $("sc_" + v).classList.remove("sizz", "boil");
  renderCont(v);
  ship(r, v);
  S.heat = 0;
  sfx.sizzle(false);
  $("f_" + v).classList.remove("on");
  $("needle").style.left = "0%";
  $("cook").textContent = "요리시작";
  $("cook").classList.remove("alt");
  z == "good" ? sfx.cheer() : sfx.crash();
  mood(z == "good" ? "happy" : "mad", 2200);
  say(
    I[r][1] +
      (z == "good"
        ? " 완성! 흠... 쓸 만하군."
        : z == "burnt"
          ? "이 까맣게 탔다! 새애끼 기열!"
          : "이 덜 익었다! 새애끼 기열!"),
    2200,
  );
  render();
}

/* ---------- 시식 ---------- */
function finish(force) {
  if (S.phase != "play" || (S.cook && !force)) return;
  if (S.cook) stop();
  if (!force && !(S.plate.includes("jajang") && S.plate.includes("boiled"))) {
    sfx.no();
    fx("plate", "shake");
    say("새애끼 기열! 짜장이랑 면부터 담아라!");
    return;
  }
  S.phase = "taste";
  S.left = force ? 0 : Math.max(0, TL - (performance.now() - S.t0) / 1000);
  $("ovT").classList.remove("hidden");
  $("tt").textContent = "후루룩...";
  $("tl").textContent = "주방장이 맛을 보는 중...";
  $("retry").classList.add("hidden");
  $("share").classList.add("hidden");
  $("share").textContent = "결과 공유";
  clearTimeout(fadeT);
  chef("eat");
  $("stamp").className = "";
  $("tchef").classList.add("talking");
  $("bowl").className = "slurp";
  sfx.b(300, 0.2, "sawtooth", 0.1);
  setTimeout(() => {
    const tot0 = K.reduce((a, k) => a + (S.sc[k] || 0), 0),
      bonus = Math.round((S.left / TL) * 40),
      tot = Math.min(400, tot0 + bonus),
      avg = tot / 4,
      R =
        avg >= 90
          ? [
              "병장",
              "★★★★",
              "충성! 이 맛이 바로 해병 짜장이다!",
              "최고다 민수! 내일부터 취사반장 후임이다!",
            ]
          : avg >= 70
            ? [
                "상병",
                "★★★",
                "음... 제법이군. 짬이 좀 찼다.",
                "조금만 더 다듬으면 병장이다.",
              ]
            : avg >= 40
              ? [
                  "일병",
                  "★★",
                  "먹을 수는 있다만... 군기가 덜 들었다.",
                  "불 조절 정신 차려라!",
                ]
              : [
                  "이병",
                  "★",
                  "이게 짜장이냐 군화 밑창이냐!",
                  "전원 얼차려 대기! 처음부터 다시 만들어라!",
                ],
      bad = K.filter((k) => S.q[k] != "good")
        .map((k) => I[k][1] + (S.q[k] == "burnt" ? "(탐)" : "(설익음)"))
        .join(", ");
    $("bowl").className = "";
    $("tchef").classList.remove("talking");
    chef(avg >= 90 ? "happy" : avg >= 40 ? "idle" : "mad");
    $("tt").textContent =
      S.left <= 0 && !S.plate.includes("boiled")
        ? "시간 초과! 얼차려다!"
        : R[2];
    let nb = 0;
    try {
      const k = "best" + LV;
      if (tot > (+localStorage.getItem(k) || 0)) {
        localStorage.setItem(k, tot);
        nb = 1;
      }
    } catch (e) {}
    $("tl").innerHTML =
      R[3] +
      "<br>총점 <b>" +
      Math.round(tot) +
      "</b> / 400 (시간 보너스 +" +
      bonus +
      ")" +
      (nb ? "<br>🏅 최고 기록 갱신!" : "") +
      (bad ? "<br>🔥 문제: " + bad : "");
    $("stamp").innerHTML = "<small>" + R[1] + "</small>" + R[0];
    $("stamp").className = "show";
    avg >= 90
      ? (sfx.cheer(), confetti())
      : avg >= 40
        ? sfx.b(392, 0.4)
        : (sfx.crash(), quake());
    S.msg =
      "민수와 주방장 1 : 해병 짜장 만들기 — " +
      R[0] +
      " " +
      Math.round(tot) +
      "/400 (" +
      ["신병", "정예", "특등"][LV] +
      ")";
    $("retry").classList.remove("hidden");
    $("share").classList.remove("hidden");
  }, 1900);
}
function confetti() {
  for (let i = 0; i < 28; i++) {
    const d = document.createElement("div");
    d.className = "conf";
    d.textContent = ["🎉", "✨", "🍜", "⭐"][i % 4];
    d.style.left = Math.random() * 100 + "vw";
    d.style.animationDelay = Math.random() * 0.9 + "s";
    document.body.append(d);
    setTimeout(() => d.remove(), 3600);
  }
}

/* ---------- 배드 엔딩 (레시피 3번 틀림) ---------- */
function badEnd() {
  S.phase = "bad";
  clearInterval(tmr);
  sfx.sizzle(false);
  try {
    speechSynthesis.cancel();
  } catch (e) {}
  const T = "해병 전우애를 맛봐야겠군";
  clearTimeout(fadeT);
  chef("mad");
  $("ovT").classList.remove("hidden");
  $("bowl").textContent = "🥵💥";
  $("bowl").className = "";
  $("tchef").classList.remove("talking");
  $("tt").textContent = '"' + T + '"';
  $("tl").innerHTML =
    "레시피를 3번 틀렸다...<br>민수는 해병 전우애를 온몸으로 맛보았다. 🥵";
  $("stamp").innerHTML = "<small>☠</small>BAD END";
  $("stamp").className = "show";
  $("retry").classList.remove("hidden");
  $("share").classList.add("hidden");
  sfx.crash();
  quake();
  setTimeout(() => talk(T), 300);
}

/* ---------- 시작 / 튜토리얼 ---------- */
function start() {
  $("bowl").innerHTML = ic("result", 76);
  bgm.play();
  reset();
  clock();
  S.phase = "play";
  $("ovI").classList.add("hidden");
  $("ovT").classList.add("hidden");
  hl([]);
  chef("idle");
  say("맛있는 해병 짜장을 만드는거다 아쎄이!", 3000);
}
const L = [
  [
    "맛있는 해병 짜장을 만드는거다 아쎄이! 한 번만 보여줄 테니 똑바로 봐라, 민수! (말풍선 클릭: 건너뛰기)",
    [],
  ],
  [
    "팬에 식용유, 야채, 돼지고기를 넣고 요리시작! 막대가 초록일 때 꺼내라!",
    ["oil", "veggies", "meat"],
  ],
  ["춘장도 팬에 따로 볶는다. 군대는 타이밍이다!", ["chunjang"]],
  [
    "볶은 야채와 볶은 춘장에 마늘, 설탕, 식용유, 물을 넣으면 짜장이 완성된다!",
    ["garlic", "sugar", "oil", "water"],
  ],
  [
    "냄비에는 물과 생면! 면도 초록에서 꺼내라. 퍼지면 얼차려다!",
    ["noodles", "water"],
  ],
  [
    "짜장과 면을 그릇에 담고 완성을 눌러라! 레시피 3번 틀리면 해병 전우애 맛이다 아쎄이!",
    [],
  ],
];
async function demo() {
  reset();
  $("ovI").classList.add("hidden");
  S.phase = "demo";
  chef("idle");
  for (const [t, h] of L) {
    if (S.skip) break;
    hl(h);
    await say(t, 300);
    for (let i = 0; i < t.length * 0.4 && !S.skip; i++) await sleep(100);
  }
  S.skip = false;
  start();
}

/* ---------- 입력 ---------- */
let drag = null;
function mv(e) {
  if (drag) {
    drag.g.style.left = e.clientX + "px";
    drag.g.style.top = e.clientY + "px";
  }
}
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest("[data-id]");
  if (!el || !S || S.phase != "play" || S.cook) return;
  const id = el.dataset.id;
  if (el.classList.contains("prod") && !S.slots[id]) return;
  sfx.i();
  const g = document.createElement("div");
  g.id = "ghost";
  g.innerHTML = ic(id, 64);
  document.body.append(g);
  drag = { id, g };
  mv(e);
  e.preventDefault();
});
addEventListener("pointermove", mv);
addEventListener("pointerup", (e) => {
  if (!drag) return;
  drag.g.remove();
  const id = drag.id;
  drag = null;
  const t = document.elementFromPoint(e.clientX, e.clientY);
  const d = t && t.closest("[data-drop]");
  if (d) drop(id, d.dataset.drop);
});
addEventListener("pointercancel", () => {
  if (drag) {
    drag.g.remove();
    drag = null;
  }
});
["pan", "pot", "plate"].forEach((v) =>
  $(v).addEventListener("click", () => {
    if (S.phase == "play" && !S.cook && S[v].length) {
      S[v] = [];
      S.landed[v] = [];
      renderCont(v);
      sfx.no();
      fx(v, "shake");
      render();
      say("새애끼 기열! 다시 담아라 아쎄이!", 1500);
    }
  }),
);
$("chefbox").onclick = () => {
  if (S.phase == "demo") S.skip = true;
};
$("cook").onclick = toggleCook;
$("finish").onclick = () => finish();
$("help").onclick = () => $("ovR").classList.remove("hidden");
$("closeR").onclick = () => $("ovR").classList.add("hidden");
$("skip").onclick = () => {
  sfx.i();
  start();
};
$("demo").onclick = () => {
  sfx.i();
  demo();
};
$("retry").onclick = start;
function fit() {
  $("rot").classList.toggle(
    "hidden",
    innerWidth >= innerHeight || innerWidth > 700,
  );
  $("stage").style.transform =
    `translate(-50%,-50%) scale(${Math.min(innerWidth / 820, innerHeight / 560)})`;
}
addEventListener("resize", fit);
fit();
reset();
chef("idle");

function quake() {
  const s = $("stage"),
    v = $("vig");
  s.classList.remove("quake");
  v.classList.remove("red");
  void s.offsetWidth;
  s.classList.add("quake");
  v.classList.add("red");
}
function pop(sc, z, v) {
  const e = $(v),
    t = document.createElement("div");
  t.className = "pt " + z;
  t.textContent =
    (z == "good"
      ? sc >= 95
        ? "PERFECT! +"
        : "GOOD +"
      : z == "burnt"
        ? "탔다! +"
        : "설익음 +") + sc;
  t.style.left = e.offsetLeft + e.offsetWidth / 2 + "px";
  t.style.top = e.offsetTop - 14 + "px";
  $("stage").append(t);
  setTimeout(() => t.remove(), 1400);
  if (z == "good") {
    const x = e.offsetLeft + e.offsetWidth / 2,
      y = e.offsetTop + 20;
    emit(x, y, sc >= 95 ? 90 : 40, {
      s: 6.28,
      v: sc >= 95 ? 220 : 150,
      g: 220,
      t: 1,
      r: 5,
      c: "255,235,80",
    });
  }
}
function minsu(m) {
  const e =
      {
        happy:
          '<path d="M32 58q6-8 12 0M56 58q6-8 12 0" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>',
        mad: '<circle cx="38" cy="60" r="4" fill="#222"/><circle cx="62" cy="60" r="4" fill="#222"/><path d="M74 40q7 9 0 13q-7-4 0-13" fill="#4fc3f7"/>',
      }[m] ||
      '<circle cx="38" cy="60" r="4" fill="#222"/><circle cx="62" cy="60" r="4" fill="#222"/>',
    mo =
      {
        happy: '<path d="M40 72q10 14 20 0z" fill="#c0392b"/>',
        mad: '<path d="M40 77q10-8 20 0" fill="none" stroke="#222" stroke-width="3"/>',
      }[m] ||
      '<path d="M42 74q8 5 16 0" fill="none" stroke="#222" stroke-width="3"/>';
  $("minsu").innerHTML =
    '<svg viewBox="0 0 100 130" style="overflow:visible"><g class="' +
    (m == "happy" ? "hop" : "bob") +
    '"><path d="M14 130q0-40 36-40t36 40z" fill="#5b6b32" stroke="#222" stroke-width="3"/><circle cx="50" cy="62" r="26" fill="#f7d3a8" stroke="#222" stroke-width="3"/><path d="M22 52q0-30 28-30t28 30q-28-8-56 0z" fill="#33411a" stroke="#222" stroke-width="3"/><text x="50" y="45" text-anchor="middle" font-size="14" fill="#ffd54f">⚓</text>' +
    e +
    mo +
    "</g></svg>";
}

/* ---------- 캔버스 파티클 엔진 (불꽃·김·연기·폭죽, 가산 혼합) ---------- */
const cv = $("fx"),
  cx = cv.getContext("2d"),
  P = [];
function emit(x, y, n, o) {
  for (let i = 0; i < n; i++) {
    const a = (o.a ?? -Math.PI / 2) + (Math.random() - 0.5) * (o.s ?? 1),
      sp = (o.v ?? 60) * (0.4 + Math.random());
    P.push({
      x: x + (Math.random() - 0.5) * (o.w ?? 0),
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      g: o.g ?? 0,
      l: 0,
      t: (o.t ?? 1) * (0.6 + Math.random() * 0.8),
      r: o.r ?? 4,
      c: o.c ?? "255,200,80",
      gr: o.gr ?? 0,
      m: o.m,
    });
  }
}
let lt = performance.now();
(function loop(now) {
  const dt = Math.min(0.05, (now - lt) / 1000);
  lt = now;
  cx.clearRect(0, 0, 784, 524);
  if (S && S.cook && !S.paused) {
    const e = $(S.cook.v);
    emit(
      e.offsetLeft + e.offsetWidth / 2,
      e.offsetTop + e.offsetHeight + 4,
      3,
      {
        w: e.offsetWidth * 0.55,
        v: 100,
        s: 0.5,
        g: -70,
        t: 0.55,
        r: 12,
        c: S.heat > GMAX ? "255,70,20" : "255,150,30",
      },
    );
  }
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i];
    p.l += dt;
    if (p.l > p.t) {
      P.splice(i, 1);
      continue;
    }
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const k = 1 - p.l / p.t,
      r = p.r * (1 + p.gr * (1 - k)),
      d = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    d.addColorStop(0, `rgba(${p.c},${k * (p.m ? 0.55 : 0.9)})`);
    d.addColorStop(1, `rgba(${p.c},0)`);
    cx.globalCompositeOperation = p.m ? "source-over" : "lighter";
    cx.fillStyle = d;
    cx.beginPath();
    cx.arc(p.x, p.y, r, 0, 7);
    cx.fill();
  }
  requestAnimationFrame(loop);
})(lt);

/* ---------- 군가풍 BGM (WebAudio 절차 생성) ---------- */
const bgm = {
  on: false,
  muted: false,
  t: null,
  s: 0,
  play() {
    if (this.on || this.muted) return;
    this.on = true;
    const N = [
      262, 330, 392, 330, 262, 330, 392, 523, 440, 392, 330, 392, 294, 247, 294,
      392,
    ];
    this.t = setInterval(() => {
      const i = this.s++ % 16;
      if (i % 4 == 0) sfx.b(70, 0.18, "sine", 0.14);
      if (i % 4 == 2) sfx.b(220, 0.05, "square", 0.025);
      sfx.b(N[i] / 2, 0.2, "triangle", 0.05);
    }, 190);
  },
  stop() {
    clearInterval(this.t);
    this.on = false;
  },
};
$("mute").onclick = () => {
  bgm.muted = !bgm.muted;
  bgm.muted ? bgm.stop() : bgm.play();
  $("mute").textContent = bgm.muted ? "🔇" : "🔊";
};

/* ---------- 난이도 · 제한시간 · 기록 · 키보드 ---------- */
const SPDS = [9, 13, 18],
  TL = 150;
let LV = 1,
  SPD = 13,
  tmr;
function setLV(i) {
  LV = i;
  SPD = SPDS[i];
  document
    .querySelectorAll("#lv button")
    .forEach((b, k) => b.classList.toggle("on", k == i));
  let b = 0;
  try {
    b = +localStorage.getItem("best" + i) || 0;
  } catch (e) {}
  $("best").textContent = b ? "🏅 최고 기록 " + b + " / 400" : "";
}
document
  .querySelectorAll("#lv button")
  .forEach((b, k) => (b.onclick = () => setLV(k)));
setLV(1);
function clock() {
  clearInterval(tmr);
  S.t0 = performance.now();
  tmr = setInterval(() => {
    if (S.phase != "play" || S.paused) return;
    const r = Math.max(0, TL - Math.floor((performance.now() - S.t0) / 1000));
    $("time").textContent =
      "⏱ " + Math.floor(r / 60) + ":" + String(r % 60).padStart(2, "0");
    $("time").classList.toggle("low", r <= 20);
    if (r == 0) finish(true);
  }, 250);
}
document.addEventListener("keydown", (e) => {
  if (
    e.code == "Space" &&
    e.target.tagName != "BUTTON" &&
    S.phase == "play" &&
    !S.paused
  ) {
    e.preventDefault();
    toggleCook();
  }
});

/* ---------- 주방장 음성 (기기 TTS, 낮은 목소리) ---------- */
function talk(t) {
  try {
    if (bgm.muted || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.replace(/\(.*?\)/g, ""));
    u.lang = "ko-KR";
    u.pitch = 0.5;
    u.rate = 1.15;
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- 일시정지 · 공유 ---------- */
function pause(on) {
  if (S.phase != "play" || !!S.paused == on) return;
  S.paused = on;
  $("ovP").classList.toggle("hidden", !on);
  if (on) {
    S.pt = performance.now();
    bgm.stop();
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    if (S.cook) {
      S.cook.paused = 1;
      sfx.sizzle(false);
    }
  } else {
    S.t0 += performance.now() - S.pt;
    bgm.play();
    if (S.cook) {
      S.cook.t = performance.now();
      S.cook.paused = 0;
      sfx.sizzle(true);
      requestAnimationFrame(tick);
    }
  }
}
$("pause").onclick = () => pause(true);
$("resume").onclick = () => pause(false);
document.addEventListener("keydown", (e) => {
  if (e.code == "KeyP" || e.code == "Escape") pause(!S.paused);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause(true);
});
$("share").onclick = async () => {
  try {
    if (navigator.share)
      await navigator.share({
        title: "해병 짜장 만들기",
        text: S.msg,
        url: location.href,
      });
    else {
      await navigator.clipboard.writeText(S.msg + " " + location.href);
      $("share").textContent = "복사됨!";
    }
  } catch (e) {}
};
