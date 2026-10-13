# CloudShield — Complete Git & Deployment Guide

This guide provides clear, step-by-step instructions to:
1. **Push your local CloudShield project to a GitHub repository.**
2. **Understand the best deployment platform for this tech stack.**
3. **Deploy the website live on the internet from start to finish.**

---

## Prerequisites Before Starting

Make sure you have:
- **Git** installed on your computer. (Verify by typing `git --version` in terminal).
- A free **[GitHub account](https://github.com/)**.
- A terminal (PowerShell, Command Prompt, or VS Code / Antigravity integrated terminal).

---

# Part 1: Detailed Steps to Push CloudShield to a GitHub Repository

### Step 1.1: Open Terminal in Project Directory
Open PowerShell or your terminal and navigate to your project folder:
```powershell
cd "c:\Users\palur\OneDrive\Desktop\Cloud_shield"
```

---

### Step 1.2: Verify `.gitignore`
A `.gitignore` file has already been created in your project root to ensure massive folders like `node_modules` (hundreds of MBs) and `dist` are not pushed to GitHub.

You can verify it exists by running:
```powershell
Get-Content .gitignore
```

---

### Step 1.3: Initialize the Git Repository
Initialize a local Git repository:
```powershell
git init
```
*(You will see: `Initialized empty Git repository in .../Cloud_shield/.git/`)*

---

### Step 1.4: Stage All Files
Add all project files to Git staging:
```powershell
git add .
```

---

### Step 1.5: Make Your First Commit
Commit the staged files with an informative message:
```powershell
git commit -m "Initial commit: CloudShield - Cloud Security Attack Simulator"
```

---

### Step 1.6: Create a New Repository on GitHub
1. Open your browser and go to **[github.com/new](https://github.com/new)**.
2. Enter a **Repository name**: e.g., `CloudShield` or `cloud-shield-simulator`.
3. Set visibility to **Public** (recommended for portfolio/sharing) or **Private**.
4. **IMPORTANT**: **Do NOT check** *"Add a README file"*, *"Add .gitignore"*, or *"Choose a license"* (we already have our local files ready).
5. Click the green **"Create repository"** button.

---

### Step 1.7: Link Your Local Repository to GitHub & Push
GitHub will display commands under *"…or push an existing repository from the command line"*.

Run the following commands in your PowerShell terminal (replace `YOUR_GITHUB_USERNAME` with your actual GitHub username):

```powershell
# 1. Rename default branch to main
git branch -M main

# 2. Add GitHub remote link (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/CloudShield.git

# 3. Push your project to GitHub
git push -u origin main
```

> **Note:** If Git prompts you for credentials:
> - Sign in with your browser or enter your GitHub Personal Access Token (PAT).

---

### Step 1.8: How to Push Future Updates
Whenever you make changes to your code in the future, push them with these 3 quick commands:
```powershell
git add .
git commit -m "Update feature or design improvements"
git push
```

---

# Part 2: What is the Best Way to Deploy This Website?

### The Winner: **Vercel** (Recommended #1 Choice)

CloudShield is built with **React 18 + Vite + TypeScript**. It is an entirely client-side, in-browser simulated architecture.

| Deployment Platform | Setup Time | Cost | Vite Compatibility | Continuous Deployment | Custom Domains & SSL | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Vercel** | **< 2 minutes** | **Free (Hobby)** | **Native (Auto-detects Vite)** | **Automatic on `git push`** | **Free included** | ⭐ **Best Choice** |
| **Netlify** | **< 2 minutes** | **Free** | **Native** | **Automatic on `git push`** | **Free included** | **Excellent Alternative** |
| **GitHub Pages** | ~5 minutes | Free | Requires GitHub Action | Requires Workflow setup | Free included | Good fallback |
| **AWS S3 + CloudFront** | ~15 minutes | Free Tier | Manual bucket setup | Requires AWS CLI / CI | Needs ACM / Route 53 | High AWS effort |

### Why Vercel is the Best Choice for CloudShield:
1. **Zero Configuration:** Vercel automatically detects that your project is a **Vite** app. It automatically sets the build command to `npm run build` and output folder to `dist`.
2. **Instant Global CDN:** Your application is cached and served across 300+ edge locations worldwide for near-instant load speeds.
3. **Automatic Continuous Deployment (CI/CD):** Every time you run `git push origin main`, Vercel automatically rebuilds and deploys your website in ~15–20 seconds.
4. **Free Custom HTTPS URL:** You receive a secure, live production link immediately (e.g., `https://cloudshield.vercel.app`).
5. **SPA Routing Support:** A `vercel.json` rewrite file is already configured in this project to prevent 404 errors on page reloads.

---

# Part 3: Clear and Detailed Steps to Deploy from Start to Finish

Follow these steps to deploy your website live using **Vercel**:

### Step 3.1: Log in to Vercel
1. Open your browser and go to **[vercel.com/signup](https://vercel.com/signup)**.
2. Click **"Continue with GitHub"** (this links your GitHub repositories directly).

---

### Step 3.2: Create a New Project
1. Once logged into your Vercel Dashboard, click the **"Add New..."** button in the top right corner.
2. Select **"Project"**.

---

### Step 3.3: Import Your GitHub Repository
1. In the *"Import Git Repository"* list, you will see your repositories from GitHub.
2. Locate your **`CloudShield`** (or your chosen repository name).
3. Click the **"Import"** button next to it.
   *(If you don't see your repository, click "Adjust GitHub App Permissions" and give Vercel access to it).*

---

### Step 3.4: Verify Build & Output Settings
Vercel will inspect your project and pre-fill the configuration:
- **Project Name:** `cloudshield` (you can customize this)
- **Framework Preset:** `Vite` (automatically detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

*(You do **not** need to change anything or add environment variables, because CloudShield runs entirely local in-browser simulations without external secrets).*

---

### Step 3.5: Click "Deploy"
1. Click the blue **"Deploy"** button.
2. Vercel will begin building your project:
   - Cloning repository...
   - Installing dependencies (`npm install`)...
   - Compiling TypeScript & bundling (`tsc && vite build`)...
   - Uploading production build to edge network...
3. Within **25–40 seconds**, confetti will appear on your screen with:
   > **"Congratulations! Your project has been successfully deployed."**

---

### Step 3.6: Access Your Live Website
- Click on the interactive preview image or the domain link shown on screen:
  👉 **`https://your-project-name.vercel.app`**
- You can share this link with your faculty, teammates, recruiters, or in your project report.

---

# Alternative Method: Deploying on Netlify (2-Minute Alternative)

If you prefer **Netlify**, the steps are equally fast:

1. Go to **[netlify.com](https://www.netlify.com/)** and click **Sign Up** with GitHub.
2. In your Netlify dashboard, click **"Add new site"** $\to$ **"Import an existing project"**.
3. Choose **GitHub** and authorize Netlify.
4. Select your **`CloudShield`** repository.
5. Netlify will detect:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Deploy site"**.
7. In ~30 seconds, your site will be live at a URL like `https://cloudshield-demo.netlify.app`.

---

# Verifying Your Deployed Website

Once your site is live on the internet, test these features to ensure 100% operation:
- [ ] **Launch Attack Simulation:** Pick an attack scenario (e.g., *SQL Injection* or *DDoS*) and click **"Launch Simulation"**. Confirm all 8 pipeline nodes progress in real time.
- [ ] **AI Threat Engine:** Verify the heuristic score gauge, explainable bullet points, and recommended mitigation display correctly.
- [ ] **Security Logs:** Go to the **Security Logs** page, filter by severity, and try **"Export CSV"** or **"Export JSON"**.
- [ ] **Blocked IPs:** Go to **AWS WAF Blocked IPs**, inspect a blocked host, or click **"Add Custom IP Block"**.
- [ ] **System Monitoring:** Verify that all 6 AWS services and the live CloudWatch log stream display healthy metrics.

---

# Summary of Essential Commands Cheat-Sheet

```powershell
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit files
git commit -m "Initial commit"

# 4. Set main branch & add remote
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CloudShield.git

# 5. Push to GitHub
git push -u origin main
```
*(After this initial push, connecting to Vercel takes just 3 clicks in your web browser!)*
