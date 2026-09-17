# Deploying TaskForge

TaskForge ships with a **production Docker stack**: nginx serves the React build and proxies `/api` to the Express backend. One port, one domain.

## Option 1: VPS (recommended)

Works on any Linux server with Docker — DigitalOcean, Hetzner, AWS EC2, etc.

### 1. Provision a server

- **OS:** Ubuntu 22.04+
- **Size:** 1 GB RAM minimum (2 GB recommended)
- Open ports **80** (HTTP) and **443** (HTTPS, optional)

### 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in, then:
docker compose version
```

### 3. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/TaskForge.git
cd TaskForge
```

### 4. Configure environment

```bash
cp .env.production.example .env.production
```

Edit `.env.production`:

```env
CLIENT_URL=http://YOUR_SERVER_IP
JWT_SECRET=paste-output-of-openssl-rand-hex-64
HTTP_PORT=80
```

Generate a secret:

```bash
openssl rand -hex 64
```

> Once you add a domain, change `CLIENT_URL` to `https://yourdomain.com`.

### 5. Deploy

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

Open **http://YOUR_SERVER_IP** in your browser.

### 6. Add HTTPS (optional but recommended)

Install [Caddy](https://caddyserver.com/) or Certbot on the host, or put Caddy in front of port 80.

**Quick Caddy example** (`/etc/caddy/Caddyfile`):

```
yourdomain.com {
    reverse_proxy localhost:80
}
```

Then update `.env.production`:

```env
CLIENT_URL=https://yourdomain.com
```

Redeploy:

```bash
./scripts/deploy.sh
```

---

## Option 2: MongoDB Atlas (managed database)

For production, a managed database is more reliable than self-hosted MongoDB.

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/TaskForge`
3. In `.env.production`, set:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/TaskForge
```

4. Remove the `database` service from `docker-compose.prod.yml` (or comment it out)
5. Run `./scripts/deploy.sh`

---

## Useful commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop
docker compose -f docker-compose.prod.yml down

# Rebuild after code changes
./scripts/deploy.sh

# Health check
curl http://YOUR_SERVER_IP/api/health
```

---

## Architecture (production)

```
Internet
   │
   ▼
┌─────────────────────────────┐
│  nginx (frontend container) │  :80
│  ├── /      → React static  │
│  └── /api   → backend:5000  │
└─────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Express backend │────▶│   MongoDB    │
└─────────────────┘     └──────────────┘
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLIENT_URL` | Yes | Public app URL (CORS origin) |
| `JWT_SECRET` | Yes | Long random string for JWT signing |
| `HTTP_PORT` | No | Host port (default `80`) |
| `MONGO_URI` | No | Defaults to bundled MongoDB container |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page after login | Check `CLIENT_URL` matches the URL in your browser |
| CORS errors | `CLIENT_URL` must exactly match origin (including `https://`) |
| Backend won't start | Verify `JWT_SECRET` is set in `.env.production` |
| Port 80 in use | Set `HTTP_PORT=8080` in `.env.production` |
