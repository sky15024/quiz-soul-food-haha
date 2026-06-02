// 全域變數
let currentQuestionIndex = 0;
let answers = [];
let shuffleMap = []; // 用於記錄每題的分數
let currentPercent = 0;
let currentTierIndex = 0;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const btnPrev = document.getElementById('btn-prev');
const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');

const finalScoreEl = document.getElementById('final-score');
const tierBadgeEl = document.getElementById('tier-badge');
const resultDescEl = document.getElementById('result-description');
const resultImageEl = document.getElementById('result-image');

// 初始化 answers 陣列
function initAnswers() {
    const qs = window.__i18n.questions[window.__lang || 'zh-TW'];
    answers = new Array(qs.length).fill(null);
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function switchScreen(newScreen) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    newScreen.classList.add('active');
}

function startQuiz() {
    initAnswers();
    currentQuestionIndex = 0;
    const qs = window.__i18n.questions[window.__lang || 'zh-TW'];
    shuffleMap = qs.map(q => {
        let indices = Array.from({length: q.options.length}, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    });
    loadQuestion();
    switchScreen(quizScreen);
}

// 傳入 isLangSwitch = true 表示只是切換語言重繪，不要影響選項進度
function loadQuestion(isLangSwitch = false) {
    const lang = window.__lang || 'zh-TW';
    const qs = window.__i18n.questions[lang];
    const question = qs[currentQuestionIndex];
    const ui = window.__i18n.ui[lang];
    
    questionNumberEl.textContent = ui.q_count(currentQuestionIndex + 1, qs.length);
    questionTextEl.textContent = question.question;
    
    // Update progress bar
    const progressPercent = ((currentQuestionIndex) / qs.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Add animation to make it smooth
    optionsContainer.style.animation = 'none';
    questionTextEl.style.animation = 'none';
    void optionsContainer.offsetWidth; // force reflow
    optionsContainer.style.animation = 'fadeUp 0.3s ease-out';
    questionTextEl.style.animation = 'fadeUp 0.3s ease-out';

    // 處理上一題按鈕狀態
    btnPrev.disabled = currentQuestionIndex === 0;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Add options
    const order = shuffleMap[currentQuestionIndex] || Array.from({length: question.options.length}, (_, i) => i);
    order.forEach(idx => {
        const option = question.options[idx];
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        // 如果已經選過，且正在回放，可以加上 selected 狀態
        if (answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] === option.score) {
            btn.classList.add('selected');
        }
        
        let mainText = option.text;
        let subText = "";
        const match = option.text.match(/^(.*?)[（(](.*?)[）)]\s*$/);
        if (match) {
            mainText = match[1].trim();
            subText = match[2].trim();
        }
        
        if (subText) {
            btn.innerHTML = `<div class="opt-main">${mainText}</div><div class="opt-sub">(${subText})</div>`;
        } else {
            btn.innerHTML = `<div class="opt-main">${mainText}</div>`;
        }
        
        btn.addEventListener('click', () => handleOptionClick(option.score, btn));
        optionsContainer.appendChild(btn);
    });
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function handleOptionClick(score, btn) {
    // 視覺反饋
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    // 記錄分數
    answers[currentQuestionIndex] = score;

    // 延遲跳題，讓使用者看到按鈕變色 (調降延遲增加順暢感)
    setTimeout(() => {
        currentQuestionIndex++;
        const qs = window.__i18n.questions[window.__lang || 'zh-TW'];

        if (currentQuestionIndex < qs.length) {
            loadQuestion();
        } else {
            showLoadingScreen();
        }
    }, 100);
}

function showLoadingScreen() {
    progressBar.style.width = `100%`;
    switchScreen(loadingScreen);
    
    // 計算總分
    let totalScore = 0;
    answers.forEach(score => {
        if (score !== null) totalScore += score;
    });

    // 預先計算好結果 (為了能夠支援語言切換，把 index 記下來)
    currentPercent = Math.round((totalScore / 30) * 100);
    currentTierIndex = 0;
    
    for (let i = 0; i < _resultMeta.length; i++) {
        if (totalScore >= _resultMeta[i].min && totalScore <= _resultMeta[i].max) {
            currentTierIndex = i;
            break;
        }
    }
    if (totalScore > 30) currentTierIndex = _resultMeta.length - 1;

    setTimeout(() => {
        renderResult();
        switchScreen(resultScreen);
        
        // ==========================================
        // 🚀 Game Ads Skill: 插頁廣告觸發 (3秒後)
        // ==========================================
        setTimeout(() => {
            if (typeof showAdInterstitial === 'function') {
                showAdInterstitial();
            }
        }, 3000);
        
    }, 2000);
}

function renderResult() {
    const lang = window.__lang || 'zh-TW';
    const meta = _resultMeta[currentTierIndex];
    const textData = window.__i18n.resultText[lang][currentTierIndex];

    // 填充資料
    finalScoreEl.textContent = currentPercent;
    tierBadgeEl.textContent = textData.name;
    resultDescEl.textContent = textData.desc;
    resultImageEl.src = meta.image;
}

function restartQuiz() {
    switchScreen(startScreen);
}

// ==========================================
// 🚀 社群分享技能 (Social Share Skill)
// ==========================================

function isLineIAB() { return /Line/i.test(navigator.userAgent); }
function isMobile() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }

function copyTextFallback(str) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(str).catch(() => execCopyFallback(str));
    }
    return execCopyFallback(str);
}

function execCopyFallback(str) {
    return new Promise((resolve) => {
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);
        resolve();
    });
}
  
function openUrl(url) { window.open(url, '_blank'); }

