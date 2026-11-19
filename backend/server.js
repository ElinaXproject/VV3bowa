const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Konfiguracja ścieżek
const STORAGE_PATH = path.join(__dirname, '../storage');
const APPS_PATH = path.join(STORAGE_PATH, 'apps');

// Upewnij się, że katalogi istnieją
fs.ensureDirSync(STORAGE_PATH);
fs.ensureDirSync(APPS_PATH);

// ===== API ROUTES =====

// GET /api/health - Sprawdzenie stanu serwera
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// GET /api/apps - Pobierz wszystkie aplikacje
app.get('/api/apps', async (req, res) => {
  try {
    const apps = await getAllApps();
    res.json({ success: true, data: apps });
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas pobierania aplikacji' 
    });
  }
});

// GET /api/apps/:id - Pobierz pojedynczą aplikację
app.get('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const app = await getAppById(id);
    
    if (!app) {
      return res.status(404).json({ 
        success: false, 
        error: 'Aplikacja nie została znaleziona' 
      });
    }
    
    res.json({ success: true, data: app });
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas pobierania aplikacji' 
    });
  }
});

// POST /api/scrape - Pobierz dane ze źródła
app.post('/api/scrape', async (req, res) => {
  try {
    const { url, type } = req.body;
    
    if (!url || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL i typ źródła są wymagane' 
      });
    }
    
    let scrapedData;
    
    switch (type) {
      case 'playstore':
        scrapedData = await scrapePlayStore(url);
        break;
      case 'website':
        scrapedData = await scrapeWebsite(url);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Nieprawidłowy typ źródła' 
        });
    }
    
    res.json({ success: true, data: scrapedData });
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas pobierania danych' 
    });
  }
});

// POST /api/apps - Zapisz nową aplikację
app.post('/api/apps', async (req, res) => {
  try {
    const { appData, folderPath } = req.body;
    
    if (!appData || !appData.name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dane aplikacji są wymagane' 
      });
    }
    
    // Generuj ID jeśli nie istnieje
    const appWithId = { 
      ...appData, 
      id: appData.id || uuidv4(),
      createdAt: appData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Zapisz do pliku
    const folder = path.join(APPS_PATH, folderPath.replace(/^\//, ''));
    await fs.ensureDir(folder);
    
    const filePath = path.join(folder, `${appWithId.id}.json`);
    await fs.writeJson(filePath, appWithId, { spaces: 2 });
    
    // Zapisz miniaturę ikony
    if (appWithId.icon) {
      const iconPath = path.join(folder, `${appWithId.id}_icon.jpg`);
      try {
        const response = await axios.get(appWithId.icon, { responseType: 'arraybuffer' });
        await fs.writeFile(iconPath, response.data);
        appWithId.icon = path.relative(STORAGE_PATH, iconPath);
      } catch (iconError) {
        console.log('Could not download icon:', iconError.message);
      }
    }
    
    // Zapisz obrazki
    if (appWithId.images && appWithId.images.length > 0) {
      const imagesDir = path.join(folder, 'images');
      await fs.ensureDir(imagesDir);
      
      const downloadedImages = [];
      for (let i = 0; i < appWithId.images.length; i++) {
        try {
          const response = await axios.get(appWithId.images[i], { responseType: 'arraybuffer' });
          const imagePath = path.join(imagesDir, `${appWithId.id}_${i}.jpg`);
          await fs.writeFile(imagePath, response.data);
          downloadedImages.push(path.relative(STORAGE_PATH, imagePath));
        } catch (imageError) {
          console.log(`Could not download image ${i}:`, imageError.message);
        }
      }
      appWithId.images = downloadedImages;
    }
    
    // Zaktualizuj plik JSON z nowymi ścieżkami
    await fs.writeJson(filePath, appWithId, { spaces: 2 });
    
    res.json({ 
      success: true, 
      data: appWithId,
      message: 'Aplikacja została pomyślnie zapisana' 
    });
  } catch (error) {
    console.error('Error saving app:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas zapisu aplikacji' 
    });
  }
});

// PUT /api/apps/:id - Zaktualizuj aplikację
app.put('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { appData } = req.body;
    
    if (!appData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dane aplikacji są wymagane' 
      });
    }
    
    const existingApp = await getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ 
        success: false, 
        error: 'Aplikacja nie została znaleziona' 
      });
    }
    
    const updatedApp = { 
      ...existingApp, 
      ...appData,
      updatedAt: new Date().toISOString()
    };
    
    const filePath = path.join(APPS_PATH, existingApp.folderPath.replace(/^\//, ''), `${id}.json`);
    await fs.writeJson(filePath, updatedApp, { spaces: 2 });
    
    res.json({ 
      success: true, 
      data: updatedApp,
      message: 'Aplikacja została pomyślnie zaktualizowana' 
    });
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas aktualizacji aplikacji' 
    });
  }
});

