<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>ShelfLife: household expiry and go-bag tracker</title>
    <meta
      name="description"
      content="Track expiry dates for groceries, medicine, and emergency go-bag supplies. ShelfLife counts down the days and shows what to use, rotate, or discard first. Data stays in your browser."
   >
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f5f6f6">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#15171a">
    <script>
      // Apply a saved theme before first paint. The control lives in the header.
      try {
        var savedTheme = localStorage.getItem("shelflife_theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          document.documentElement.dataset.theme = savedTheme;
        }
      } catch (e) {}
    </script>
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%232f7d4f'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23f7fbf8'/%3E%3C/svg%3E"
   >
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <a class="skip-link" href="#tracker">Skip to the tracker</a>

    <header class="site-header">
      <div class="container header-row">
        <a href="#top" class="brand">ShelfLife</a>
        <div class="theme-toggle" id="themeToggle" role="group" aria-label="Colour theme">
          <button type="button" data-theme-value="system" aria-pressed="true" onclick="setTheme('system')">System</button>
          <button type="button" data-theme-value="light" aria-pressed="false" onclick="setTheme('light')">Light</button>
          <button type="button" data-theme-value="dark" aria-pressed="false" onclick="setTheme('dark')">Dark</button>
        </div>
        <button
          type="button"
          class="menu-toggle"
          id="menuToggle"
          aria-expanded="false"
          aria-controls="siteMenu"
          onclick="toggleMenu()"
        >
          <span class="menu-bars" aria-hidden="true"></span>
          <span class="visually-hidden">Menu</span>
        </button>
        <div class="site-menu" id="siteMenu">
          <nav class="site-nav" aria-label="Page sections">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#tracker">Live tracker</a></li>
              <li><a href="#history-section">History</a></li>
              <li><a href="#gobag">Go-bag guide</a></li>
              <li><a href="#calculator">₱ Savings</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <div class="header-auth" id="authContainer">
            <button type="button" class="btn btn-secondary btn-sm" onclick="openAuthDialog()">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </header>

    <main id="top">
      <!-- Hero: headline plus a live panel fed by the same data as the tracker -->
      <section class="hero" aria-labelledby="hero-title">
        <div class="container hero-grid">
          <div>
            <h1 id="hero-title">Know what expires next.</h1>
            <p class="hero-lead">
              Track food, medicine, and go-bag supplies. See the days left and
              what to use first.
            </p>
            <div class="hero-actions">
              <a href="#tracker" class="btn btn-primary btn-lg">Open the live tracker</a>
              <a href="#gobag" class="btn btn-secondary btn-lg">Read the go-bag guide</a>
            </div>
          </div>
          <aside class="next-up" aria-labelledby="next-up-title">
            <div class="next-up-head">
              <h2 id="next-up-title">Expiring next</h2>
              <time id="nextUpDate"></time>
            </div>
            <ol class="next-up-list" id="nextUpList" aria-live="polite"></ol>
            <p class="next-up-foot" id="nextUpFoot"></p>
          </aside>
        </div>
      </section>

      <!-- Features: the status scale is the product's core rule -->
      <section class="section" id="features" aria-labelledby="features-title">
        <div class="container">
          <div class="section-head">
            <h2 id="features-title">One date per item, five statuses</h2>
            <p>
              Each item gets a date. ShelfLife counts the days left and sorts the
              soonest first.
            </p>
          </div>

          <ol class="scale" aria-label="Status scale from good to expired">
            <li class="scale-step tier-good"><strong>Good</strong><span>8 or more days left</span></li>
            <li class="scale-step tier-soon"><strong>Soon</strong><span>4 to 7 days left</span></li>
            <li class="scale-step tier-urgent"><strong>Urgent</strong><span>1 to 3 days left</span></li>
            <li class="scale-step tier-critical"><strong>Use today</strong><span>0 days left</span></li>
            <li class="scale-step tier-expired"><strong>Expired</strong><span>past the date</span></li>
          </ol>

          <div class="facts">
            <div>
              <h3>Go-bag rotation</h3>
              <p>
                Tag supplies as Go-bag. Using one logs a rotation, so you know
                when the bag was last refreshed.
              </p>
            </div>
            <div>
              <h3>History you can undo</h3>
              <p>
                Every action is logged. Restore from the history, or undo right
                from the confirmation.
              </p>
            </div>
            <div>
              <h3>Saved on this device</h3>
              <p>
                Items and history stay in this browser. Accounts and sync come
                in a later version.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Live tracker -->
      <section class="section section-tinted" id="tracker" aria-labelledby="tracker-title">
        <div class="container tracker-wrap">
          <div class="section-head">
            <h2 id="tracker-title">Live tracker</h2>
            <p>
              Add, search, and sort your items. Mark them consumed, discard, or
              remove.
            </p>
          </div>

          <div class="panel">
            <div class="panel-head">
              <h3>Active items</h3>
              <span class="panel-note">Saved in this browser</span>
            </div>

            <div class="panel-body">
              <div class="toolbar">
                <div class="field">
                  <label for="searchInput" class="visually-hidden">Search items</label>
                  <input
                    type="search"
                    id="searchInput"
                    placeholder="Search items"
                    autocomplete="off"
                    oninput="renderItems()"
                 >
                </div>
                <div class="field">
                  <label for="sortSelect" class="visually-hidden">Sort items</label>
                  <select id="sortSelect" onchange="renderItems()">
                    <option value="urgency">Sort: soonest first</option>
                    <option value="name">Sort: name A to Z</option>
                    <option value="category">Sort: category</option>
                  </select>
                </div>
              </div>

              <div class="chips" role="group" aria-label="Filter by category">
                <button type="button" class="chip" aria-pressed="true" onclick="setCategoryFilter('all', this)">All items</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('critical', this)">Needs attention</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('gobag', this)">Go-bag</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('fridge', this)">Fridge</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('pantry', this)">Pantry</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('medicine', this)">Medicine</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setCategoryFilter('cosmetics', this)">Cosmetics</button>
              </div>

              <button
                type="button"
                class="btn btn-secondary"
                id="addToggle"
                aria-expanded="false"
                aria-controls="addItemForm"
                onclick="toggleAddForm()"
              >
                Add an item
              </button>

              <form id="addItemForm" class="add-form" hidden onsubmit="handleAddItem(event)">
                <div class="field field-name">
                  <label for="itemNameInput">Item name</label>
                  <input type="text" id="itemNameInput" placeholder="Canned tuna" maxlength="80" required>
                </div>
                <div class="field">
                  <label for="itemCategorySelect">Category</label>
                  <select id="itemCategorySelect">
                    <option value="fridge">Fridge</option>
                    <option value="pantry">Pantry</option>
                    <option value="medicine">Medicine</option>
                    <option value="cosmetics">Cosmetics</option>
                    <option value="gobag">Go-bag</option>
                  </select>
                </div>
                <div class="field">
                  <label for="itemDateInput">Expiry or rotation date</label>
                  <input type="date" id="itemDateInput" required>
                </div>
                <button type="submit" class="btn btn-primary">Save item</button>
              </form>

              <ul class="rows" id="itemsContainer" aria-live="polite"></ul>
            </div>

            <div class="panel-foot">
              <span id="itemsSummaryCount">0 items</span>
              <div class="panel-foot-actions">
                <button type="button" class="btn btn-quiet btn-sm" onclick="clearExpired()">Discard all expired</button>
                <button type="button" class="btn btn-quiet btn-sm" onclick="seedSampleData()">Reset demo data</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- History -->
      <section class="section" id="history-section" aria-labelledby="history-title">
        <div class="container tracker-wrap">
          <div class="section-head">
            <h2 id="history-title">History</h2>
            <p>
              Everything consumed, rotated, discarded, or removed. Restore any
              entry.
            </p>
          </div>

          <div class="panel panel-flat">
            <div class="panel-head">
              <h3>Log</h3>
              <div class="panel-head-actions">
                <span class="panel-note" id="historyCountBadge">0 records</span>
                <button type="button" class="btn btn-quiet btn-sm" onclick="clearHistory()">Clear history</button>
              </div>
            </div>
            <div class="panel-body">
              <div class="chips" role="group" aria-label="Filter history">
                <button type="button" class="chip" aria-pressed="true" onclick="setHistoryFilter('all', this)">All</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setHistoryFilter('Consumed', this)">Consumed and rotated</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setHistoryFilter('Discarded', this)">Discarded</button>
                <button type="button" class="chip" aria-pressed="false" onclick="setHistoryFilter('Removed', this)">Removed</button>
              </div>
              <ul class="rows" id="historyContainer" aria-live="polite"></ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Go-bag checklist -->
      <section class="section section-tinted" id="gobag" aria-labelledby="gobag-title">
        <div class="container gobag-grid">
          <div class="gobag-intro">
            <div class="section-head">
              <h2 id="gobag-title">72-hour go-bag checklist</h2>
              <p>
                In a fire, flood, or earthquake you have minutes to leave. Keep
                these packed and rotate them every six months.
              </p>
            </div>
            <p>
              Add them to the tracker under Go-bag with a rotation date.
            </p>
          </div>

          <div class="kit">
            <div class="kit-group">
              <h3>Food and water</h3>
              <ul>
                <li>4 to 5 liters of drinking water per person</li>
                <li>Ready-to-eat canned goods: tuna, corned beef, beans</li>
                <li>High-calorie energy bars, crackers, and biscuits</li>
                <li>Manual can opener and durable utensils</li>
              </ul>
            </div>
            <div class="kit-group">
              <h3>Medical and sanitation</h3>
              <ul>
                <li>Prescription medicines, a 7-day supply</li>
                <li>First-aid kit: gauze, antiseptic, burn ointment</li>
                <li>Water purification tablets or drops</li>
                <li>N95 masks for smoke and debris</li>
              </ul>
            </div>
            <div class="kit-group">
              <h3>Light, signal, and documents</h3>
              <ul>
                <li>LED flashlight and spare batteries</li>
                <li>Whistle to signal rescuers</li>
                <li>Waterproof pouch with IDs, deeds, and cash</li>
                <li>Power bank, cable, and hand-crank radio</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Savings estimate -->
      <section class="section" id="calculator" aria-labelledby="calc-title">
        <div class="container calc">
          <div class="section-head">
            <h2 id="calc-title">Household savings estimate</h2>
            <p>
              A rough estimate of what a household saves by using food before it
              expires.
            </p>
          </div>

          <div class="calc-controls">
            <div class="calc-row">
              <div class="calc-row-head">
                <label for="familySizeSlider">Household size</label>
                <output id="familySizeLabel" for="familySizeSlider">3 people</output>
              </div>
              <input type="range" id="familySizeSlider" min="1" max="8" value="3" oninput="updateCalculator()">
            </div>
            <div class="calc-row">
              <div class="calc-row-head">
                <label for="spendSlider">Weekly grocery spend</label>
                <output id="spendLabel" for="spendSlider">₱4,500</output>
              </div>
              <input type="range" id="spendSlider" min="1000" max="25000" step="250" value="4500" oninput="updateCalculator()">
            </div>
          </div>

          <div class="calc-results">
            <div>
              <div class="figure-n" id="annualSavingsVal">₱42,120</div>
              <div class="figure-l">saved per year</div>
            </div>
            <div>
              <div class="figure-n" id="wasteDivertedVal">144 kg</div>
              <div class="figure-l">food waste avoided per year</div>
            </div>
            <p class="calc-note">
              Assumes 18% of grocery spend is lost to expired food and 48 kg of
              avoidable waste per person per year. Illustrative only.
            </p>
          </div>
        </div>
      </section>

      <!-- Questions -->
      <section class="section" id="faq" aria-labelledby="faq-title">
        <div class="container">
          <div class="section-head">
            <h2 id="faq-title">Common questions</h2>
          </div>
          <div class="faq-list">
            <div class="faq-item">
              <h3>How does the history work?</h3>
              <p>
                Consumed, discarded, and removed items move to the history with
                the action and time. Filter the log or restore any entry.
              </p>
            </div>
            <div class="faq-item">
              <h3>How often should I rotate the go-bag?</h3>
              <p>
                Every six months for food, water treatment, and medicine. Give
                each item a rotation date and the countdown reminds you.
              </p>
            </div>
            <div class="faq-item">
              <h3>Do my items survive a refresh or a closed tab?</h3>
              <p>
                Yes. They are stored in this browser. Clearing site data removes
                them, and they do not sync to other devices yet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-row">
          <div class="footer-brand">
            <a href="#top" class="brand">ShelfLife</a>
            <p>
              Expiry tracking for the kitchen and the go-bag. Data stays in this
              browser.
            </p>
          </div>
          <nav class="footer-nav" aria-label="Footer">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#tracker">Live tracker</a></li>
              <li><a href="#history-section">History</a></li>
              <li><a href="#gobag">Go-bag guide</a></li>
              <li><a href="#calculator">₱ Savings</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
        </div>
        <div class="footer-meta">
          <span>© 2026 ShelfLife</span>
          <span>Amounts shown in Philippine pesos (₱)</span>
        </div>
      </div>
    </footer>

    <!-- Demo sign-in: no server yet, the email is kept in this browser only -->
    <dialog id="authDialog" class="dialog" aria-labelledby="auth-title">
      <div class="dialog-head">
        <h2 id="auth-title">Sign in (demo)</h2>
        <button type="button" class="icon-btn" aria-label="Close" onclick="closeAuthDialog()">✕</button>
      </div>
      <form class="dialog-body" onsubmit="handleAuthSubmit(event)">
        <p>
          No account server yet. Your email stays in this browser to preview
          the signed-in view.
        </p>
        <div class="field">
          <label for="authEmailInput">Email</label>
          <input type="email" id="authEmailInput" placeholder="name@example.com" autocomplete="email" required>
        </div>
        <button type="submit" class="btn btn-primary">Continue</button>
      </form>
    </dialog>

    <div class="toast-region" id="toastContainer" aria-live="polite"></div>

    <script src="js/index.js"></script>
  </body>
</html>
