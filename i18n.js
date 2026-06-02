window.__lang = (function() {
    try { return localStorage.getItem('quiz-lang') || 'zh-TW'; } catch(e) { return 'zh-TW'; }
})();

// 共用的 Meta 資訊 (圖片與分數區間)
const _resultMeta = [
    { min: 0, max: 4, image: "tier1.png" },
    { min: 5, max: 9, image: "tier2.png" },
    { min: 10, max: 14, image: "tier3.png" },
    { min: 15, max: 19, image: "tier6.png" }, // 社交恐怖份子
    { min: 20, max: 24, image: "tier4.png" }, // 外星生物 (原 83-93% 與 67-80% 對調)
    { min: 25, max: 28, image: "tier5.png" }, // 暗黑破壞神 (原 67-80% 與 83-93% 對調)
    { min: 29, max: 30, image: "hero_image.png" } // 神明級別 (使用法式三色豆)
];

window.__i18n = {
    ui: {
        'zh-TW': {
            title:             '從你的<br><span class="highlight">「超怪異飲食癖好」</span><br>測你的精神不正常指數',
            subtitle:          '這不是普通的心理測驗，這是一本正經的靈魂拷問。準備好面對最真實的味蕾了嗎？',
            btn_start:         '開始測驗',
            q_count:           function(n, total) { return 'Q' + n + ' / ' + total; },
            loading_msg:       '正在分析你的大腦結構與味蕾...',
            loading_sub:       '（順便幫你聯絡義大利黑手黨與警察局）',
            result_label:      '你的精神不正常指數高達',
            btn_retry:         '不服氣？重新評估',
            btn_prev:          '◀ 上一題',
            share_text:        function(percent, tierName) {
                return `【心理測驗】從你的超怪異飲食癖好，測你的精神不正常指數！我的結果是高達 ${percent}% 的 ${tierName}，你也來測測看！`;
            }
        },
        'en': {
            title:             'Test Your<br><span class="highlight">Mental Abnormality</span><br>Through Weird Food Habits',
            subtitle:          'This is a serious soul interrogation. Are you ready to face your true taste buds?',
            btn_start:         'Start Quiz',
            q_count:           function(n, total) { return 'Q' + n + ' / ' + total; },
            loading_msg:       'Analyzing your brain and taste buds...',
            loading_sub:       '(And calling the Italian Mafia for you)',
            result_label:      'Your Mental Abnormality Index is',
            btn_retry:         'Retry? Re-evaluate',
            btn_prev:          '◀ Back',
            share_text:        function(percent, tierName) {
                return `[Quiz] Test your mental abnormality through weird food habits! My index is ${percent}% - ${tierName}. Find out yours!`;
            }
        }
    },

    questions: {
        'zh-TW': typeof questions !== 'undefined' ? questions : [],
        'en': [
            {
                question: "Q1. You just got a hot bag of large fries. What's your first move with the ketchup?",
                options: [
                    { text: "Squeeze it on the back of the paper pouch and dip (Normal Pacifist)", score: 0 },
                    { text: "No ketchup, and I ask for no salt (Are you a monk?)", score: 1 },
                    { text: "Tear it open and blindly squeeze it all over the fries (Chaotic Evil)", score: 2 },
                    { text: "Squeeze it directly onto the plastic tray paper (Fearless Bacteria Challenger)", score: 3 }
                ]
            },
            {
                question: "Q2. Hotpot time! Someone throws taro in and lets it melt into the soup. Your reaction?",
                options: [
                    { text: "Quickly scoop it out! The soup can still be saved! (Passive Defender)", score: 1 },
                    { text: "I think melted taro makes the soup richer (Mental Fortitude)", score: 2 },
                    { text: "This is now a pot of garbage. Friendship over! (Radical Soup Guardian)", score: 0 },
                    { text: "I am the one who threw the taro in (Social Terrorist)", score: 3 }
                ]
            },
            {
                question: "Q3. At a sushi conveyor belt, you see a fancy but completely unidentifiable 'mystery sushi'. You?",
                options: [
                    { text: "Never mind, salmon is the safest (Die-hard Safe Player)", score: 0 },
                    { text: "Googled reviews for 5 mins, but it already rotated away (Severe Indecision)", score: 1 },
                    { text: "Grab it! Life is an adventure, worst case I get diarrhea (Kamikaze)", score: 2 },
                    { text: "Tell my friend to grab it. If they don't die, I'll eat it (Dark Arts Master)", score: 3 }
                ]
            },
            {
                question: "Q4. The infamous 'Three-Color Beans' (corn, peas, carrots) appear in your bento box. You:",
                options: [
                    { text: "Swallow them anyway to not waste food (Yielding to Reality)", score: 0 },
                    { text: "Use chopsticks to pick them out one by one like clearing mines (End-stage OCD)", score: 1 },
                    { text: "Close my eyes and imagine it's a 5-star meal (Hypnosis Master)", score: 2 },
                    { text: "Secretly put them into my coworker's bento (First Workplace Bullying)", score: 3 }
                ]
            },
            {
                question: "Q5. Drinking boba tea, there are leftover pearls at the bottom you can't suck up. You?",
                options: [
                    { text: "Give up and throw it away (Quick Quitter)", score: 0 },
                    { text: "Stab the bottom frantically making loud slurping noises (Stubborn Soul)", score: 1 },
                    { text: "Tear the seal off and chug it like a beer (Reckless Hero)", score: 2 },
                    { text: "Remove the straw and shake the cup, trying to toss them into your mouth with gravity (Absolute Absurdity)", score: 3 }
                ]
            },
            {
                question: "Q6. The chef serves a fragrant bowl of noodles, but it's completely covered in a mountain of cilantro.",
                options: [
                    { text: "Too lazy to pick it out, hold my nose and swallow (Surrendering to Fate)", score: 0 },
                    { text: "Perform micro-surgery to remove every single leaf (End-stage Cilantro Phobia)", score: 1 },
                    { text: "Look at my friend and say 'I saved the cilantro for you' (Sadist)", score: 2 },
                    { text: "Awesome! Cilantro is the soul, please give me more! (Cilantro Cult Worshipper)", score: 3 }
                ]
            },
            {
                question: "Q7. Eating authentic Japanese ramen, when you finish the noodles and are about to ask for a refill (Kaedama), your bowl:",
                options: [
                    { text: "Still has half the broth, elegantly waiting for new noodles (Normal Ramen Etiquette)", score: 0 },
                    { text: "Has one sip of broth left, but floating with all the fatty pork and green onions I hate (Advanced Picky Eater)", score: 1 },
                    { text: "I haven't finished, but I'm too shy to yell 'Kaedama', so I just pay and leave (Social Anxiety Victim)", score: 2 },
                    { text: "Noodles are gone, not a drop of broth left. Staring at the empty bowl: 'Wait, what am I soaking the new noodles in?' (Intuitive Glutton)", score: 3 }
                ]
            },
            {
                question: "Q8. The Taiwanese street food 'Ba-wan' (Meatball). What is its perfect soul form?",
                options: [
                    { text: "Deep-fried until the skin is super crispy! (Crispy Extremist)", score: 0 },
                    { text: "Steamed is king! Soft and smooth. Fried is just grease! (Steamed Fundamentalist)", score: 0 },
                    { text: "As long as there's enough sweet chili sauce, I don't care if it's microwaved (Sauce is the Main Body)", score: 2 },
                    { text: "No matter which one, I MUST cut it into tiny shreds with scissors before eating (OCD Deconstructionist)", score: 3 }
                ]
            },
            {
                question: "Q9. If you HAVE to challenge a 'Bizarre Taiwanese Pizza' for lunch today, you choose:",
                options: [
                    { text: "You're all crazy! I'd rather order Hawaiian (Rather anger Italians than torture my stomach)", score: 0 },
                    { text: "Intestine Noodle Pizza: Garlic and cilantro on crust (Double Carb Heavy Hit)", score: 1 },
                    { text: "Cilantro Century Egg Pig Blood Cake Pizza (The Ultimate Dark Fusion)", score: 2 },
                    { text: "Sweet Mugwort Turtle Pizza (Visual impact that makes even gods shake their heads)", score: 3 }
                ]
            },
            {
                question: "Q10. At a fast-food joint, which 'Urban Legend Eating Method' have you tried or want to try?",
                options: [
                    { text: "I refuse heresy! Burgers must be eaten layer by layer! (Pretending to be normal)", score: 0 },
                    { text: "Soul Dipping: French fries MUST be dipped in ice cream! (God-tier Explorer)", score: 1 },
                    { text: "Mystery Mix: Pouring coffee creamer into Sprite to make a yogurt drink (Modern Alchemist)", score: 2 },
                    { text: "Ultimate Richness: Pouring fries and pepper into the corn soup (Hypertension Master)", score: 3 }
                ]
            }
        ]
    },

    resultText: {
        'zh-TW': [
            { name: "【極度稀有】地球上最後的正常人", desc: "你在飲食界就像是一股清流，太正常了，正常到甚至讓人懷疑你是不是 AI 派來的間諜！你堅持原味、循規蹈矩，從不涉足那些邪門歪道的都市傳說吃法。你的腸胃應該對你非常感激。不過，這麼正常的你，身邊一定潛伏著不少飲食怪胎吧？快把測驗丟進群組，抓出那些潛藏在你身邊的「社交恐怖份子」！" },
            { name: "【微度偏執】有點毛病，但無傷大雅", desc: "你有一些莫名的堅持與微小的執著，像是挑食或者特定的食用順序，但在朋友眼中，你充其量只是有點「難搞」而已。大致上，你還是一個可以同桌吃飯的安全牌，不需要特別為你準備隔離區。不過要小心，這種微小的偏執往往是走向黑化的第一步，快把測驗分享出去，看看你的朋友們是不是已經病入膏肓了！" },
            { name: "【潛在混亂】你的味蕾正在偷偷黑化", desc: "別裝了，你的飲食習慣已經逐漸脫離常軌！你偶爾會做出一些讓人皺眉的飲食決策，甚至偷偷覺得某些獵奇食物「其實滿好吃的」。你還在努力維持正常人的假象，但你的味蕾早就已經蠢蠢欲動，渴望更多暗黑力量的洗禮。快坦承吧，並把這個測驗發給朋友，告訴他們：「其實我沒有你們想像的那麼正常...」" },
            { name: "【社交恐怖份子】跟你吃飯需要極大的勇氣", desc: "警告！你對食物的執念和詭異吃法，已經讓同桌的人感到深深的恐懼！你就是餐桌上的未爆彈，大家都在防著你，深怕你下一秒又把什麼不該加的東西倒進湯裡。跟你吃飯就像在玩踩地雷，充滿了不確定的刺激感。快把這個結果分享到限動，讓那些曾經受害的飯友們來為你的恐怖行徑作證！" },
            { name: "【異次元食怪】連達爾文都無法解釋的存在", desc: "你的飲食習慣已經徹底超越了人類的理解範圍！你的味覺構造絕對跟我們不一樣，那些對一般人來說無法接受的獵奇組合，對你來說卻是珍饈美味。你簡直就是飲食界的奇行種，擁有無堅不摧的神奇腸胃。趕快把這個測驗散佈出去，看看世界上還有沒有人能達到你這種超乎常理的境界！" },
            { name: "【暗黑破壞神】地獄廚房的榮譽校友", desc: "老天，正常食物到你手裡都會發生恐怖的化學變化，變成另一種無法名狀的暗黑物質！你的胃袋是用鈦合金做的嗎？義大利人看到你的披薩選擇會直接中風，拉麵師傅看到你的吃法會流下眼淚。你根本是地獄廚房派來毀滅地球美食的使者。快分享你的傲人成績，看看這世界上還有沒有人能理解你的終極味覺！" },
            { name: "【不正常人類研究中心院長】你不是吃東西，你是來超渡食物的", desc: "膜拜吧！你的存在本身就是對全宇宙美食的終極挑釁。連廚神看到你都要退避三舍，刑警已經在來的路上了！你對食物的解構與重組能力，已經達到了超凡入聖的境界。凡人根本無法評斷你的品味，因為你已經在另一個次元了。立刻將這個測驗結果公告天下，讓世人見識見識什麼叫做真正的「飲食界神之領域」！" }
        ],
        'en': [
            { name: "[Ultra Rare] The Last Normal Human", desc: "You're a breath of fresh air in the food world. So normal, people suspect you're an AI spy! You stick to the classics, follow the rules, and never dabble in those cursed urban legend recipes. Your stomach must be incredibly grateful. But surely, a normal person like you must be surrounded by food freaks, right? Share this quiz and expose the 'Social Terrorists' hiding in your group chats!" },
            { name: "[Slightly Paranoid] Quirky but Harmless", desc: "You have some weird little rules and minor obsessions—maybe you're a picky eater or have a strict order of eating things. In your friends' eyes, you're just slightly 'high maintenance'. Overall, you're still a safe dining companion who doesn't require a quarantine zone. But beware, these minor quirks are the gateway to the dark side. Share this quiz to see if your friends are already beyond saving!" },
            { name: "[Latent Chaos] Taste Buds Turning Dark", desc: "Stop pretending! Your food habits are quietly slipping away from normalcy. You occasionally make questionable dining choices and secretly think certain bizarre foods are 'actually pretty good'. You're still trying to keep up the facade of a normal person, but your taste buds are thirsting for darker, chaotic flavors. Confess now, and share this with your friends: 'I'm not as normal as you thought...'" },
            { name: "[Social Terrorist] Dining Takes Courage", desc: "WARNING! Your bizarre food obsessions have struck deep fear into the hearts of everyone at your table! You are a culinary ticking time bomb. People are constantly on guard, terrified you'll dump something unspeakable into the communal soup. Dining with you is like playing Minesweeper. Share this on your story and let your traumatized dining buddies testify to your reign of terror!" },
            { name: "[Interdimensional Food Monster] Darwin Can't Explain You", desc: "Your eating habits have entirely transcended human comprehension! Your taste receptors are definitely not built like ours. Combos that are normally unimaginable to others are delicacies to you. You are truly a culinary anomaly with an indestructible stomach. Share this quiz to see if anyone else in the world can reach your unfathomable level of bizarre tastes!" },
            { name: "[Diablo] Hell's Kitchen Alumni", desc: "Good lord, normal food turns into an unnameable dark matter in your hands! Is your stomach lined with titanium? Italians would instantly stroke out seeing your pizza choices, and ramen masters would weep at your eating habits. You are an emissary sent from Hell's Kitchen to destroy earthly cuisine. Share your proud achievement and see if anyone on this planet can comprehend your ultimate palate!" },
            { name: "[Director of Abnormal Human Research] Food Exorcist", desc: "Bow down! Your very existence is a provocation to all gastronomy in the universe. Even the God of Cooking would retreat from you, and the culinary police are already en route! Your ability to deconstruct and reconstruct food has reached a divine, terrifying realm. Mere mortals cannot judge your taste because you operate in another dimension. Broadcast this result immediately and let the world witness the true 'God Domain of Dining'!" }
        ]
    }
};

window.setLanguage = function(lang) {
    if (!window.__i18n.ui[lang]) return;
    window.__lang = lang;
    try { localStorage.setItem('quiz-lang', lang); } catch(e) {}

    // 更新按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const ui = window.__i18n.ui[lang];

    // 更新 HTML (允許 innerHTML 的)
    ['title', 'subtitle'].forEach(key => {
        const el = document.querySelector(`[data-i18n="${key}"]`);
        if (el) el.innerHTML = ui[key];
    });

    // 更新純文字
    ['btn_start', 'loading_msg', 'loading_sub', 'result_label', 'btn_retry', 'btn_prev'].forEach(key => {
        document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
            el.textContent = ui[key];
        });
    });

    // 進度保留渲染
    const quizActive = document.getElementById('quiz-screen')?.classList.contains('active');
    const resultActive = document.getElementById('result-screen')?.classList.contains('active');

    if (quizActive && typeof loadQuestion === 'function') {
        loadQuestion(true); // 傳入 true 表示僅切換語言重繪
    }
    if (resultActive && typeof renderResult === 'function') {
        renderResult();
    }
};
