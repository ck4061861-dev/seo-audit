import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────
function buildGeminiPrompt(domain) {
  return `You are an expert SEO/AEO/GEO auditor. Analyze: ${domain}

Return ONLY a raw JSON object (no markdown, no code fences, no explanation).

Rules:
- All scores: realistic numbers 0-100
- overall = SEO*0.4 + AEO*0.3 + GEO*0.3
- PASS/WARN/FAIL must be realistic and varied
- All text must reference ${domain} specifically
- EXACTLY 6 competitors, 10 primary kw, 15 long-tail kw, 8 local kw, 8 global kw, 6 calendar months (4-5 items each)

JSON structure (fill ALL fields with real data for ${domain}):
{
  "domain":"${domain}","overall":0,
  "mods":{
    "seo":{"label":"SEO","score":0,"color":"#ff642d","categories":[
      {"name":"On-Page SEO","sectionNum":"2.1","score":0,"checks":[
        {"n":"Title Tag","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Meta Description","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"H1 Heading","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"H2/H3 Hierarchy","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Keyword in First 100 Words","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Image Alt Attributes","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Canonical Tag","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Internal Linking","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Content Word Count","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Technical SEO","sectionNum":"2.2","score":0,"checks":[
        {"n":"HTTPS / SSL","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"robots.txt","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"XML Sitemap","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Noindex Tags","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Structured Data","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"404 Error Page","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"URL Structure","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Redirect Chains","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Hreflang Tags","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Core Web Vitals","sectionNum":"2.3","score":0,"checks":[
        {"n":"Page Load Speed","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"LCP (Largest Contentful Paint)","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"CLS (Cumulative Layout Shift)","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"INP (Interaction to Next Paint)","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"TTFB (Time to First Byte)","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Image Optimization","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Render-Blocking Resources","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Browser Caching","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Mobile & UX","sectionNum":"2.4","score":0,"intro":"","checks":[
        {"n":"Mobile Responsiveness","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Viewport Meta Tag","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Touch Targets","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Font Size on Mobile","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Backlinks & Off-Page SEO","sectionNum":"2.5","score":0,"intro":"","checks":[
        {"n":"Domain Authority","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Total Backlinks","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Referring Domains","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Toxic Backlinks","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Social Profiles Linked","status":"PASS","finding":"","priority":"LOW","action":""}
      ]},
      {"name":"Local SEO","sectionNum":"2.6","score":0,"checks":[
        {"n":"Google Business Profile","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"NAP Consistency","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Local Citations","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Local Structured Data","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Social Profiles Linked","status":"PASS","finding":"","priority":"LOW","action":""}
      ]}
    ]},
    "aeo":{"label":"AEO","score":0,"color":"#10b981","intro":"","categories":[
      {"name":"Featured Snippet Optimization","sectionNum":"3.1","score":0,"checks":[
        {"n":"Question-Based Headings","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Direct Answer Paragraphs","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Definition Sections","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Ordered Lists for Steps","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Comparison Tables","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"FAQ Section","status":"PASS","finding":"","priority":"HIGH","action":""}
      ]},
      {"name":"Voice Search","sectionNum":"3.2","score":0,"intro":"","checks":[
        {"n":"Conversational Keywords","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Long-Tail Questions","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Local Voice Signals","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Speakable Schema","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Answer Engine Schema","sectionNum":"3.3","score":0,"checks":[
        {"n":"FAQPage Schema","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"HowTo Schema","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"QAPage Schema","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Review/Rating Schema","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Event Schema","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"E-E-A-T Signals","sectionNum":"3.4","score":0,"checks":[
        {"n":"Author Bio & Credentials","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"About Page Quality","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"External Citations","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Trust Badges & Reviews","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Last Updated Date","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"NLP & Semantic SEO","sectionNum":"3.5","score":0,"intro":"","checks":[
        {"n":"Clear Topic Sentences","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Entity Linking","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Semantic Keyword Coverage","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Readability Score","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Topical Depth","status":"PASS","finding":"","priority":"HIGH","action":""}
      ]}
    ]},
    "geo":{"label":"GEO","score":0,"color":"#8b5cf6","intro":"","categories":[
      {"name":"LLM-Ready Content","sectionNum":"4.1","score":0,"intro":"","checks":[
        {"n":"Clear Page Summaries","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Factual Data with Sources","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Unique Research / Data","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"AI Crawler Permissions","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Structured for Extraction","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Brand Citability","sectionNum":"4.2","score":0,"checks":[
        {"n":"Consistent Brand Name","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Wikipedia / Wikidata","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Industry Directories","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"News & Press Mentions","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Niche Term Co-occurrence","status":"PASS","finding":"","priority":"HIGH","action":""}
      ]},
      {"name":"AI Topical Coverage","sectionNum":"4.3","score":0,"checks":[
        {"n":"Pillar + Cluster Content","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Definition Pages","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Comparison Pages","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Use Case Content","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Glossary / Terminology","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"AI Trust & Credibility","sectionNum":"4.4","score":0,"checks":[
        {"n":"HTTPS Security","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Contact & Ownership","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Legal Pages","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Content Freshness","status":"PASS","finding":"","priority":"HIGH","action":""},
        {"n":"Social Proof / Testimonials","status":"PASS","finding":"","priority":"MEDIUM","action":""}
      ]},
      {"name":"Machine-Readable Metadata","sectionNum":"4.5","score":0,"checks":[
        {"n":"Organization Schema","status":"PASS","finding":"","priority":"CRITICAL","action":""},
        {"n":"Open Graph Tags","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Twitter Card Tags","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"BreadcrumbList Schema","status":"PASS","finding":"","priority":"MEDIUM","action":""},
        {"n":"Author/Person Schema","status":"PASS","finding":"","priority":"HIGH","action":""}
      ]}
    ]}
  },
  "competitors":[
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""},
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""},
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""},
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""},
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""},
    {"name":"","domain":"","est":2010,"team":"","hq":"","market":"","pricing":"","clutch":"4.5/5","seo":3,"aeo":2,"geo":2,"strengths":"","weaknesses":"","opp":""}
  ],
  "keywords":{
    "primary":[
      {"kw":"","vol":"","diff":"HIGH","intent":"Commercial","pri":"CRITICAL","page":""},
      {"kw":"","vol":"","diff":"HIGH","intent":"Commercial","pri":"CRITICAL","page":""},
      {"kw":"","vol":"","diff":"HIGH","intent":"Commercial","pri":"CRITICAL","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"HIGH","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Commercial","pri":"HIGH","page":""}
    ],
    "longtail":[
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Informational","pri":"MEDIUM","page":""}
    ],
    "local":[
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"CRITICAL","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"CRITICAL","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Local","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Local","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Local","pri":"MEDIUM","page":""}
    ],
    "global":[
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"MEDIUM","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Commercial","pri":"HIGH","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Commercial","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Commercial","pri":"MEDIUM","page":""},
      {"kw":"","vol":"","diff":"LOW","intent":"Commercial","pri":"MEDIUM","page":""}
    ]
  },
  "calendar":[
    {"month":"Month 1","theme":"","focusText":"","items":[
      {"week":"W1","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W2","dates":"","type":"Service Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W3","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W4","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"}
    ]},
    {"month":"Month 2","theme":"","focusText":"","items":[
      {"week":"W5","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W6","dates":"","type":"Service Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W7","dates":"","type":"Case Study","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W8","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W9","dates":"","type":"FAQ Page","title":"","goal":"","keywords":"","cta":"","owner":"Content"}
    ]},
    {"month":"Month 3","theme":"","focusText":"","items":[
      {"week":"W10","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W11","dates":"","type":"Use Case Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W12","dates":"","type":"Case Study","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W13","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"}
    ]},
    {"month":"Month 4","theme":"","focusText":"","items":[
      {"week":"W14","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W15","dates":"","type":"Use Case Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W16","dates":"","type":"Service Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W17","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W18","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"}
    ]},
    {"month":"Month 5","theme":"","focusText":"","items":[
      {"week":"W19","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W20","dates":"","type":"Case Study","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W21","dates":"","type":"Use Case Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W22","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W23","dates":"","type":"FAQ Page","title":"","goal":"","keywords":"","cta":"","owner":"Content"}
    ]},
    {"month":"Month 6","theme":"","focusText":"","items":[
      {"week":"W24","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W25","dates":"","type":"Definition Page","title":"","goal":"","keywords":"","cta":"","owner":"Content"},
      {"week":"W26","dates":"","type":"Use Case Page","title":"","goal":"","keywords":"","cta":"","owner":"SEO"},
      {"week":"W27","dates":"","type":"Case Study","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W28","dates":"","type":"Social Post","title":"","goal":"","keywords":"","cta":"","owner":"Marketing"},
      {"week":"W29","dates":"","type":"Blog Post","title":"","goal":"","keywords":"","cta":"","owner":"Content"}
    ]}
  ]
}

Fill EVERY empty string "" and 0 with real, specific, accurate data for ${domain}. Make findings and actions highly specific to this exact website and its industry. Return ONLY the completed JSON.`;
}

