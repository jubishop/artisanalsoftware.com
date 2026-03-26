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
