/* ============================================
   JEENIE - Central Configuration
   ============================================
   ⚙️  Change values here — they reflect EVERYWHERE on all pages.
   ============================================ */

const JEENIE_CONFIG = {

    /* ── WhatsApp ── */
    whatsappNumber: '91XXXXXXXXXX',   // e.g. '919876543210'

    /* ── Credits: free & referral ── */
    signupCredits: 10,                // Credits given on new signup
    referralCredits: 10,              // Credits given per referral (both sides)
    freeSignupExpiry: 30,             // Days before free signup credits expire

    /* ── Credit cost per action ── */
    creditCosts: {
        miniTest: 2,   // 5-question test
        summary: 1,   // Chapter summary
        mindmap: 2,   // Mindmap (text or PDF)
        doubtText: 1,   // Text doubt
        doubtImage: 2,   // Image / photo doubt
        flashcards: 1,   // Formula flashcards
        dailyStreak: 0,   // FREE — always
    },

    /* ── Pricing plans ── */
    plans: [
        {
            id: 'starter',
            emoji: '🌱',
            name: 'Starter',
            price: 149,
            credits: 50,
            popular: false,
            features: [
                '25 Mini Tests (5 Qs each)',
                '50 Text Doubts',
                '50 Chapter Summaries',
                '25 Mindmaps or Image Doubts',
                'Credits never expire',
            ],
            dailyStreakFree: false,   // ← Starter does NOT include free daily streak
            prioritySpeed: false,
            referralBonus: false,
        },
        {
            id: 'pro',
            emoji: '⚡',
            name: 'Pro',
            price: 299,
            credits: 120,
            popular: false,
            features: [
                '60 Mini Tests (5 Qs each)',
                '120 Text Doubts',
                '120 Chapter Summaries',
                '60 Mindmaps or Image Doubts',
                'Credits never expire',
                'Priority response speed',
            ],
            dailyStreakFree: true,
            prioritySpeed: true,
            referralBonus: false,
        },
        {
            id: 'ultimate',
            emoji: '🚀',
            name: 'Ultimate',
            price: 499,
            credits: 300,
            popular: true,
            features: [
                '150 Mini Tests (5 Qs each)',
                '300 Text Doubts',
                '300 Chapter Summaries',
                '150 Mindmaps or Image Doubts',
                'Credits never expire',
                'Priority response speed',
                `Bonus ${10} referral credits`,
            ],
            dailyStreakFree: true,
            prioritySpeed: true,
            referralBonus: true,
        },
    ],

    /* ── Razorpay ── */
    razorpayKey: 'rzp_test_YOUR_KEY_HERE',  // Replace with your live key

    /* ── Support ── */
    supportEmail: 'support@jeenie.koax.in',
};


/* ============================================
   AUTO-RENDER ENGINE
   All [data-cfg="keyPath"] elements are
   auto-populated from JEENIE_CONFIG above.
   ============================================ */
(function renderConfig() {
    const cfg = JEENIE_CONFIG;

    /* Helper: read a dot-path from cfg, e.g. "creditCosts.miniTest" */
    function resolve(path) {
        return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), cfg);
    }

    /* 1. Simple text replacements via [data-cfg="path"] */
    document.querySelectorAll('[data-cfg]').forEach(el => {
        const val = resolve(el.dataset.cfg);
        if (val !== undefined) el.textContent = val;
    });

    /* 2. WhatsApp href replacements via [data-wa-msg] */
    document.querySelectorAll('[data-wa-msg]').forEach(el => {
        const msg = encodeURIComponent(el.dataset.waMsg);
        el.href = `https://wa.me/${cfg.whatsappNumber}?text=${msg}`;
    });
    document.querySelectorAll('[data-wa]').forEach(el => {
        el.href = `https://wa.me/${cfg.whatsappNumber}`;
    });

    /* 3. Render the pricing grid dynamically */
    const grid = document.getElementById('pricingGrid');
    if (grid) {
        grid.innerHTML = '';
        cfg.plans.forEach(plan => {
            const perCredit = (plan.price / plan.credits).toFixed(2);
            const popularBadge = plan.popular
                ? `<div class="pricing-popular-badge">🔥 Most Popular</div>` : '';
            const streakRow = plan.dailyStreakFree
                ? `<div class="pricing-feature"><span class="check">✓</span><span>Daily Streaks (FREE)</span></div>`
                : `<div class="pricing-feature" style="opacity:0.4;"><span style="color:var(--text-muted);">—</span><span style="color:var(--text-muted);">Daily Streak not included</span></div>`;
            const featureRows = plan.features
                .map(f => `<div class="pricing-feature"><span class="check">✓</span><span>${f}</span></div>`)
                .join('');
            const btnClass = plan.popular ? 'btn btn-primary' : 'btn btn-outline';

            const card = document.createElement('div');
            card.className = `pricing-card animate-on-scroll${plan.popular ? ' pricing-card-popular' : ''}`;
            card.innerHTML = `
        ${popularBadge}
        <div class="pricing-icon">${plan.emoji}</div>
        <div class="pricing-name">${plan.name}</div>
        <div class="pricing-price">₹<span>${plan.price}</span></div>
        <div class="pricing-credits"><strong>${plan.credits} Credits</strong> · ₹${perCredit} per credit</div>
        <div class="pricing-features">
          ${featureRows}
          ${streakRow}
        </div>
        <button class="${btnClass} pricing-cta" data-plan="${plan.id}" id="btn-${plan.id}">
          Get ${plan.name} Pack
        </button>`;
            grid.appendChild(card);
        });

        /* Re-attach plan click listeners after dynamic render */
        grid.querySelectorAll('[data-plan]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof openRazorpay === 'function') openRazorpay(btn.dataset.plan);
            });
        });

        /* Re-run scroll observer on new cards */
        if (typeof observer !== 'undefined') {
            grid.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        }
    }

    /* 4. Render the credit cost table dynamically */
    const creditTable = document.getElementById('creditCostTable');
    if (creditTable) {
        const rows = [
            { icon: '📝', label: 'Mini Test (5 Questions)', key: 'creditCosts.miniTest', suffix: 'credits' },
            { icon: '📖', label: 'Chapter Summary', key: 'creditCosts.summary', suffix: 'credit' },
            { icon: '🗺️', label: 'Mindmap (Text/PDF)', key: 'creditCosts.mindmap', suffix: 'credits' },
            { icon: '💬', label: 'Doubt (Text)', key: 'creditCosts.doubtText', suffix: 'credit' },
            { icon: '📷', label: 'Doubt (Image/Photo)', key: 'creditCosts.doubtImage', suffix: 'credits' },
            { icon: '⚡', label: 'Formula Flashcards', key: 'creditCosts.flashcards', suffix: 'credit' },
            { icon: '🔥', label: 'Daily Streak Question', key: null, free: true },
            { icon: '🎁', label: 'New User Signup Bonus', key: null, free: true, label2: `+${cfg.signupCredits} FREE` },
            { icon: '🤝', label: 'Referral Bonus (per friend)', key: null, free: true, label2: `+${cfg.referralCredits} FREE` },
        ];
        creditTable.innerHTML = rows.map(r => {
            const cost = r.free
                ? `<div class="credit-cost credit-cost-free">${r.label2 || 'FREE'}</div>`
                : `<div class="credit-cost credit-cost-paid">${resolve(r.key)} ${r.suffix}</div>`;
            return `
        <div class="credit-row" role="row">
          <div class="credit-action" role="cell"><span class="credit-action-icon">${r.icon}</span>${r.label}</div>
          ${cost}
        </div>`;
        }).join('');
    }
})();