// ─── JSON REPAIR ──────────────────────────────────────────────────────────────
function repairJSON(str) {
  let result = str;
  result = result.replace(/,\s*$/, "");
  result = result.replace(/:\s*"[^"]*$/, ': ""');
  result = result.replace(/:\s*[^}\],"\s]*$/, ": null");
  const stack = [];
  let inStr = false, esc = false;
  for (let i = 0; i < result.length; i++) {
    const c = result[i];
    if (esc) { esc = false; continue; }
    if (c === "\\" && inStr) { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === "{") stack.push("}");
    else if (c === "[") stack.push("]");
    else if ((c === "}" || c === "]") && stack.length) stack.pop();
  }
  if (inStr) result += '"';
  while (stack.length) result += stack.pop();
  return result;
}

// ─── CALL GEMINI ──────────────────────────────────────────────────────────────
async function callGeminiAPI(domain) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured. Add it to backend/.env");
  }

  const prompt = buildGeminiPrompt(domain);

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 65536,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errMsg = data?.error?.message || JSON.stringify(data?.error || data);
    throw new Error("Gemini API Error " + response.status + ": " + errMsg);
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!rawText) {
    const reason = data?.candidates?.[0]?.finishReason || "UNKNOWN";
    throw new Error("Gemini returned empty response. Finish reason: " + reason);
  }

  let cleaned = rawText.trim()
    .replace(/^```json[\r\n]*/i, "")
    .replace(/^```[\r\n]*/i, "")
    .replace(/[\r\n]*```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // try repair
  }

  try {
    return JSON.parse(repairJSON(cleaned));
  } catch (e2) {
    throw new Error(
      "JSON parse failed after repair. Length=" + cleaned.length + ". Err: " + e2.message
    );
  }
}

// ─── CONTROLLER ───────────────────────────────────────────────────────────────
export async function runAudit(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const User = (await import('../Models/userAuth.Model.js')).default;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(401).json({ error: "User not found" });
    }

    // Plan audit limits
    const planLimits = {
      'Free': 1,
      'Starter': 10,
      'Growth': 50,
      'Pro': Infinity,
    };

    const userPlan = currentUser.plan || 'Free';
    const billingPeriod = currentUser.billingPeriod || 'Monthly';
    const limit = planLimits[userPlan] || 1;
    
    // Calculate reset period duration in milliseconds
    const resetPeriodMs = billingPeriod === 'Yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const lastReset = new Date(currentUser.lastAuditResetDate);
    const timeSinceReset = now - lastReset;
    
    // Reset counter if period has passed
    let auditsUsed = currentUser.auditsUsed || 0;
    if (timeSinceReset > resetPeriodMs) {
      await User.findByIdAndUpdate(userId, { 
        auditsUsed: 0,
        lastAuditResetDate: now
      });
      auditsUsed = 0;
    }

    // Check if user has reached their limit
    if (auditsUsed >= limit) {
      const periodLabel = billingPeriod === 'Yearly' ? 'yearly' : 'monthly';
      return res.status(403).json({
        error: `${billingPeriod} audit limit reached (${auditsUsed}/${limit === Infinity ? '∞' : limit}). Please upgrade your plan or wait for next ${periodLabel} cycle.`,
        used: auditsUsed,
        limit: limit === Infinity ? '∞' : limit,
        plan: userPlan,
        billingPeriod: billingPeriod,
      });
    }

    let { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const domain = url.replace(/https?:\/\//i, "").replace(/\/$/, "");

    if (!domain || domain.length < 3) {
      return res.status(400).json({ error: "Invalid domain provided" });
    }

    const auditData = await callGeminiAPI(domain);

    // Store audit in database
    try {
      const Audit = (await import('../Models/audit.model.js')).default;
      await Audit.create({
        domain,
        overallScore: auditData?.overall || 0,
        status: 'completed',
        reportUrl: '',
        generatedBy: 'gemini',
        runBy: userId,
        data: auditData,
      });

      // Increment audits used for all plans
      await User.findByIdAndUpdate(userId, { 
        $inc: { 
          auditsUsed: 1,
          auditsGenerated: 1 
        } 
      });
    } catch (saveErr) {
      console.error('Audit store error:', saveErr);
    }

    // Get updated user
    const updatedUser = await User.findById(userId);
    const newAuditsUsed = updatedUser?.auditsUsed || 1;

    return res.json({ 
      success: true, 
      data: auditData, 
      domain, 
      plan: userPlan,
      billingPeriod: billingPeriod,
      auditsUsed: newAuditsUsed,
      limit: limit === Infinity ? '∞' : limit,
    });
  } catch (err) {
    console.error("Audit error:", err);
    const response = {
      error: err.message || "Audit failed",
    };
    if (process.env.NODE_ENV !== 'production') {
      response.stack = err.stack;
    }
    return res.status(500).json(response);
  }
}
