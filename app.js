// Dating Quest Game Logic
class DatingQuest {
    constructor() {
        this.gameData = this.loadGameData();
        this.dailyApproaches = this.loadDailyApproaches();
        this.xpActions = {
            'approach': { xp: 1, name: 'Approach' },
            'eye_contact_smile': { xp: 2, name: 'Make eye contact and smile' },
            'greeting': { xp: 3, name: 'Say hello / greeting' },
            'start_conversation': { xp: 5, name: 'Start a conversation' },
            'ask_question': { xp: 6, name: 'Ask an opinion or question' },
            'make_laugh': { xp: 8, name: 'Make her laugh' },
            'compliment': { xp: 8, name: 'Give a genuine compliment' },
            'ask_out': { xp: 10, name: 'Ask her out' },
            'get_number': { xp: 15, name: 'Get number/socials' },
            'long_conversation': { xp: 15, name: 'Keep conversation for 5+ minutes' },
            'handle_rejection': { xp: 15, name: 'Handle rejection gracefully' },
            'secure_date': { xp: 25, name: 'Secure a date on the spot' },
            'approach_group': { xp: 25, name: 'Approach someone in a group' },
            'new_opener': { xp: 20, name: 'Try a completely new opener style' },
            'mass_approach': { xp: 30, name: 'Approach 5+ women in one outing' }
        };

        this.levels = [
            { level: 1, xp: 0, title: 'Beginner' },
            { level: 2, xp: 51, title: 'Initiate' },
            { level: 3, xp: 151, title: 'Explorer' },
            { level: 4, xp: 301, title: 'Adventurer' },
            { level: 5, xp: 501, title: 'Challenger' },
            { level: 6, xp: 801, title: 'Hero' },
            { level: 7, xp: 1201, title: 'Master' },
            { level: 8, xp: 1801, title: 'Legend' },
            { level: 9, xp: 2501, title: 'Epic' }
        ];

        this.dailyQuests = [
            "Compliment a stranger's outfit",
            "Ask for a book/coffee/restaurant recommendation",
            "Make someone laugh",
            "Keep a conversation going for 2+ minutes",
            "Approach 3 different women in under 30 minutes",
            "Ask directly for a number without small talk",
            "Introduce yourself with only your first name",
            "Approach in a difficult context (she's sitting, wearing headphones, etc.)",
            "Do 5 approaches in a row without stopping",
            "Ask what she's reading/listening to",
            "Give a compliment in front of her friends",
            "Approach the most intimidating person you see today"
        ];

        this.randomizerPool = [
            "Opinion opener (ask for advice on food, fashion, books)",
            "Compliment something specific (jacket, hair, smile)",
            "Humor opener (light joke, situational humor)",
            "Direct approach ('You're cute, I had to say hi')",
            "Situational question (location-based)",
            "Ask what she's reading/listening to",
            "Challenge her playfully (tease lightly)",
            "Ask her to recommend a song",
            "Ask her opinion on a trending topic",
            "Pretend you're lost and ask for directions",
            "Introduce yourself casually ('Hey, I'm Alex by the way')",
            "Freestyle – make up something new on the spot"
        ];

        this.achievements = [
            { id: 'novice', name: 'Novice Adventurer', desc: '10 conversations', target: 10, type: 'conversations', unlocked: false, icon: '🌱' },
            { id: 'charmer', name: 'The Charmer', desc: 'Make 5 women laugh', target: 5, type: 'make_laugh', unlocked: false, icon: '😄' },
            { id: 'courageous', name: 'Courageous', desc: 'Approach a group', target: 1, type: 'approach_group', unlocked: false, icon: '👥' },
            { id: 'sniper', name: 'Sniper', desc: 'Get a number within 2 minutes', target: 1, type: 'get_number', unlocked: false, icon: '🎯' },
            { id: 'resilient', name: 'Resilient', desc: 'Handle 10 rejections gracefully', target: 10, type: 'handle_rejection', unlocked: false, icon: '💪' },
            { id: 'momentum', name: 'Momentum', desc: 'Do 20 approaches in one week', target: 20, type: 'weekly_approaches', unlocked: false, icon: '⚡' },
            { id: 'fearless', name: 'Fearless', desc: 'Ask out the most attractive girl you saw today', target: 1, type: 'ask_out', unlocked: false, icon: '🔥' },
            { id: 'icebreaker', name: 'Icebreaker', desc: 'Try 10 different opener styles', target: 10, type: 'new_opener', unlocked: false, icon: '🧊' },
            { id: 'social_hunter', name: 'Social Hunter', desc: 'Collect 20 numbers/socials', target: 20, type: 'get_number', unlocked: false, icon: '🎣' },
            { id: 'marathoner', name: 'Marathoner', desc: '30-day streak', target: 30, type: 'streak', unlocked: false, icon: '🏃' }
        ];

        this.init();
    }

