const { app: electronApp, BrowserWindow } = require("electron");
const path = require("path");
const { startServer } = require("./app");

// support packaging: when running as a packaged exe, use the executable's dir
const isPkg = typeof process.pkg !== "undefined";
const basePath = isPkg ? path.dirname(process.execPath) : __dirname;

let mainWindow;

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // use icon from uploads if present (works with dev and packaged app)
  const iconPath = path.join(basePath, "public", "uploads", "icon.png");
  try {
    // BrowserWindow accepts icon option at construction time on some platforms,
    // but setting it here is a safe fallback.
    mainWindow.setIcon && mainWindow.setIcon(iconPath);
  } catch (e) {
    // ignore if icon can't be set
  }

  mainWindow.loadURL(url);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Em modo production, escolha uma porta fixa; em dev pode ser 3000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// start Electron app
electronApp.whenReady().then(async () => {
  try {
    await startServer(PORT);
    const url = `http://localhost:${PORT}`;
    createWindow(url);
  } catch (err) {
    console.error("Erro iniciando servidor interno:", err);
    electronApp.quit();
  }
});

electronApp.on("window-all-closed", () => {
  // Em Windows, geralmente sai quando todas as janelas fecham
  if (process.platform !== "darwin") {
    electronApp.quit();
  }
});

electronApp.on("activate", () => {
  if (mainWindow === null) {
    createWindow(`http://localhost:${PORT}`);
  }
});
