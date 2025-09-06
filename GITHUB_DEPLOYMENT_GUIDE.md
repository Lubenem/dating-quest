# GitHub Deployment Guide for Dating Quest

## 🎯 Goal
Deploy your Dating Quest game to GitHub Pages for worldwide access without WiFi dependency.

## 📋 Step-by-Step Plan

### Phase 1: GitHub Repository Setup

#### Step 1: Create GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up" if you don't have an account
3. Choose username (e.g., `lubenem` or `datingquest`)
4. Verify email address

#### Step 2: Create New Repository
1. Click the "+" icon → "New repository"
2. Repository name: `dating-quest` or `datingquest-game`
3. Description: "Mobile dating confidence game with XP system and achievements"
4. Set to **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

#### Step 3: Connect Local Repository to GitHub
```bash
# In your DatingQuest directory
cd /home/lubenem/DatingQuest

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/dating-quest.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### Phase 2: GitHub Pages Setup

#### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section (left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch
6. Select "/ (root)" folder
7. Click "Save"

#### Step 5: Configure for Web App
1. In repository root, create `.nojekyll` file:
```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push
```

2. Move app files to root directory:
```bash
# Move DatingQuestApp contents to root
cp -r DatingQuestApp/* .
git add .
git commit -m "Move app files to root for GitHub Pages"
git push
```

### Phase 3: PWA Configuration

#### Step 6: Update Manifest for Production
1. Edit `manifest.json`:
```json
{
  "name": "Dating Quest",
  "short_name": "DatingQuest",
  "description": "Mobile dating confidence game",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#764ba2",
  "theme_color": "#764ba2",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Step 7: Update Service Worker
1. Edit `sw.js` to cache all files:
```javascript
const CACHE_NAME = 'dating-quest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

### Phase 4: Testing & Deployment

#### Step 8: Deploy and Test
1. Push all changes:
```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

2. Wait 5-10 minutes for GitHub Pages to build

3. Access your game at:
   `https://YOUR_USERNAME.github.io/dating-quest/`

#### Step 9: Test PWA Installation
1. Open the URL on your phone
2. Look for "Add to Home Screen" option
3. Install as PWA
4. Test offline functionality

### Phase 5: Custom Domain (Optional)

#### Step 10: Custom Domain Setup
1. Buy domain (e.g., `datingquest.app` from Namecheap, GoDaddy)
2. In GitHub Pages settings, add custom domain
3. Update DNS records:
   - Type: CNAME
   - Name: www
   - Value: YOUR_USERNAME.github.io

## 🚀 Quick Commands Summary

```bash
# 1. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/dating-quest.git
git branch -M main
git push -u origin main

# 2. Configure for GitHub Pages
touch .nojekyll
cp -r DatingQuestApp/* .
git add .
git commit -m "Move app to root for GitHub Pages"
git push

# 3. Deploy
git push origin main
```

## 📱 Access Your Game

After deployment, your game will be available at:
- **URL**: `https://YOUR_USERNAME.github.io/dating-quest/`
- **PWA**: Install from browser menu
- **Offline**: Works completely offline once installed

## 🔧 Troubleshooting

### GitHub Pages Not Working?
- Check repository is public
- Verify files are in root directory
- Wait 10-15 minutes for build
- Check "Actions" tab for build errors

### PWA Not Installing?
- Ensure HTTPS (GitHub Pages provides this)
- Check manifest.json is valid
- Try different browser (Chrome recommended)

### Files Not Loading?
- Check `.nojekyll` file exists
- Verify file paths are correct
- Clear browser cache

## 🎯 Benefits of GitHub Deployment

1. **Free hosting** - No server costs
2. **HTTPS included** - Required for PWA
3. **Global CDN** - Fast worldwide access
4. **Version control** - Easy updates
5. **Custom domain** - Professional URL
6. **Automatic builds** - Push to update

## 📊 File Structure After Deployment

```
dating-quest/
├── index.html          # Main app file
├── app.js             # Game logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
├── icon-192.png      # App icon
├── icon-512.png      # App icon
├── .nojekyll         # GitHub Pages config
└── README.md         # Project documentation
```

## 🎮 Next Steps After Deployment

1. **Test on multiple devices**
2. **Share with friends** for feedback
3. **Add analytics** (Google Analytics)
4. **Implement updates** based on usage
5. **Consider app store** submission

Your game will be accessible worldwide at `https://YOUR_USERNAME.github.io/dating-quest/`!