// DELETE /api/apps/:id - Usuń aplikację
app.delete('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingApp = await getAppById(id);
    if (!existingApp) {
      return res.status(404).json({ 
        success: false, 
        error: 'Aplikacja nie została znaleziona' 
      });
    }
    
    const filePath = path.join(APPS_PATH, existingApp.folderPath.replace(/^\//, ''), `${id}.json`);
    await fs.remove(filePath);
    
    // Usuń ikonę
    const iconPath = path.join(APPS_PATH, existingApp.folderPath.replace(/^\//, ''), `${id}_icon.jpg`);
    await fs.remove(iconPath).catch(() => {});
    
    // Usuń folder z obrazkami
    const imagesDir = path.join(APPS_PATH, existingApp.folderPath.replace(/^\//, ''), 'images');
    await fs.remove(imagesDir).catch(() => {});
    
    res.json({ 
      success: true, 
      message: 'Aplikacja została pomyślnie usunięta' 
    });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas usuwania aplikacji' 
    });
  }
});

// GET /api/folders - Pobierz strukturę folderów
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await getFolderStructure(APPS_PATH, '/');
    res.json({ success: true, data: folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas pobierania folderów' 
    });
  }
});

// POST /api/export - Eksport danych
app.post('/api/export', async (req, res) => {
  try {
    const { apps, format, template, includeImages, includeReferralLinks, includeBonusCodes } = req.body;
    
    if (!apps || !Array.isArray(apps)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Lista aplikacji jest wymagana' 
      });
    }
    
    let content;
    let filename;
    let mimeType;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(apps, null, 2);
        filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'markdown':
        content = generateMarkdown(apps);
        filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
      default:
        content = generateHTML(apps, template || 'grid', includeImages, includeReferralLinks, includeBonusCodes);
        filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.html`;
        mimeType = 'text/html';
        break;
    }
    
    // Zapis do pliku tymczasowego
    const tempPath = path.join(STORAGE_PATH, 'temp', filename);
    await fs.ensureDir(path.join(STORAGE_PATH, 'temp'));
    await fs.writeFile(tempPath, content);
    
    res.json({ 
      success: true, 
      data: { 
        path: tempPath,
        filename,
        mimeType,
        size: content.length
      },
      message: 'Eksport zakończony pomyślnie' 
    });
  } catch (error) {
    console.error('Error exporting:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Wystąpił błąd podczas eksportu' 
    });
  }
});

// ===== HELPER FUNCTIONS =====

// Pobierz wszystkie aplikacje
async function getAllApps() {
  const folders = await getFolderStructure(APPS_PATH, '/');
  const apps = [];
  
  const collectApps = (folders) => {
    folders.forEach(folder => {
      folder.apps.forEach(app => {
        apps.push(app);
      });
      collectApps(folder.subfolders);
    });
  };
  
  collectApps(folders);
  return apps;
}

// Pobierz aplikację po ID
async function getAppById(id) {
  const apps = await getAllApps();
  return apps.find(app => app.id === id) || null;
}

// Pobierz strukturę folderów
async function getFolderStructure(basePath, currentPath) {
  const items = await fs.readdir(basePath, { withFileTypes: true });
  const folders = [];
  const apps = [];
  
  for (const item of items) {
    const itemPath = path.join(basePath, item.name);
    const relativePath = path.join(currentPath, item.name);
    
    if (item.isDirectory()) {
      const subfolders = await getFolderStructure(itemPath, relativePath);
      folders.push({
        name: item.name,
        path: relativePath,
        apps: [],
        subfolders
      });
    } else if (item.isFile() && item.name.endsWith('.json')) {
      try {
        const app = await fs.readJson(itemPath);
        apps.push(app);
      } catch (error) {
        console.error(`Error reading app file: ${item.name}`, error);
      }
    }
  }
  
  return [
    {
      name: path.basename(basePath),
      path: currentPath,
      apps,
      subfolders: folders
    }
  ];
}

// Scrapowanie Play Store
async function scrapePlayStore(url) {
  try {
    // Użyj Puppeteer do scrapowania Play Store
    const browser = await require('puppeteer').launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Pobierz dane
    const data = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : null;
      };
      
      const getAttribute = (selector, attr) => {
        const el = document.querySelector(selector);
        return el ? el.getAttribute(attr) : null;
      };
      
      return {
        name: getText('h1') || getText('.AHFaub'),
        description: getText('.bARER') || getText('[data-g-name="Description"]'),
        icon: getAttribute('img.Q4vdJd', 'src') || getAttribute('img.T750Ld', 'src'),
        rating: parseFloat(getText('.w2kbF') || getText('.F1720c') || '0'),
        reviewsCount: parseInt(getText('.EymY4b span')?.replace(/[^0-9]/g, '') || '0'),
        category: getText('.TpRp2') || getText('[data-g-name="Genre"]'),
        developer: getText('.T42T4b') || getText('[data-g-name="Offered By"]'),
        version: getText('[data-g-name="Current Version"]'),
        lastUpdated: getText('[data-g-name="Updated"]'),
        images: Array.from(document.querySelectorAll('img.sFlh5c')).map(img => img.src)
      };
    });
    
    await browser.close();
    
    return {
      ...data,
      tags: [],
      sourceType: 'playstore',
      sourceUrl: url
    };
  } catch (error) {
    console.error('Error scraping Play Store:', error);
    
    // Jeśli Puppeteer nie działa, użyj backup method
    return {
      name: 'Aplikacja z Play Store',
      description: 'Opis aplikacji pobrany z Play Store',
      icon: 'https://via.placeholder.com/100x100/ff0040/ffffff?text=PS',
      images: ['https://via.placeholder.com/400x200/ff0040/ffffff?text=Play+Store'],
      rating: 0,
      reviewsCount: 0,
      category: 'Narzędzia',
      tags: [],
      developer: 'Unknown',
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceType: 'playstore',
      sourceUrl: url
    };
  }
}

// Scrapowanie strony WWW
async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Open Graph / Twitter Card
    const meta = {
      title: $('meta[property="og:title"]').attr('content') || 
              $('meta[name="twitter:title"]').attr('content') || 
              $('title').text(),
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="twitter:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="twitter:image"]').attr('content')
    };
    
    // Favicon
    const favicon = $('link[rel="icon"]').attr('href') || 
                    $('link[rel="shortcut icon"]').attr('href') || 
                    new URL('/favicon.ico', url).href;
    
    // Pobierz wszystkie obrazki
    const images = $('img').map((i, el) => $(el).attr('src')).get()
      .filter(src => src && !src.startsWith('data:'))
      .map(src => new URL(src, url).href)
      .slice(0, 5);
    
    return {
      name: meta.title || 'Strona WWW',
      description: meta.description || 'Opis strony internetowej',
      icon: favicon || 'https://via.placeholder.com/100x100/00ff88/ffffff?text=WWW',
      images: meta.image ? [meta.image, ...images] : images,
      rating: 0,
      reviewsCount: 0,
      category: 'Web',
      tags: [],
      developer: new URL(url).hostname,
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceType: 'website',
      sourceUrl: url
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    
    return {
      name: 'Strona WWW',
      description: 'Opis strony internetowej',
      icon: 'https://via.placeholder.com/100x100/00ff88/ffffff?text=WWW',
      images: ['https://via.placeholder.com/400x200/00ff88/ffffff?text=Website'],
      rating: 0,
      reviewsCount: 0,
      category: 'Web',
      tags: [],
      developer: new URL(url).hostname,
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      sourceType: 'website',
      sourceUrl: url
    };
  }
}

// Generowanie Markdown
function generateMarkdown(apps) {
  let md = `# Kolekcja Aplikacji - Webowaw\n\n`;
  md += `*Wygenerowano: ${new Date().toLocaleString('pl-PL')}*\n\n`;
  md += `---\n\n`;

  apps.forEach((app, index) => {
    md += `## ${index + 1}. ${app.name}\n\n`;
    md += `| | |\n`;
    md += `|---|---|\n`;
    md += `| **Kategoria** | ${app.category || 'N/A'} |\n`;
    md += `| **Ocena** | ${app.rating}/5 (${app.reviewsCount} recenzji) |\n`;
    md += `| **Wersja** | ${app.version || 'N/A'} |\n`;
    md += `| **Developer** | ${app.developer || 'N/A'} |\n`;
    md += `| **Ostatnia aktualizacja** | ${app.lastUpdated || 'N/A'} |\n`;
    
    if (app.referralLink) {
      md += `| **Link polecający** | [Link](${app.referralLink}) |\n`;
    }
    
    if (app.bonusCode) {
      md += `| **Kod bonusowy** | **${app.bonusCode}** |\n`;
    }
    
    md += `|\n\n`;
    md += `**Opis:**\n\n${app.description || 'Brak opisu'}\n\n`;
    
    if (app.tags && app.tags.length > 0) {
      md += `**Tagi:** ${app.tags.join(', ')}\n\n`;
    }
    
    if (app.sourceUrl) {
      md += `[🔗 Źródło](${app.sourceUrl})\n\n`;
    }
    
    md += `---\n\n`;
  });

  return md;
}

