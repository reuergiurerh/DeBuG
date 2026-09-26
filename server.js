const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pxpanel2026";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    configs: [],
    logs: [],
    settings: { panelName: "PXPANEL", background: "/assets/background.jpg" }
  }, null, 2));
}

function db() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false }
}));

app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  if (req.session.authenticated) return next();
  res.status(401).json({ error: "unauthorized" });
}

app.post("/api/login", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: "رمز عبور اشتباه است" });
  req.session.authenticated = true;
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", auth, (req, res) => res.json({ authenticated: true }));

app.get("/api/dashboard", auth, (req, res) => {
  const data = db();
  const active = data.configs.filter(x => !x.disabled && (!x.expiry || new Date(x.expiry) > new Date())).length;
  res.json({
    totalConfigs: data.configs.length,
    activeConfigs: active,
    traffic: data.configs.reduce((n, x) => n + Number(x.traffic || 0), 0),
    uptime: process.uptime()
  });
});

app.get("/api/configs", auth, (req, res) => res.json(db().configs));

app.post("/api/configs", auth, (req, res) => {
  const data = db();
  const body = req.body || {};
  const item = {
    id: crypto.randomUUID(),
    name: String(body.name || "New Config"),
    protocol: String(body.protocol || "VLESS"),
    address: String(body.address || ""),
    port: Number(body.port || 443),
    uuid: String(body.uuid || crypto.randomUUID()),
    traffic: 0,
    expiry: body.expiry || null,
    disabled: false,
    createdAt: new Date().toISOString()
  };
  data.configs.unshift(item);
  data.logs.unshift({ time: new Date().toISOString(), action: "config_created", id: item.id });
  save(data);
  res.json(item);
});

app.delete("/api/configs/:id", auth, (req, res) => {
  const data = db();
  data.configs = data.configs.filter(x => x.id !== req.params.id);
  data.logs.unshift({ time: new Date().toISOString(), action: "config_deleted", id: req.params.id });
  save(data);
  res.json({ ok: true });
});

app.get("/api/settings", auth, (req, res) => res.json(db().settings));

app.post("/api/settings", auth, (req, res) => {
  const data = db();
  data.settings = { ...data.settings, ...req.body };
  save(data);
  res.json(data.settings);
});

app.get("/api/logs", auth, (req, res) => res.json(db().logs.slice(0, 100)));

app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "public/dashboard.html"))
);
app.get("/configs", (req, res) =>
  res.sendFile(path.join(__dirname, "public/configs.html"))
);

app.listen(PORT, () => console.log(`PXPANEL NODE V1 running on :${PORT}`));
