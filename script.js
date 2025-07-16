// script.js
document.addEventListener("DOMContentLoaded", () => {

    // === Global Free/Premium Mode Switch Logic ===
    const modeSwitch = document.getElementById('mode-switch-checkbox');
    const currentMode = localStorage.getItem('stokifyMode') || 'free';

    function setMode(mode) {
        if (mode === 'premium') {
            document.body.classList.add('premium-mode');
            if (modeSwitch) modeSwitch.checked = true;
        } else {
            document.body.classList.remove('premium-mode');
            if (modeSwitch) modeSwitch.checked = false;
        }
        localStorage.setItem('stokifyMode', mode);
    }

    if (modeSwitch) {
        modeSwitch.addEventListener('change', (e) => {
            setMode(e.target.checked ? 'premium' : 'free');
        });
    }
    // Set initial mode on page load
    setMode(currentMode);

    // === Page Specific Logic ===

    // --- Onboarding Page Logic ---
    const onboardingPage = document.getElementById('onboarding-page');
    if (onboardingPage) {
        const slider = document.querySelector('.onboarding-slider');
        const slides = document.querySelectorAll('.slide');
        const nextBtn = document.getElementById('next-slide-btn');
        let currentSlide = 0;

        nextBtn.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide < slides.length) {
                slider.style.transform = `translateX(-${currentSlide * 100}%)`;
                if (currentSlide === slides.length - 1) {
                    nextBtn.innerText = "Mulai Sekarang";
                }
            } else {
                navigateTo('register.html');
            }
        });
    }

    // --- Setup Wizard Page Logic ---
    const wizardPage = document.getElementById('setup-wizard-page');
    if (wizardPage) {
        const steps = document.querySelectorAll('.wizard-step');
        const dots = document.querySelectorAll('.dot');
        const nextBtn = document.getElementById('wizard-next-btn');
        let currentStep = 0;

        function showStep(stepIndex) {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
                dots[index].classList.toggle('active', index === stepIndex);
            });
            if (stepIndex === steps.length - 1) {
                nextBtn.innerText = "Selesai & Masuk Dashboard";
            } else {
                nextBtn.innerText = "Lanjutkan";
            }
        }

        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            } else {
                navigateTo('dashboard.html');
            }
        });

        showStep(0);
    }

    // --- Dashboard Page Logic (Filtering) ---
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('filter-kategori');
        const branchFilter = document.getElementById('filter-cabang');
        const productList = document.querySelectorAll('#product-list .product-item');

        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            const isPremium = document.body.classList.contains('premium-mode');

            const selectedBranch = isPremium && branchFilter ? branchFilter.value : 'all';

            productList.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productCategory = product.dataset.category;
                const productBranch = product.dataset.branch;

                const nameMatch = productName.includes(searchTerm);
                const categoryMatch = (selectedCategory === 'all') || (selectedCategory === productCategory);
                const branchMatch = !isPremium || (selectedBranch === 'all') || (selectedBranch === productBranch);

                if (nameMatch && categoryMatch && branchMatch) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);

        if (branchFilter) {
            branchFilter.addEventListener('change', applyFilters);
        }

        // Re-apply filters when mode changes
        if (modeSwitch) {
            modeSwitch.addEventListener('change', applyFilters);
        }
    }

    // --- Reports Page Logic ---
    const reportsPage = document.getElementById('reports-page');
    if (reportsPage) {
        // Fungsi untuk merender/menganimasikan grafik
        function renderChart() {
            const bars = document.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                const value = bar.dataset.value;
                // Reset animasi dengan menghapus dan menambahkan kembali
                bar.style.animation = 'none';
                bar.offsetHeight; // trik untuk trigger reflow
                bar.style.animation = null;

                // Atur nilai dan delay animasi
                bar.style.setProperty('--value', value);
                bar.style.animationDelay = index * 0.1 + 's';
            });
        }
        // Render grafik saat halaman pertama kali dimuat
        renderChart();
    }

    // --- Add Product Page Logic (BARU) ---
    const addProductPage = document.getElementById('add-product-page');
    if (addProductPage) {
        const unitSelect = document.getElementById('product-unit');
        const customUnitGroup = document.getElementById('custom-unit-group');

        unitSelect.addEventListener('change', () => {
            if (unitSelect.value === 'other') {
                customUnitGroup.style.display = 'block';
            } else {
                customUnitGroup.style.display = 'none';
            }
        });
    }

});

// Global navigation function
function navigateTo(page) {
    window.location.href = page;
}