function shareTo(platform) {
    const url = window.location.href;
    const lang = window.__lang || 'zh-TW';
    const textData = window.__i18n.resultText[lang][currentTierIndex];
    const shareUI = window.__i18n.ui[lang].share_text;
    const text = shareUI(currentPercent, textData.name);
    const fullText = encodeURIComponent(text + ' ' + url);
  
    if (platform === 'copy') {
        copyTextFallback(text + '\n' + url).then(() => showShareToast('✅ 已複製連結！'));
        return;
    }
    if (platform === 'ig') {
        copyTextFallback(text + ' ' + url).then(() => {
            showShareToast('📸 文字已複製！請到 IG 貼上');
            setTimeout(() => { isMobile() ? window.location.href = 'instagram://app' : openUrl('https://www.instagram.com/'); }, 600);
        });
        return;
    }
  
    let shareUrl = '';
    switch (platform) {
        case 'line':
            if (isMobile()) shareUrl = `line://msg/text/${encodeURIComponent(text + '\n' + url)}`;
            else if (isLineIAB()) shareUrl = `https://line.me/R/share?text=${fullText}`;
            else shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'threads':
            shareUrl = `https://www.threads.net/intent/post?text=${fullText}`;
            break;
        case 'fb':
            if (isMobile()) {
                window.location.href = `fb://share/?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                setTimeout(() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank'); }, 1500);
                return;
            }
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
    }
    if (shareUrl) { platform === 'line' && isMobile() ? window.location.href = shareUrl : openUrl(shareUrl); }
}

function showShareToast(msg) {
    let toast = document.getElementById('share-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'share-toast';
        toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--text-color);border:2px solid var(--accent-yellow);color:#fff;padding:14px 24px;border-radius:12px;font-size:15px;z-index:9999;opacity:0;transition:all 0.3s;box-shadow: 4px 4px 0px var(--accent-red);font-family:"Noto Sans TC";text-align:center;max-width:320px;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 4000);
}

// ── html2canvas 儲存結果圖 ──
function downloadCanvasImage(canvas, filename) {
    try {
        canvas.toBlob(function(blob) {
            if (!blob) { fallbackDataURLDownload(canvas, filename); return; }
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 500);
        }, 'image/png');
    } catch(e) { fallbackDataURLDownload(canvas, filename); }
}

function fallbackDataURLDownload(canvas, filename) {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); }, 500);
}

function showImageOverlay(dataUrl) {
    const old = document.getElementById('img-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'img-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(59, 51, 44, 0.95);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
    overlay.innerHTML = `
        <img src="${dataUrl}" alt="結果圖" style="max-width:92%;max-height:70vh;border-radius:12px;box-shadow:4px 4px 0px #FFEA92;border:3px solid #FFEA92;">
        <p style="color:#FFF;margin-top:20px;font-size:16px;font-weight:bold;">📸 請長按圖片儲存，去社群炫耀吧！</p>
        <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:24px;color:#3B332C;background:#FFEA92;font-size:15px;font-weight:bold;border:2px solid #3B332C;border-radius:8px;padding:12px 32px;cursor:pointer;box-shadow:2px 2px 0px #3B332C;">← 返回測驗</button>
    `;
    document.body.appendChild(overlay);
}

let _saving = false;
async function saveResultImage() {
    if (_saving) return;
    _saving = true;
    
    const btn = document.querySelector('.share-save');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span style="font-size:14px;font-weight:bold;">產生中...</span>';
    btn.disabled = true;

    try {
        const captureArea = document.getElementById('capture-area');
        
        // 暫時修改樣式以確保完整截圖
        const origHeight = captureArea.style.height;
        const origOverflow = captureArea.style.overflow;
        captureArea.style.height = 'max-content';
        captureArea.style.overflow = 'visible';
        
        const canvas = await html2canvas(captureArea, { 
            backgroundColor: "#FCFAF6", 
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY
        });
        
        // 恢復原狀
        captureArea.style.height = origHeight;
        captureArea.style.overflow = origOverflow;

        if (isMobile() || isLineIAB()) {
            const dataUrl = canvas.toDataURL('image/png');
            showImageOverlay(dataUrl);
        } else {
            downloadCanvasImage(canvas, 'quiz-result.png');
            btn.innerHTML = '<span style="font-size:14px;font-weight:bold;color:#D96C6C;">已儲存</span>';
            setTimeout(() => { btn.innerHTML = origHTML; }, 2000);
        }
    } catch (e) {
        showShareToast('⚠️ 下載失敗，請手動截圖分享');
    } finally {
        if(!isMobile() && !isLineIAB()) btn.disabled = false;
        else {
             btn.innerHTML = origHTML;
             btn.disabled = false;
        }
        _saving = false;
    }
}

// ==========================================
// 🚀 Game Ads Skill: 插頁廣告控制邏輯
// ==========================================
function showAdInterstitial() {
    const el = document.getElementById('ad-interstitial');
    if (!el) return;
    el.style.display = 'flex';
    const closeBtn = el.querySelector('.ad-inter-close');
    closeBtn.disabled = true;
    closeBtn.textContent = '5';
    closeBtn.style.cursor = 'not-allowed';
    closeBtn.style.opacity = '0.5';
    let count = 5;
    const timer = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(timer);
            closeBtn.textContent = '✕';
            closeBtn.disabled = false;
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.opacity = '1';
        } else {
            closeBtn.textContent = count;
        }
    }, 1000);
}

function closeAdInterstitial() {
    const el = document.getElementById('ad-interstitial');
    if (!el) return;
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => {
        el.style.display = 'none';
        el.style.opacity = '1';
        el.style.transition = '';
    }, 300);
}
