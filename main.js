let games = [];

async function loadData() {
    try {
        const gamesData = await window.storage.get('gfi-games');
        if (gamesData) games = JSON.parse(gamesData.value);
    } catch (e) {
        games = [
            { title: 'Final Fantasy XIV', emoji: '⚔️', desc: 'メインで活動しているMMORPG' },
            { title: 'Apex Legends', emoji: '🎯', desc: 'カジュアルにプレイ中' }
        ];
    }

    renderGames();
}

function renderGames() {
    const container = document.getElementById('gamesGrid');
    if (!container) return;
    
    container.innerHTML = games.map(game => `
        <div class="game-card">
            <div class="game-image">${game.emoji}</div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
            </div>
        </div>
    `).join('');
}

async function addGame() {
    const title = document.getElementById('gameTitle').value;
    const emoji = document.getElementById('gameEmoji').value;
    const desc = document.getElementById('gameDesc').value;
    
    if (!title || !emoji || !desc) {
        alert('すべての項目を入力してください');
        return;
    }

    games.push({ title, emoji, desc });
    
    try {
        await window.storage.set('gfi-games', JSON.stringify(games));
        document.getElementById('gameTitle').value = '';
        document.getElementById('gameEmoji').value = '';
        document.getElementById('gameDesc').value = '';
        renderGames();
    } catch (e) {
        alert('保存に失敗しました: ' + e.message);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

if (document.getElementById('gamesGrid')) {
    loadData();
}