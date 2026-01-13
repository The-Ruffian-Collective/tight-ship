# Food‑Safety Compliance App – Product Requirements Document (PRD)

**Version 0.1**   |   **Last updated:** 12 Jan 2026  
**Owner:** Paulie   

---

## 1  Purpose

Provide UK hospitality kitchens with a simple, mobile‑responsive web application called "Tight Ship", that digitises HACCP/EHO record‑keeping, slashes paperwork time, and keeps every site audit‑ready.

---

## 2  Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Replace paper logs | Kitchens fully digital after onboarding | 100 % within 7 days |
| Entry speed | Avg. time for staff to complete daily checklist | < 2 min |
| Compliance | EHO inspection passes using digital log | 100 % |
| Engagement | Daily active staff users (DAU) / total staff | ≥ 80 % |

---

## 3  User Personas

* **Manager** – Head Chef / GM. Creates tasks, reviews logs, faces inspectors.  
* **Staff** – Line cook / KP. Completes today’s checklist, flags issues.

---

## 4  Functional Requirements

### 4.1 Authentication & Roles
* Email / password sign‑up & login (Supabase Auth).  
* Roles: **manager**, **staff** (stored in `profiles`).  
* Row‑level security isolates each `organisation`.

### 4.2 Task Management (Manager)
* Create / edit / delete task templates.  
* Fields: title, description, **input_type** (text, number, boolean, photo), schedule (daily HH:MM or weekly days + HH:MM), acceptable range (optional), assigned_role.  
* Task Template Library with one‑click seed tasks.

### 4.3 Checklist (Staff)
* Auto‑generated list of tasks due **today** (client‑side filter).  
* Input form adapts to **input_type**.  
* Automatic time‑stamp & user capture.  
* Validation: out‑of‑range numbers or “No” responses trigger **flagged** = true and require a comment.

### 4.4 Compliance Log (Manager)
* Paginated table of `task_records` with filters (date range, task).  
* Highlight flagged entries.  
* CSV export (stretch).

### 4.5 Dashboards
* **Manager Home:** today’s tasks + completion status, overdue / flagged badges.  
* **Staff Home:** today’s outstanding tasks list.

### 4.6 Stretch
* AI “Food‑Safety Oracle” chat modal (API choice tbc).  
* Offline‑first caching for bad kitchens Wi‑Fi.

---

## 5  Non‑Functional Requirements

* **Responsive**: mobile‑responsive but desktop‑friendly (Tailwind).  
* **Performance**: first contentful paint < 2 s on 4G.  
* **Security**: Supabase RLS, HTTPS only, GDPR compliant (EU data region).  
* **Reliability**: 99.5 % uptime SLA.

---

## 6  Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Front‑end | React + Vite scaffold |
| Styling | Tailwind CSS | Utility‑first, mobile‑responsive |
| Back‑end | Supabase (Postgres, Auth, Storage) | Hosted, instant APIs, RLS |
| Hosting | Supabase + Vercel (front‑end) | Simple CI/CD |
| Language | TypeScript | Type safety end‑to‑end |

---

## 7  Data Model (tables)

```sql
organisations  (id, name, created_at)

profiles       (user_id PK ⇢ auth.users,
                organisation_id ⇢ organisations,
                role ['manager','staff'])

tasks          (id, organisation_id, title, description,
                input_type ['text','number','boolean','photo'],
                schedule JSONB, range_min, range_max,
                assigned_role, created_at)

task_records   (id, task_id ⇢ tasks,
                completed_by ⇢ auth.users,
                completed_at, value_text, value_number,
                value_boolean, value_photo_url, flagged)
```

---

## 8  Milestones & Timeline for MVP

| Stage | Deliverable |
|-----|-------------|
| **0** | Project setup, Supabase project created, Tailwind+Vite scaffold generated |
| **1** | Auth screens + profile insert; role‑based routing guard |
| **2** | Manager task‑creation UI + DB insert finished |
| **3** | Staff checklist view & task submission flow; basic validation |
| **4** | Manager log table + filter; dashboards |
| **5** | Polish UI, CSV export, smoke tests, beta roll‑out |

---

## 9  Out of Scope (for MVP)

* Multi‑site organisations (one org = one site).  
* Push notifications.  
* Hardware thermometer integrations.  
* Advanced analytics.  

---

## 10  Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Staff skip tasks | Visual overdue alerts + manager dashboard |
| Data loss | Supabase nightly backups + row‑level ownership |
| Poor mobile connectivity | Local cache (stretch) |

---

## 11  Open Questions

1. Should photo uploads be mandatory proof for critical tasks (e.g. fridge temp)?  
2. Do we need multilingual support out of the gate?  

---

*End of document.*
