// GitHubリポジトリの設定
const GITHUB_USER = '4ckha9';  // あなたのGitHubユーザー名
const GITHUB_REPO = 'go-for-it';      // リポジトリ名

let games = [];

async function loadGames() {
    const container = document.getElementById('gamesGrid');
    if (!container) return;

    try {
        // games.jsonを読み込み
        const response = await fetch(
            `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/games.json`
        );

        if (!response.ok) {
            throw new Error('ゲームリストの取得に失敗しました');
        }

        games = await response.json();
        renderGames();

    } catch (err) {
        console.error('Error loading games:', err);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">
                ゲームリストの読み込みに失敗しました。games.jsonを確認してください。
            </div>
        `;
    }
}

function renderGames() {
    const container = document.getElementById('gamesGrid');
    if (!container || games.length === 0) return;
    
    container.innerHTML = games.map(game => `
        <div class="game-card" onclick="window.open('${game.url}', '_blank')">
            <div class="game-image">${game.emoji || '🎮'}</div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
            </div>
        </div>
    `).join('');
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
    loadGames();
}