    loadGameData() {
        const saved = localStorage.getItem('datingQuestData');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            level: 1,
            totalXP: 0,
            currentLevelXP: 0,
            streak: 0,
            lastApproachDate: null,
            achievements: [],
            dailyQuests: [],
            questHistory: [],
            xpLog: [],
            stats: {
                conversations: 0,
                make_laugh: 0,
                approach_group: 0,
                get_number: 0,
                handle_rejection: 0,
                weekly_approaches: 0,
                ask_out: 0,
                new_opener: 0
            }
        };
    }

    loadDailyApproaches() {
        const saved = localStorage.getItem('datingQuestDailyApproaches');
        if (saved) {
            const data = JSON.parse(saved);
            const today = new Date().toDateString();
            if (data.date === today) {
                return data.count;
            }
        }
        return 0;
    }

    saveDailyApproaches() {
        const today = new Date().toDateString();
        localStorage.setItem('datingQuestDailyApproaches', JSON.stringify({
            date: today,
            count: this.dailyApproaches
        }));
    }

    addApproach() {
        const today = new Date().toDateString();
        const lastApproachDate = this.gameData.lastApproachDate;
        
        // Reset counter if it's a new day
        if (lastApproachDate !== today) {
            this.dailyApproaches = 0;
        }
        
        this.dailyApproaches++;
        this.saveDailyApproaches();
        this.updateApproachCounter();
        
        // Add XP for approach
        this.addXP('approach', 1);
        
        // Add to XP log
        this.gameData.xpLog.unshift({
            action: 'Approach',
            xp: 1,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Keep only last 50 entries
        if (this.gameData.xpLog.length > 50) {
            this.gameData.xpLog = this.gameData.xpLog.slice(0, 50);
        }
        
        this.saveGameData();
        this.updateDisplay();
    }

    updateApproachCounter() {
        const counterElement = document.getElementById('dailyApproaches');
        if (counterElement) {
            counterElement.textContent = this.dailyApproaches;
        }
    }

    saveGameData() {
        localStorage.setItem('datingQuestData', JSON.stringify(this.gameData));
    }

    init() {
        this.updateDisplay();
        this.generateDailyQuests();
        this.updateAchievements();
        this.updateStreak();
        this.updateApproachCounter();
    }

    addXP(actionType, xp) {
        this.gameData.totalXP += xp;
        this.gameData.currentLevelXP += xp;
        
        // Update stats
        if (this.gameData.stats[actionType] !== undefined) {
            this.gameData.stats[actionType]++;
        }
        if (actionType === 'start_conversation' || actionType === 'ask_question' || actionType === 'make_laugh' || actionType === 'compliment') {
            this.gameData.stats.conversations++;
        }

        // Add to XP log
        this.gameData.xpLog.unshift({
            action: this.xpActions[actionType].name,
            xp: xp,
            timestamp: new Date().toLocaleString()
        });

        // Keep only last 50 log entries
        if (this.gameData.xpLog.length > 50) {
            this.gameData.xpLog = this.gameData.xpLog.slice(0, 50);
        }

        // Check for level up
        this.checkLevelUp();
        
        // Update streak
        this.updateStreak();
        
        // Update achievements
        this.updateAchievements();
        
        // Save data
        this.saveGameData();
        
        // Update display
        this.updateDisplay();
        
        // Show XP gained animation
        this.showXPGained(xp);
    }

    checkLevelUp() {
        const currentLevelData = this.levels.find(l => l.level === this.gameData.level);
        const nextLevelData = this.levels.find(l => l.level === this.gameData.level + 1);
        
        if (nextLevelData && this.gameData.totalXP >= nextLevelData.xp) {
            this.gameData.level++;
            this.gameData.currentLevelXP = this.gameData.totalXP - nextLevelData.xp;
            this.showLevelUp();
        } else if (currentLevelData) {
            this.gameData.currentLevelXP = this.gameData.totalXP - currentLevelData.xp;
        }
    }

    showLevelUp() {
        const levelData = this.levels.find(l => l.level === this.gameData.level);
        alert(`🎉 LEVEL UP! 🎉\nYou are now Level ${this.gameData.level} - ${levelData.title}!`);
    }

    showXPGained(xp) {
        // Create floating XP text
        const xpText = document.createElement('div');
        xpText.textContent = `+${xp} XP`;
        xpText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #4CAF50;
            font-size: 2em;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
        `;
        
        // Add animation CSS
        if (!document.getElementById('xpAnimation')) {
            const style = document.createElement('style');
            style.id = 'xpAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(xpText);
        setTimeout(() => xpText.remove(), 2000);
    }

    updateDisplay() {
        const currentLevelData = this.levels.find(l => l.level === this.gameData.level);
        const nextLevelData = this.levels.find(l => l.level === this.gameData.level + 1);
        
        document.getElementById('currentLevel').textContent = this.gameData.level;
        document.getElementById('levelTitle').textContent = currentLevelData ? currentLevelData.title : 'Epic';
        document.getElementById('currentXP').textContent = this.gameData.currentLevelXP;
        
        if (nextLevelData) {
            const xpNeeded = nextLevelData.xp - currentLevelData.xp;
            const xpProgress = this.gameData.currentLevelXP;
            const percentage = (xpProgress / xpNeeded) * 100;
            document.getElementById('xpBar').style.width = `${Math.min(percentage, 100)}%`;
            document.getElementById('nextLevelXP').textContent = xpNeeded;
        } else {
            document.getElementById('xpBar').style.width = '100%';
            document.getElementById('nextLevelXP').textContent = 'MAX';
        }
        
        document.getElementById('streak').textContent = this.gameData.streak;
        
        this.updateDailyQuests();
        this.updateQuestList();
        this.updateXPLog();
        this.updateAchievementList();
    }

    generateDailyQuests() {
        if (this.gameData.dailyQuests.length === 0 || this.isNewDay()) {
            const shuffled = [...this.dailyQuests].sort(() => Math.random() - 0.5);
            this.gameData.dailyQuests = shuffled.slice(0, 3).map(quest => ({
                text: quest,
                completed: false
            }));
        }
    }

    isNewDay() {
        const today = new Date().toDateString();
        const lastDate = this.gameData.lastApproachDate;
        return !lastDate || new Date(lastDate).toDateString() !== today;
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.gameData.lastApproachDate;
        
        if (!lastDate) {
            this.gameData.streak = 0;
        } else {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date();
            const diffTime = todayObj - lastDateObj;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                this.gameData.streak++;
            } else if (diffDays > 1) {
                this.gameData.streak = 1;
            }
        }
        
        this.gameData.lastApproachDate = today;
    }

    updateDailyQuests() {
        const container = document.getElementById('dailyQuests');
        container.innerHTML = '';
        
        this.gameData.dailyQuests.forEach((quest, index) => {
            const questDiv = document.createElement('div');
            questDiv.className = `quest-item ${quest.completed ? 'completed' : ''}`;
            questDiv.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="margin-right: 10px;">${quest.completed ? '✅' : '⭕'}</span>
                    <span>${quest.text}</span>
                </div>
            `;
            questDiv.onclick = () => this.completeQuest(index);
            questDiv.ontouchend = (e) => {
                e.preventDefault();
                this.completeQuest(index);
            };
            container.appendChild(questDiv);
        });
    }

    completeQuest(index) {
        if (!this.gameData.dailyQuests[index].completed) {
            this.gameData.dailyQuests[index].completed = true;
            this.addXP('start_conversation', 5); // Bonus XP for completing quest
            this.updateDisplay();
        }
    }

    updateQuestList() {
        const container = document.getElementById('questList');
        container.innerHTML = '';
        
        this.gameData.dailyQuests.forEach((quest, index) => {
            const questDiv = document.createElement('div');
            questDiv.className = `quest-item ${quest.completed ? 'completed' : ''}`;
            questDiv.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="margin-right: 10px;">${quest.completed ? '✅' : '⭕'}</span>
                    <span>${quest.text}</span>
                </div>
            `;
            questDiv.onclick = () => this.completeQuest(index);
            questDiv.ontouchend = (e) => {
                e.preventDefault();
                this.completeQuest(index);
            };
            container.appendChild(questDiv);
        });
    }

    rollRandomizer() {
        const randomIndex = Math.floor(Math.random() * this.randomizerPool.length);
        const randomApproach = this.randomizerPool[randomIndex];
        
        document.getElementById('randomResult').textContent = randomApproach;
        
        // Add some visual feedback
        const button = document.querySelector('.randomizer-button');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    updateXPLog() {
        const container = document.getElementById('xpLog');
        container.innerHTML = '';
        
        this.gameData.xpLog.slice(0, 20).forEach(entry => {
            const logDiv = document.createElement('div');
            logDiv.className = 'xp-log-item';
            logDiv.innerHTML = `
                <div class="action">${entry.action}</div>
                <div class="xp">+${entry.xp} XP</div>
            `;
            container.appendChild(logDiv);
        });
    }

    updateAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                let progress = 0;
                
                switch (achievement.type) {
                    case 'conversations':
                        progress = this.gameData.stats.conversations;
                        break;
                    case 'make_laugh':
                        progress = this.gameData.stats.make_laugh;
                        break;
                    case 'approach_group':
                        progress = this.gameData.stats.approach_group;
                        break;
                    case 'get_number':
                        progress = this.gameData.stats.get_number;
                        break;
                    case 'handle_rejection':
                        progress = this.gameData.stats.handle_rejection;
                        break;
                    case 'ask_out':
                        progress = this.gameData.stats.ask_out;
                        break;
                    case 'new_opener':
                        progress = this.gameData.stats.new_opener;
                        break;
                    case 'streak':
                        progress = this.gameData.streak;
                        break;
                }
                
                if (progress >= achievement.target) {
                    achievement.unlocked = true;
                    this.showAchievementUnlocked(achievement);
                }
            }
        });
    }

    showAchievementUnlocked(achievement) {
        alert(`🏆 ACHIEVEMENT UNLOCKED! 🏆\n${achievement.icon} ${achievement.name}\n${achievement.desc}`);
    }

    updateAchievementList() {
        const container = document.getElementById('achievementList');
        container.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementDiv.innerHTML = `
                <div class="achievement-icon">${achievement.unlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-text">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `;
            container.appendChild(achievementDiv);
        });
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Initialize the game
const game = new DatingQuest();

// Make addXP function globally available
function addXP(actionType, xp) {
    game.addXP(actionType, xp);
}

function rollRandomizer() {
    game.rollRandomizer();
}
