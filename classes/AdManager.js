export default class AdManager {
    constructor() {
        this.adStats = {
            totalAdsWatched: 0,
            rewardedAdsWatched: 0,
            sessionStartTime: Date.now(),
            lastInterstitialTime: Date.now(),
            resourcesCollected: 0
        };
        
        // Ad trigger settings
        this.settings = {
            interstitialCooldown: 90000, // 90 seconds between interstitials
            resourcesPerInterstitial: 15, // Show ad every 15 resources
            bannerRefreshRate: 30000 // Refresh banner every 30 seconds
        };
        
        this.adElements = {};
        this.gameIsPaused = false;
        
        this.initializeAds();
    }
    
    initializeAds() {
        // Wait for AdSense to load
        if (typeof adsbygoogle !== 'undefined') {
            this.createBannerAd();
            console.log('AdSense initialized');
        } else {
            // Retry in 1 second if AdSense not loaded yet
            setTimeout(() => this.initializeAds(), 1000);
        }
    }
    
    createBannerAd() {
        // Create banner ad container
        const bannerContainer = document.createElement('div');
        bannerContainer.id = 'game-banner-ad';
        bannerContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: rgba(0,0,0,0.8);
            padding: 5px;
        `;
        
        // Create the ad unit
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.display = 'block';
        adUnit.setAttribute('data-ad-client', 'ca-pub-5023553543540110');
        adUnit.setAttribute('data-ad-slot', '1234567890'); // You'll need to create this
        adUnit.setAttribute('data-ad-format', 'auto');
        adUnit.setAttribute('data-full-width-responsive', 'true');
        
        bannerContainer.appendChild(adUnit);
        document.body.appendChild(bannerContainer);
        
        // Push to AdSense
        (adsbygoogle = window.adsbygoogle || []).push({});
        
        this.adElements.banner = bannerContainer;
    }
    
    // Called when player collects resources
    onResourceCollected(resourceType, amount) {
        this.adStats.resourcesCollected += amount;
        
        // Check if we should show interstitial
        if (this.shouldShowInterstitial()) {
            this.showInterstitialAd();
        }
    }
    
    shouldShowInterstitial() {
        const timeSinceLastAd = Date.now() - this.adStats.lastInterstitialTime;
        const enoughTimePassed = timeSinceLastAd > this.settings.interstitialCooldown;
        const enoughResourcesCollected = this.adStats.resourcesCollected >= this.settings.resourcesPerInterstitial;
        
        return enoughTimePassed && enoughResourcesCollected;
    }
    
    showInterstitialAd() {
        this.adStats.lastInterstitialTime = Date.now();
        this.adStats.resourcesCollected = 0; // Reset counter
        
        // Create interstitial overlay
        this.createInterstitialOverlay();
    }
    
    createInterstitialOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'interstitial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; max-width: 400px; padding: 20px;">
                <h2>Thanks for Playing!</h2>
                <p>Support the game by viewing this brief ad</p>
                <div id="interstitial-ad-container" style="margin: 20px 0;">
                    <!-- Ad will load here -->
                </div>
                <button id="close-interstitial" style="
                    padding: 10px 20px;
                    font-size: 16px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                " disabled>Close (5)</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.pauseGame();
        
        // Start countdown timer
        this.startCloseTimer(overlay);
        
        // Load actual ad
        this.loadInterstitialAd(overlay);
    }
    
    loadInterstitialAd(overlay) {
        const adContainer = overlay.querySelector('#interstitial-ad-container');
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.cssText = 'display:block; width: 300px; height: 250px;';
        adUnit.setAttribute('data-ad-client', 'ca-pub-5023553543540110');
        adUnit.setAttribute('data-ad-slot', '0987654321'); // You'll need to create this
        
        adContainer.appendChild(adUnit);
        (adsbygoogle = window.adsbygoogle || []).push({});
        
        this.adStats.totalAdsWatched++;
    }
    
    startCloseTimer(overlay) {
        const closeBtn = overlay.querySelector('#close-interstitial');
        let countdown = 5;
        
        const timer = setInterval(() => {
            countdown--;
            closeBtn.textContent = `Close (${countdown})`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                closeBtn.textContent = 'Close';
                closeBtn.disabled = false;
                closeBtn.onclick = () => this.closeInterstitial(overlay);
            }
        }, 1000);
    }
    
    closeInterstitial(overlay) {
        document.body.removeChild(overlay);
        this.resumeGame();
    }
    
    // Rewarded video ads for player benefits
    showRewardedAd(rewardType, rewardAmount, callback) {
        const overlay = document.createElement('div');
        overlay.id = 'rewarded-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; max-width: 400px; padding: 20px;">
                <h2>🎁 Bonus Reward!</h2>
                <p>Watch this ad to get:</p>
                <h3 style="color: #4CAF50;">${rewardAmount} ${rewardType}</h3>
                <div id="rewarded-ad-container" style="margin: 20px 0;">
                    <!-- Ad will load here -->
                </div>
                <div style="margin-top: 20px;">
                    <button id="watch-rewarded" style="
                        padding: 12px 24px;
                        font-size: 16px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Watch Ad</button>
                    <button id="skip-rewarded" style="
                        padding: 12px 24px;
                        font-size: 16px;
                        background: #666;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">No Thanks</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.pauseGame();
        
        // Set up buttons
        overlay.querySelector('#watch-rewarded').onclick = () => {
            this.watchRewardedAd(overlay, callback, rewardType, rewardAmount);
        };
        
        overlay.querySelector('#skip-rewarded').onclick = () => {
            document.body.removeChild(overlay);
            this.resumeGame();
        };
    }
    
    watchRewardedAd(overlay, callback, rewardType, rewardAmount) {
        // Load the actual ad
        const adContainer = overlay.querySelector('#rewarded-ad-container');
        const adUnit = document.createElement('ins');
        adUnit.className = 'adsbygoogle';
        adUnit.style.cssText = 'display:block; width: 300px; height: 250px;';
        adUnit.setAttribute('data-ad-client', 'ca-pub-5023553543540110');
        adUnit.setAttribute('data-ad-slot', '1357924680'); // You'll need to create this
        
        adContainer.appendChild(adUnit);
        (adsbygoogle = window.adsbygoogle || []).push({});
        
        // Hide buttons and show completion message
        overlay.querySelector('#watch-rewarded').style.display = 'none';
        overlay.querySelector('#skip-rewarded').style.display = 'none';
        
        // Simulate ad completion (in real implementation, you'd wait for ad completion callback)
        setTimeout(() => {
            this.completeRewardedAd(overlay, callback, rewardType, rewardAmount);
        }, 3000);
        
        this.adStats.rewardedAdsWatched++;
        this.adStats.totalAdsWatched++;
    }
    
    completeRewardedAd(overlay, callback, rewardType, rewardAmount) {
        // Show reward notification
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <h2 style="color: #4CAF50;">🎉 Reward Earned!</h2>
                <h3>+${rewardAmount} ${rewardType}</h3>
                <button onclick="this.parentElement.parentElement.remove(); window.adManager.resumeGame();" style="
                    padding: 12px 24px;
                    font-size: 16px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Collect Reward</button>
            </div>
        `;
        
        // Execute the reward callback
        callback(rewardType, rewardAmount);
        
        // Auto-close after 2 seconds
        setTimeout(() => {
            if (document.getElementById('rewarded-overlay')) {
                document.body.removeChild(overlay);
                this.resumeGame();
            }
        }, 2000);
    }
    
    pauseGame() {
        this.gameIsPaused = true;
        // Game loop will check this flag
    }
    
    resumeGame() {
        this.gameIsPaused = false;
    }
    
    // Analytics methods
    getAdStats() {
        return {
            ...this.adStats,
            sessionDuration: Date.now() - this.adStats.sessionStartTime,
            averageAdsPerSession: this.adStats.totalAdsWatched
        };
    }
}