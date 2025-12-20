// GitHubリポジトリの設定
const GITHUB_USER = '4ckha9';  // あなたのGitHubユーザー名
const GITHUB_REPO = 'go-for-it';      // リポジトリ名
const BLOG_FOLDER = 'blog';            // mdファイルを置くフォルダ名

async function loadBlogPosts() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const container = document.getElementById('blogPosts');

    try {
        // GitHub APIでblogフォルダ内のファイルリストを取得
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${BLOG_FOLDER}`
        );

        if (!response.ok) {
            throw new Error('ブログ記事の取得に失敗しました');
        }

        const files = await response.json();
        
        // .mdファイルのみフィルタリング
        const mdFiles = files.filter(file => file.name.endsWith('.md'));

        if (mdFiles.length === 0) {
            container.innerHTML = '<p class="loading">まだ記事がありません</p>';
            loading.style.display = 'none';
            return;
        }

        // 各mdファイルの内容を取得
        const posts = await Promise.all(
            mdFiles.map(async (file) => {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                
                // ファイル名から日付を抽出 (例: 2024-01-15-title.md)
                const dateMatch = file.name.match(/^(\d{4}-\d{2}-\d{2})/);
                const date = dateMatch ? dateMatch[1] : '';
                
                // タイトルを抽出 (最初の#から)
                const titleMatch = content.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : file.name.replace('.md', '');
                
                // タイトル行を除外した本文
                const body = content.replace(/^#\s+.+$/m, '').trim();

                return {
                    title,
                    content: body,
                    date: date ? new Date(date).toLocaleDateString('ja-JP') : '',
                    filename: file.name,
                    rawDate: date
                };
            })
        );

        // 日付でソート（新しい順）
        posts.sort((a, b) => b.rawDate.localeCompare(a.rawDate));

        // 表示
        container.innerHTML = posts.map(post => `
            <div class="blog-post">
                ${post.date ? `<div class="blog-date">${post.date}</div>` : ''}
                <h3>${post.title}</h3>
                <div>${marked.parse(post.content)}</div>
            </div>
        `).join('');

        loading.style.display = 'none';

    } catch (err) {
        console.error('Error loading blog posts:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = `エラー: ${err.message}。GitHubの設定を確認してください。`;
    }
}

loadBlogPosts();