// Generowanie HTML
function generateHTML(apps, template, includeImages, includeReferralLinks, includeBonusCodes) {
  const getStarRating = (rating) => {
    if (!rating) return '⭐'.repeat(5);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
  };

  const appCards = apps.map(app => {
    const starRating = getStarRating(app.rating);
    
    return `
      <div class="app-card" data-category="${app.category || 'other'}">
        <div class="app-icon">
          ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><text x=\"50\" y=\"55\" text-anchor=\"middle\" fill=\"%23fff\" font-size=\"40\">📁</text></svg>'">` : '<div class="placeholder-icon">📁</div>'}
        </div>
        <div class="app-info">
          <h3 class="app-name">${app.name}</h3>
          <p class="app-description">${app.description || 'Brak opisu'}</p>
          <div class="app-meta">
            <span class="app-rating">${starRating} (${app.reviewsCount || 0})</span>
            <span class="app-category">${app.category || 'N/A'}</span>
            <span class="app-version">v${app.version || '1.0'}</span>
          </div>
          ${app.tags && app.tags.length > 0 ? `<div class="app-tags">${app.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
          ${includeReferralLinks && app.referralLink ? `<div class="app-referral"><a href="${app.referralLink}" target="_blank" rel="noopener">Link polecający</a></div>` : ''}
          ${includeBonusCodes && app.bonusCode ? `<div class="app-bonus">Kod bonusowy: <strong>${app.bonusCode}</strong></div>` : ''}
          <a href="${app.sourceUrl}" target="_blank" rel="noopener" class="app-source">Źródło</a>
        </div>
      </div>
    `;
  }).join('\n');

  const templateClass = template === 'grid' ? 'grid-template' : 
                       template === 'list' ? 'list-template' : 'cards-template';

  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kolekcja Aplikacji - Webowaw</title>
      <style>
        :root {
          --bg-primary: #0a0a0a;
          --bg-secondary: #121212;
          --bg-card: #1e1e1e;
          --neon-red: #ff0040;
          --text-primary: #ffffff;
          --text-secondary: #e0e0e0;
          --text-muted: #a0a0a0;
          --border-color: #333333;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        header h1 {
          font-family: 'Arial', sans-serif;
          font-size: 2.5rem;
          color: var(--neon-red);
          margin-bottom: 10px;
        }
        
        header p {
          color: var(--text-muted);
        }
        
        .grid-template {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .list-template {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .cards-template {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .app-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .app-card:hover {
          border-color: var(--neon-red);
          box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
        }
        
        .app-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 15px;
        }
        
        .app-icon img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          object-fit: cover;
        }
        
        .placeholder-icon {
          width: 100%;
          height: 100%;
          background: var(--bg-secondary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .app-info h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        
        .app-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .app-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }
        
        .app-meta span {
          background: var(--bg-secondary);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text-muted);
        }
        
        .app-rating {
          color: #ffd700;
        }
        
        .app-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .tag {
          background: var(--bg-secondary);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        
        .app-referral a,
        .app-source {
          color: var(--neon-red);
          text-decoration: none;
          font-size: 0.85rem;
          display: inline-block;
          margin-top: 8px;
        }
        
        .app-referral a:hover,
        .app-source:hover {
          text-decoration: underline;
        }
        
        .app-bonus {
          background: rgba(255, 0, 64, 0.1);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 8px;
          border-radius: 8px;
          margin-top: 8px;
          font-size: 0.85rem;
        }
        
        footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .grid-template {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Kolekcja Aplikacji</h1>
          <p>Wyeksportowano z Webowaw - ${new Date().toLocaleString('pl-PL')}</p>
        </header>
        
        <div class="${templateClass}">
          ${appCards}
        </div>
        
        <footer>
          <p>Wygenerowano przez <strong>Webowaw</strong> | ${new Date().toLocaleString('pl-PL')}</p>
        </footer>
      </div>
    </body>
    </html>
  `;
}

// Start serwera
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Storage path: ${STORAGE_PATH}`);
});

// Obsługa błędów 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint nie został znaleziony' 
  });
});

// Obsługa błędów 500
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Wewnętrzny błąd serwera' 
  });
});
