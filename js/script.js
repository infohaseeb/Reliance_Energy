// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
}

// Advanced Scroll Effect for Floating Navbar
window.addEventListener('scroll', function () {
    const topbar = document.getElementById('topbar');
    const navWrapper = document.getElementById('nav-wrapper');
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 20) {
        // Hide Topbar
        if (topbar) {
            topbar.style.height = '0px';
            topbar.style.opacity = '0';
        }

        // Make Navbar Sticky to Top Edge
        if (navWrapper && navbar) {
            navWrapper.classList.remove('lg:px-6', 'lg:pt-5');
            navbar.classList.remove('lg:rounded-2xl', 'max-w-7xl', 'border-white/60');
            navbar.classList.add('w-full', 'bg-white/95', 'shadow-md', 'border-gray-200');
        }
    } else {
        // Show Topbar
        if (topbar) {
            topbar.style.height = '40px';
            topbar.style.opacity = '1';
        }

        // Revert Navbar to Floating Glass Pill
        if (navWrapper && navbar) {
            navWrapper.classList.add('lg:px-6', 'lg:pt-5');
            navbar.classList.add('lg:rounded-2xl', 'max-w-7xl', 'border-white/60');
            navbar.classList.remove('w-full', 'bg-white/95', 'shadow-md', 'border-gray-200');
        }
    }
});

// Smart Solar Calculator Logic
document.getElementById('solarSmartForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const currentLoad = parseFloat(document.getElementById('currentLoad').value);
    const futureLoad = parseFloat(document.getElementById('futureLoad').value);
    const desiredKW = parseFloat(document.getElementById('desiredKW').value);
    const pricePerWatt = parseFloat(document.getElementById('pricePerWatt').value);
    const panelWattage = parseFloat(document.getElementById('panelSelect').value);

    if (
        isNaN(currentLoad) ||
        isNaN(futureLoad) ||
        isNaN(desiredKW) ||
        isNaN(pricePerWatt) ||
        isNaN(panelWattage)
    ) {
        alert('Please enter all valid numbers.');
        return;
    }

    const recommendedLoad = Math.max(futureLoad, desiredKW);
    const recommendedWatts = recommendedLoad * 1000;
    const recommendedPanels = Math.ceil(recommendedWatts / panelWattage);
    const recommendedCost = recommendedWatts * pricePerWatt;
    const recommendedInverter = Math.ceil(recommendedLoad * 1.25);

    const desiredWatts = desiredKW * 1000;
    const desiredPanels = Math.ceil(desiredWatts / panelWattage);
    const desiredCost = desiredWatts * pricePerWatt;
    const powerFactor = 0.8;
    const desiredKVA = Math.ceil(desiredKW / powerFactor);

    const difference = recommendedLoad - desiredKW;

    let note = '';
    if (difference >= 1) {
        note = `<br><span class="text-brand-green mt-4 block"><strong>Note:</strong> Recommended system is ${difference} kW higher than your desired. You can start with ${desiredKW} kW now and upgrade later.</span>`;
    }

    const result = `
      <div class="space-y-6">
          <div class="pb-6 border-b border-gray-200">
              <h4 class="text-xl font-bold text-gray-900 mb-4">Your Inputs</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                  <p class="text-gray-600">Future Load: <strong class="text-gray-900">${futureLoad} kVA</strong></p>
                  <p class="text-gray-600">Desired Size: <strong class="text-gray-900">${desiredKW} kW</strong></p>
              </div>
          </div>

          <div class="pb-6 border-b border-gray-200">
              <h4 class="text-xl font-bold text-brand-blue mb-4">Recommended System (for future load)</h4>
              <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                  <p class="text-gray-600">Solar Size: <strong class="text-gray-900 text-base">${recommendedLoad} kW</strong></p>
                  <p class="text-gray-600">Inverter Size: <strong class="text-gray-900 text-base">${recommendedInverter} kVA</strong></p>
                  <p class="text-gray-600">Panels: <strong class="text-gray-900 text-base">${recommendedPanels} (${panelWattage}W)</strong></p>
                  <p class="text-gray-600">Estimated Cost: <strong class="text-brand-green text-lg">PKR ${recommendedCost.toLocaleString()}</strong></p>
              </div>
              ${note}
          </div>

          <div>
              <h4 class="text-xl font-bold text-brand-green mb-4">Budget Option (your plan now)</h4>
              <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                  <p class="text-gray-600">Desired System: <strong class="text-gray-900 text-base">${desiredKW} kW (${desiredKVA} kVA)</strong></p>
                  <p class="text-gray-600">Panels: <strong class="text-gray-900 text-base">${desiredPanels} (${panelWattage}W)</strong></p>
                  <p class="text-gray-600">Estimated Cost: <strong class="text-brand-green text-lg">PKR ${desiredCost.toLocaleString()}</strong></p>
              </div>
          </div>
      </div>
    `;

    const resultBox = document.getElementById('solarResult');
    resultBox.innerHTML = result;
    resultBox.classList.remove('hidden');

    // ✅ CLEAR FORM FIELDS
    // document.getElementById('solarSmartForm').reset(); // Commented out to allow user to tweak numbers
});

document.getElementById('solarSmartForm')?.addEventListener('reset', function () {
    const resultBox = document.getElementById('solarResult');
    if (resultBox) {
        resultBox.innerHTML = '';
        resultBox.classList.add('hidden');
    }
});

// Update Ticker Date
const tickerDateEl1 = document.getElementById('currentDateTicker');
if (tickerDateEl1) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    tickerDateEl1.textContent = `(${today})`;
}

// Live PV Panel Price Rendering (from js/prices.js workaround)
document.addEventListener('DOMContentLoaded', function () {
    const gridEl = document.getElementById('priceTickerGrid');
    if (!gridEl) return;

    try {
        if (typeof csvData === 'undefined') {
            throw new Error("CSV Data not found! Ensure js/prices.js is loaded.");
        }

        // Parse the raw CSV string loaded from prices.js
        const lines = csvData.trim().split('\n');
        if (lines.length < 2) throw new Error("CSV seems empty or missing data.");

        let gridHTML = '';
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');

            const brand = values[0] || '';
            const wattage = values[1] || '';
            const price = values[2] || '';
            const trend = (values[3] || '').trim().toLowerCase();

            let trendIcon = '';
            if (trend === 'up') {
                trendIcon = '<i class="fa-solid fa-arrow-up text-brand-green mb-1.5 ml-auto"></i>';
            } else if (trend === 'down') {
                trendIcon = '<i class="fa-solid fa-arrow-down text-red-500 mb-1.5 ml-auto"></i>';
            } else {
                trendIcon = '<i class="fa-solid fa-minus text-gray-400 mb-1.5 ml-auto"></i>';
            }

            gridHTML += `
            <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">${brand} <span class="text-gray-900 font-bold ml-1">(${wattage})</span></p>
                <div class="flex items-end gap-2">
                    <span class="text-2xl font-black text-brand-blue">${price}</span>
                    <span class="text-gray-500 text-sm mb-1">PKR/W</span>
                    ${trendIcon}
                </div>
            </div>
            `;
        }

        gridEl.innerHTML = gridHTML;
    } catch (err) {
        console.error("Price Ticker Error:", err);
        gridEl.innerHTML = '<p class="text-xs text-red-500 col-span-2 lg:col-span-4 text-center py-4">Live prices currently unavailable. Please check js/prices.js</p>';
    }
});
