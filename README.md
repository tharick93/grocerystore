# FreshHarvest — Premium Online Grocery Store

A fully responsive, animated grocery delivery website built with **HTML5**, **CSS3**, and **Vanilla JavaScript** only (no frameworks).

## Quick Start

1. Open `index.html` in your browser (double-click or use Live Server).
2. Browse products and click **+ Cart** to add items.
3. View cart at `cart.html` — cart persists via `localStorage`.

## Demo Login Credentials

| Role     | Email                      | Password  |
|----------|----------------------------|-----------|
| Customer | user@freshharvest.com      | user123   |
| Admin    | admin@freshharvest.com     | admin123  |
| Employee | employee@freshharvest.com  | emp123    |

## Pages

- `index.html` — Home (15+ sections)
- `about.html` — Company story, team, timeline
- `services.html` — Services & membership plans
- `cart.html` — Cart & checkout
- `contact.html` — Contact form, map UI, live chat
- `login.html` — Login with role tabs
- `signup.html` — Registration
- `admin-dashboard.html` — Admin panel
- `employee-dashboard.html` — Delivery employee panel

## Promo Codes (Cart)

- `FRESH40` — 40% off
- `SAVE10` — 10% off

## Project Structure

```
├── index.html, about.html, services.html, cart.html, contact.html
├── login.html, signup.html, admin-dashboard.html, employee-dashboard.html
├── css/     (common.css + per-page styles)
├── js/      (common.js + per-page scripts)
├── images/, icons/, assets/
```

## Features

- Light / Dark mode toggle
- Working cart (add, remove, qty, localStorage)
- Scroll reveal animations, sliders, counters, FAQ accordions
- Responsive hamburger menu
- Admin: products CRUD, orders, charts (Canvas)
- Employee: deliveries, tracking, stock, tasks
