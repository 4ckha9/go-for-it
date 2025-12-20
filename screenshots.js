// GitHubリポジトリの設定
const GITHUB_USER = '4ckha9';  // あなたのGitHubユーザー名
const GITHUB_REPO = 'go-for-it';      // リポジトリ名
const SCREENSHOT_FOLDER = 'screenshots';  // 画像を置くフォルダ名

async function loadScreenshots() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const container = document.getElementById('screenshotsGrid');

    try {
        // GitHub APIでscreenshotsフォルダ内のファイルリストを取得
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${SCREENSHOT_FOLDER}`
        );

        if (!response.ok) {
            throw new Error('スクリーンショットの取得に失敗しました');
        }

        const files = await response.json();
        
        // 画像ファイルのみフィルタリング
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
        );

        if (imageFiles.length === 0) {
            container.innerHTML = '<p class="loading">まだスクリーンショットがありません</p>';
            loading.style.display = 'none';
            return;
        }

        // 日付でソート（ファイル名に日付が含まれている場合）
        imageFiles.sort((a, b) => b.name.localeCompare(a.name));

        // 表示
        container.innerHTML = imageFiles.map(file => {
            // ファイル名からキャプションを生成（拡張子除去、ハイフンをスペースに）
            const caption = file.name
                .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
                .replace(/[-_]/g, ' ');

            return `
                <div class="screenshot" onclick="openModal('${file.download_url}')">
                    <img src="${file.download_url}" alt="${caption}" loading="lazy">
                    <div class="screenshot-caption">${caption}</div>
                </div>
            `;
        }).join('');

        loading.style.display = 'none';

    } catch (err) {
        console.error('Error loading screenshots:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = `エラー: ${err.message}。GitHubの設定を確認してください。`;
    }
}

function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'block';
    modalImg.src = src;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

loadScreenshots();
