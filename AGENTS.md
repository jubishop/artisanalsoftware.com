## Project Memory

Project-specific memory lives in `memory/`.
Use `memory/MEMORY.md` as the canonical index of saved memories, with one linked Markdown file per memory in `memory/`.
When asked to save, recall, or update a memory, read and write those files directly. Check memory before guessing about prior project-specific decisions or environment details.

## 🎯 Project Overview

**What**: Node.js Express server that renders podcast information from RSS feeds with PodHaven iOS app integration.
**Purpose**: Display podcast/episode pages server-side with deep links to the PodHaven mobile app.
**Key Constraint**: Server-side rendering only - NO client-side JavaScript.

## 🏗️ Infrastructure

- **Hosting**: Railway (Node.js web service)
- **Domain**: `artisanalsoftware.com` — registered and DNS managed in **Cloudflare**

## 🔑 Key Architectural Decisions

### 1. **Trusted RSS Content Model**
- RSS feed content from `<content:encoded>` is rendered as HTML (unescaped `<%-` in EJS)
- Plain text descriptions from `<description>` are escaped normally
