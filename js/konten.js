document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------
       ARTICLE DATA & FILTER
       ----------------------------------------------------- */
  const articles = [
    {
      id: 1,
      title: "Why Urban Areas Suffer from Severe Air Pollution",
      category: "Air Pollution",
      author: "Rizky P",
      date: "Feb 15, 2026",
      thumbColor: "#E8F5E9",
      wikiTopic: "Air_pollution",
      imgUrl:
        "https://images.unsplash.com/photo-1698128827557-0b05ccb18fbf?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "How Solar Power Works & The Future of Renewable Energy",
      category: "Climate Change",
      author: "Sarah A",
      date: "Feb 14, 2026",
      thumbColor: "#FFF3E0",
      wikiTopic: "Solar_power",
      imgUrl:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      title: "Mangrove Forests: Coastal Shields Against Rising Seas",
      category: "Conservation",
      author: "Budi T",
      date: "Feb 12, 2026",
      thumbColor: "#E1F5FE",
      wikiTopic: "Mangrove",
      imgUrl:
        "https://images.unsplash.com/photo-1589556183130-530470785fab?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 4,
      title: "The Threat of Microplastics in Our Food Chain",
      category: "Ocean Pollution",
      author: "Dina M",
      date: "Feb 10, 2026",
      thumbColor: "#FBE9E7",
      wikiTopic: "Microplastics",
      imgUrl:
        "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 5,
      title: "Home Composting Guide: Turning Organic Waste into Soil",
      category: "Waste Management",
      author: "Eco Team",
      date: "Feb 09, 2026",
      thumbColor: "#F3E5F5",
      wikiTopic: "Compost",
      imgUrl:
        "https://images.unsplash.com/photo-1644575881028-9f170fd241ed?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 6,
      title: "Understanding El Niño and La Niña Climate Cycles",
      category: "Climate Change",
      author: "Climate Monitor",
      date: "Feb 08, 2026",
      thumbColor: "#FFF3E0",
      wikiTopic: "El_Niño",
      imgUrl:
        "https://images.unsplash.com/photo-1549885606-bbc17accf949?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 7,
      title: "5 Air-Purifying Indoor Plants for Healthier Living",
      category: "Air Pollution",
      author: "Green Living",
      date: "Feb 05, 2026",
      thumbColor: "#E8F5E9",
      wikiTopic: "Houseplant",
      imgUrl:
        "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 8,
      title: "A Deep Dive into Carbon Offsetting and Trading",
      category: "Climate Change",
      author: "Eco Hub",
      date: "Feb 03, 2026",
      thumbColor: "#FFF3E0",
      wikiTopic: "Emissions_trading",
      imgUrl:
        "https://images.unsplash.com/photo-1598335624134-5bceb5de202d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 9,
      title: "Why Marine Turtles Ingest Ocean Plastic Debris",
      category: "Ocean Pollution",
      author: "Marine Bio",
      date: "Feb 01, 2026",
      thumbColor: "#E1F5FE",
      wikiTopic: "Sea_turtle",
      imgUrl:
        "https://images.unsplash.com/photo-1549557143-90d216195a97?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 10,
      title: "Zero Waste Living: How to Start and Sustain It",
      category: "Waste Management",
      author: "Siska W",
      date: "Jan 28, 2026",
      thumbColor: "#F3E5F5",
      wikiTopic: "Zero_waste",
      imgUrl:
        "https://images.unsplash.com/photo-1645739467767-ee1ea618d36c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 11,
      title: "Rainforest Habitat Conservation for Endangered Wildlife",
      category: "Conservation",
      author: "WWF Partner",
      date: "Jan 25, 2026",
      thumbColor: "#E1F5FE",
      wikiTopic: "Orangutan",
      imgUrl:
        "https://images.unsplash.com/photo-1699709823274-f3cb659b640b?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 12,
      title: "The Environmental Toll of Global Fast Fashion",
      category: "Waste Management",
      author: "Fashion Rev",
      date: "Jan 20, 2026",
      thumbColor: "#F3E5F5",
      wikiTopic: "Fast_fashion",
      imgUrl:
        "https://images.unsplash.com/photo-1495556650867-99590cea3657?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const grid = document.getElementById("articles-grid");
  const noResults = document.getElementById("no-results");
  const searchInput = document.getElementById("search-input");
  const filterPills = document.querySelectorAll(".filter-pill");

  let activeCategory = "All";
  let searchQuery = "";

  function renderArticles() {
    if (!grid) return;

    // Filter logic
    const filtered = articles.filter((art) => {
      const matchCat =
        activeCategory === "All" || art.category === activeCategory;
      const matchSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.classList.add("hidden");
      noResults.classList.remove("hidden");
    } else {
      grid.classList.remove("hidden");
      noResults.classList.add("hidden");

      grid.innerHTML = filtered
        .map(
          (art) => `
                <a href="artikel.html?q=${art.wikiTopic || "Environmental_protection"}&title=${encodeURIComponent(art.title)}&img=${encodeURIComponent(art.imgUrl)}" class="article-item fade-up" style="text-decoration: none; color: inherit;">
                    <div class="article-thumb" style="height: 180px; background-image: url('${art.imgUrl}'); background-size: cover; background-position: center;"></div>
                    <div class="article-body">
                        <span class="article-cat">${art.category}</span>
                        <h3>${art.title}</h3>
                        <p class="article-excerpt">Click to explore the full article on ${art.title} verified by academic encyclopedia references.</p>
                        <div class="article-footer">
                            <span>${art.author} • ${art.date}</span>
                            <button class="bookmark-btn" aria-label="Bookmark article"><i class="fas fa-bookmark" size="16"></i></button>
                        </div>
                    </div>
                </a>
            `,
        )
        .join("");

      setTimeout(() => {
        document.querySelectorAll(".article-item").forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), i * 50);
        });
      }, 50);
    }
  }

  // Event Listeners for Filters
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.getAttribute("data-category");
      renderArticles();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderArticles();
    });
  }

  // Initial Render
  renderArticles();

  /* -----------------------------------------------------
       ECOFACT WIDGET
       ----------------------------------------------------- */
  const facts = [
    "Every year, approximately 8 million metric tons of plastic end up in our oceans.",
    "A single mature leafy tree can absorb up to 22 kg (48 lbs) of carbon dioxide annually.",
    "Recycling one aluminum can saves enough electricity to power a television for 3 hours.",
    "The Amazon Basin generates about 20% of the Earth's continental river discharge into oceans.",
  ];

  const factText = document.getElementById("ecofact-text");
  const shareFactBtn = document.getElementById("share-fact");

  if (factText) {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    factText.innerText = `"${randomFact}"`;

    shareFactBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(randomFact).then(() => {
        const originalText = shareFactBtn.innerHTML;
        shareFactBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          shareFactBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  /* -----------------------------------------------------
       QUIZ WIDGET
       ----------------------------------------------------- */
  const quizData = [
    {
      q: "How long does it typically take for a plastic bottle to decompose in nature?",
      opts: ["10 years", "100 years", "450 years", "1,000 years"],
      a: 2,
      expl: "Conventional plastic takes ~450 years to break down. Choose reusable alternatives!",
    },
    {
      q: "Which greenhouse gas is emitted in the greatest quantity by human activities?",
      opts: ["Methane", "Carbon Dioxide", "Ozone", "Nitrous Oxide"],
      a: 1,
      expl: "Carbon Dioxide (CO2) accounts for roughly 75% of global human greenhouse emissions.",
    },
    {
      q: "Which of the following is NOT a renewable energy source?",
      opts: ["Wind Power", "Solar Energy", "Coal Power", "Hydroelectric"],
      a: 2,
      expl: "Coal is a finite fossil fuel that releases high carbon dioxide and toxic pollutants.",
    },
    {
      q: "What is the process of decomposing organic matter into nutrient-rich soil called?",
      opts: ["Upcycling", "Incineration", "Composting", "Bio-remediation"],
      a: 2,
      expl: "Composting turns food scraps into natural fertilizer, slashing landfill methane.",
    },
    {
      q: "On what date is World Environment Day celebrated globally each year?",
      opts: ["April 22", "June 5", "October 10", "December 1"],
      a: 1,
      expl: "June 5 has been recognized as World Environment Day by the UN since 1974.",
    },
  ];

  let currentQ = 0;
  let score = 0;

  const quizContainer = document.getElementById("quiz-container");
  const startStep = document.getElementById("quiz-start");
  const qStep = document.getElementById("quiz-question");
  const rStep = document.getElementById("quiz-result");

  const qText = document.getElementById("question-text");
  const optsContainer = document.getElementById("options-container");
  const feedbackArea = document.getElementById("feedback-area");
  const feedbackText = document.getElementById("feedback-text");
  const slideBtn = document.getElementById("next-q-btn");
  const progressBar = document.getElementById("quiz-progress");

  const startBtn = document.getElementById("start-quiz-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startStep.classList.remove("active");
      qStep.classList.add("active");
      loadQuestion();
    });
  }

  function loadQuestion() {
    const data = quizData[currentQ];
    qText.innerText = `${currentQ + 1}. ${data.q}`;

    const prog = (currentQ / quizData.length) * 100;
    progressBar.style.width = `${prog}%`;

    optsContainer.innerHTML = "";
    feedbackArea.classList.add("hidden");

    data.opts.forEach((opt, idx) => {
      const btn = document.createElement("div");
      btn.className = "quiz-option";
      btn.innerText = opt;
      btn.addEventListener("click", () => handleAnswer(idx, btn));
      optsContainer.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex, btnElement) {
    const allOpts = optsContainer.querySelectorAll(".quiz-option");
    allOpts.forEach((b) => (b.style.pointerEvents = "none"));

    const data = quizData[currentQ];
    const isCorrect = selectedIndex === data.a;

    if (isCorrect) {
      btnElement.classList.add("correct");
      score++;
      feedbackText.innerText = "Correct! " + data.expl;
      feedbackText.style.color = "var(--color-green-primary)";
    } else {
      btnElement.classList.add("wrong");
      allOpts[data.a].classList.add("correct");
      feedbackText.innerText = "Incorrect. " + data.expl;
      feedbackText.style.color = "var(--color-red-alert)";
    }

    feedbackArea.classList.remove("hidden");

    slideBtn.onclick = () => {
      currentQ++;
      if (currentQ < quizData.length) {
        loadQuestion();
      } else {
        showResult();
      }
    };
  }

  function showResult() {
    qStep.classList.remove("active");
    rStep.classList.add("active");

    document.getElementById("score-val").innerText = score;
    const msg = document.getElementById("score-msg");
    const title = document.getElementById("score-title");

    if (score === 5) {
      title.innerText = "Earth Hero! 🌍";
      msg.innerText = "Perfect score! Your environmental knowledge is extraordinary.";
    } else if (score >= 3) {
      title.innerText = "Green Guardian! 🌿";
      msg.innerText = "Great job! You have solid sustainability and eco awareness.";
    } else {
      title.innerText = "Eco Explorer! 🌱";
      msg.innerText = "Keep exploring and learning to make a positive impact for our planet!";
    }
  }

  const restartBtn = document.getElementById("restart-quiz-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      currentQ = 0;
      score = 0;
      rStep.classList.remove("active");
      qStep.classList.add("active");
      loadQuestion();
    });
  }
});
