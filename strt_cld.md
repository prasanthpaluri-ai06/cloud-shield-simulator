# How to Start and Host CloudShield Locally
## Step-by-Step Guide After Laptop Shutdown (`strt_cld.md`)

Follow these simple steps whenever you turn on your laptop or want to run CloudShield from scratch.

---

### 📋 Prerequisites Check (One-Time Verification)
Ensure **Node.js** is installed on your computer.
- You can verify by opening **Command Prompt** or **PowerShell** and typing:
  ```bash
  node -v
  npm -v
  ```
- *If versions appear (e.g. `v24.x` or `v20.x`), you are ready to go!*

---

## 🚀 Step-by-Step Instructions to Start CloudShield

### Step 1: Open Terminal / PowerShell
- Press the **Windows Key** on your keyboard.
- Type **PowerShell** or **cmd** and press **Enter**.

---

### Step 2: Navigate to the CloudShield Project Folder
Type or copy-paste the following command into your terminal and press **Enter**:

```powershell
cd "c:\Users\palur\OneDrive\Desktop\Cloud_shield"
```

*(If you moved the folder to a different location or USB drive, `cd` into that specific folder instead).*

---

### Step 3: Start the Local Development Server
In the terminal, run:

```bash
npm run dev
```

You will see output similar to this:
```text
  VITE v6.x.x  ready in 800 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### Step 4: Open CloudShield in Your Web Browser
1. Open **Google Chrome**, **Microsoft Edge**, or **Brave**.
2. Go to:
   ```
   http://localhost:3000/
   ```
3. The dark **CloudShield SOC Dashboard** will load immediately.

---

### 🛑 How to Stop the Server
When you are done with your demonstration:
- Go back to the terminal window where the server is running.
- Press **`Ctrl + C`** on your keyboard.
- Type **`Y`** (if prompted to terminate batch job) and press **Enter**.

---

### 🔄 How to Restart the Server
If you stopped the server or closed the terminal:
1. Open PowerShell.
2. `cd "c:\Users\palur\OneDrive\Desktop\Cloud_shield"`
3. Run `npm run dev` again.
4. Refresh your browser at `http://localhost:3000/`.

---

## 📦 Optional: Running the Production Build

If you want to run the optimized, pre-compiled production build (fastest performance for formal presentation):

1. Open PowerShell and `cd` into the project directory:
   ```powershell
   cd "c:\Users\palur\OneDrive\Desktop\Cloud_shield"
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Preview the production build:
   ```bash
   npm run preview
   ```
4. Open the URL shown in the terminal (usually `http://localhost:4173/` or `http://localhost:3000/`).

---

## 🔧 Troubleshooting Common Issues

| Problem | Quick Solution |
| :--- | :--- |
| **"Port 3000 is already in use"** | Vite will automatically suggest another port (e.g. `http://localhost:3001/`). Just open that URL in your browser, or close any previous terminal running the app. |
| **"npm: command not found"** | Node.js is not added to your system PATH. Re-download and install Node.js (LTS version) from [nodejs.org](https://nodejs.org/). |
| **"node_modules missing" / "vite not recognized"** | Run `npm install` inside the project folder, then run `npm run dev`. |
| **Changes not reflecting in browser** | Perform a hard refresh in Chrome/Edge by pressing **`Ctrl + F5`** or **`Ctrl + Shift + R`**. |

---
*Keep this guide saved on your desktop for quick reference on presentation day!*
