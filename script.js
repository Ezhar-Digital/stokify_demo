/**
 * Stokify Lo-Fi Prototype Script
 *
 * This single script handles all interactivity for the prototype, including:
 * 1. Onboarding slider navigation.
 * 2. Premium vs. Free user mode simulation.
 * 3. Combined filtering for categories and branches on the dashboard.
 * 4. Modal pop-ups for stock transactions.
 * 5. Modal pop-up for adding new categories.
 *
 * It uses null-checks (if-statements) to ensure that code only runs on the
 * pages where the relevant HTML elements exist, preventing errors.
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Onboarding Slider Logic ---
    // This code only runs if it finds the slider elements (on onboarding.html)
    const sliderWrapper = document.querySelector(".slider-wrapper");
    if (sliderWrapper) {
        const slides = document.querySelector(".slides");
        const dots = document.querySelectorAll(".dot");
        const nextBtn = document.getElementById("nextBtn");
        let currentSlide = 0;
        const totalSlides = dots.length;

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            slides.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach(dot => dot.classList.remove("active"));
            dots[currentSlide].classList.add("active");

            // Change button text on the last slide
            if (currentSlide === totalSlides - 1) {
                nextBtn.textContent = "Mulai Sekarang";
            } else {
                nextBtn.textContent = "Selanjutnya";
            }
        }

        // Event for the main button
        nextBtn.addEventListener("click", () => {
            if (currentSlide === totalSlides - 1) {
                window.location.href = "register.html";
            } else {
                goToSlide(currentSlide + 1);
            }
        });

        // Event for the navigation dots
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => goToSlide(index));
        });

        // Initialize slider to the first slide
        goToSlide(0);
    }


    // --- 2. User Mode Simulation (Premium/Free Toggle) ---
    // This logic runs on every page that has the simulation bar.
    const userModeToggle = document.getElementById("userModeToggle");

    // Function to apply the UI changes based on the stored mode
    function applyUserMode() {
        const isPremium = localStorage.getItem("stokifyUserMode") === "premium";

        if (userModeToggle) {
            userModeToggle.checked = isPremium;
        }

        document.querySelectorAll(".premium-only").forEach(el => {
            el.style.display = isPremium ? "block" : "none";
        });
        document.querySelectorAll(".free-only").forEach(el => {
            el.style.display = isPremium ? "none" : "block";
        });
    }

    // Add event listener to the toggle switch if it exists on the page
    if (userModeToggle) {
        userModeToggle.addEventListener("change", () => {
            if (userModeToggle.checked) {
                localStorage.setItem("stokifyUserMode", "premium");
                alert("Simulasi diubah ke Pengguna Premium. Fitur canggih kini aktif.");
            } else {
                localStorage.setItem("stokifyUserMode", "free");
                alert("Simulasi diubah ke Pengguna Free. Fitur dibatasi.");
            }
            // Reload the page to apply changes everywhere consistently
            window.location.reload();
        });
    }

    // Always apply the user mode on every page load
    applyUserMode();


    // --- 3. Combined Filter Logic (on dashboard.html) ---
    // This code only runs if it finds both filter dropdowns.
    const categoryFilter = document.getElementById("categoryFilter");
    const branchFilter = document.getElementById("branchFilter");

    if (categoryFilter && branchFilter) {
        const productItems = document.querySelectorAll(".item-list > a");
        const noResultsMessage = document.getElementById("no-results-message");

        function applyFilters() {
            const selectedCategory = categoryFilter.value;
            const selectedBranch = branchFilter.value;
            let visibleCount = 0;

            productItems.forEach(product => {
                const productCategory = product.dataset.category;
                const productBranches = product.dataset.branches;

                // Check if the product matches BOTH filters
                const categoryMatch = (selectedCategory === "all" || productCategory === selectedCategory);
                const branchMatch = (selectedBranch === "all" || productBranches.includes(selectedBranch));

                if (categoryMatch && branchMatch) {
                    product.style.display = "block";
                    visibleCount++;
                } else {
                    product.style.display = "none";
                }
            });

            // Show or hide the "no results" message
            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
            }
        }

        // Add event listeners to both filters
        categoryFilter.addEventListener("change", applyFilters);
        branchFilter.addEventListener("change", applyFilters);
    }


    // --- 4. Transaction Modal Logic (on product-detail.html) ---
    // This code runs only if it finds the transaction modal overlay.
    const transactionModalOverlay = document.getElementById("transactionModalOverlay");
    if (transactionModalOverlay) {
        const openModalInBtn = document.getElementById("openTransactionModal");
        const openModalOutBtn = document.getElementById("openTransactionModalOut");
        const closeModalBtn = document.getElementById("closeTransactionModal");
        const saveTransactionBtn = document.getElementById("saveTransaction");
        const modalTitle = transactionModalOverlay.querySelector('h2');

        if (openModalInBtn) {
            openModalInBtn.addEventListener("click", () => {
                if (modalTitle) modalTitle.textContent = "Catat Barang Masuk";
                transactionModalOverlay.style.display = "flex";
            });
        }

        if (openModalOutBtn) {
            openModalOutBtn.addEventListener("click", () => {
                if (modalTitle) modalTitle.textContent = "Catat Barang Keluar";
                transactionModalOverlay.style.display = "flex";
            });
        }

        if (closeModalBtn) closeModalBtn.addEventListener("click", () => transactionModalOverlay.style.display = "none");

        if (saveTransactionBtn) {
            saveTransactionBtn.addEventListener("click", () => {
                alert("Transaksi berhasil dicatat!");
                transactionModalOverlay.style.display = "none";
            });
        }

        // Also close modal if clicking outside the content area
        window.addEventListener('click', (event) => {
            if (event.target == transactionModalOverlay) {
                transactionModalOverlay.style.display = "none";
            }
        });
    }


    // --- 5. Category Modal Logic (on add-edit-product.html) ---
    // This code runs only if it finds the category modal overlay.
    const categoryModalOverlay = document.getElementById("categoryModalOverlay");
    if (categoryModalOverlay) {
        const openCategoryModalBtn = document.getElementById("openCategoryModalBtn");
        const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
        const saveCategoryBtn = document.getElementById("saveCategoryBtn");
        const newCategoryInput = document.getElementById("new-category-name");
        const mainCategorySelect = document.getElementById("category");

        // Open modal
        if (openCategoryModalBtn) {
            openCategoryModalBtn.addEventListener("click", (e) => {
                e.preventDefault();
                categoryModalOverlay.style.display = "flex";
            });
        }

        // Close modal
        if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener("click", () => categoryModalOverlay.style.display = "none");

        // Save new category
        if (saveCategoryBtn) {
            saveCategoryBtn.addEventListener("click", () => {
                const categoryName = newCategoryInput.value.trim();
                if (categoryName === "") {
                    alert("Nama kategori tidak boleh kosong!");
                    return;
                }
                const newOption = new Option(categoryName, categoryName.toLowerCase().replace(/\s+/g, "-"));
                mainCategorySelect.add(newOption);
                mainCategorySelect.value = newOption.value;
                alert(`Kategori "${categoryName}" berhasil ditambahkan!`);
                newCategoryInput.value = "";
                categoryModalOverlay.style.display = "none";
            });
        }

        // Also close modal if clicking outside
        window.addEventListener('click', (event) => {
            if (event.target == categoryModalOverlay) {
                categoryModalOverlay.style.display = "none";
            }
        });
    }

}); // End of DOMContentLoaded