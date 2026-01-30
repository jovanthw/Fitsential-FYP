/* =========================================
   1. FIREBASE SETUP
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, addDoc, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL1Yfjhxo9V7HqWjJus8twlFNKYgPvCAE",
  authDomain: "fitsential.firebaseapp.com",
  projectId: "fitsential",
  storageBucket: "fitsential.firebasestorage.app",
  messagingSenderId: "409967637194",
  appId: "1:409967637194:web:92463ef7b4d473ddb2fa33",
  measurementId: "G-L99X17WE91"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================================
   2. SHARED DATA
   ========================================= */
const products = [
    // --- TOPS ---
    { id: "essential-oversized-tee", name: "Essential Oversized Tee", price: 49.90, category: "Tops", subCategory: "tshirt", gender: "Unisex", availableSizes: ["S", "M", "L", "XL"], stockStatus: "in_stock", styleTags: ["minimalist", "streetwear", "casual"], occasion: ["casual_hangout", "university"], color: "Beige", material: "Cotton", images: { displayUrl: "./images/1.jpg", vtoUrl: "./images/1.jpg" } },
    { id: "classic-white-tee", name: "Classic White Tee", price: 39.90, category: "Tops", subCategory: "tshirt", gender: "Unisex", availableSizes: ["S", "M", "L"], stockStatus: "in_stock", styleTags: ["basic", "minimalist", "clean"], occasion: ["everyday", "layering"], color: "White", material: "Cotton", images: { displayUrl: "./images/2.jpg", vtoUrl: "./images/2.jpg" } },
    { id: "vintage-graphic-tee", name: "Vintage Graphic Tee", price: 55.00, category: "Tops", subCategory: "tshirt", gender: "Unisex", availableSizes: ["M", "L", "XL"], stockStatus: "low_stock", styleTags: ["vintage", "streetwear", "edgy"], occasion: ["concert", "hangout"], color: "Black", material: "Cotton", images: { displayUrl: "./images/3.jpg", vtoUrl: "./images/3.jpg" } },
    { id: "black-hoodie", name: "Black Hoodie", price: 79.00, category: "Tops", subCategory: "hoodie", gender: "Unisex", availableSizes: ["S", "M", "L", "XL"], stockStatus: "in_stock", styleTags: ["streetwear", "urban", "cozy"], occasion: ["night_out", "cold_weather"], color: "Black", material: "Fleece", images: { displayUrl: "./images/7.jpg", vtoUrl: "./images/7.jpg" } },
    { id: "grey-zip-up-hoodie", name: "Grey Zip-Up Hoodie", price: 85.00, category: "Tops", subCategory: "hoodie", gender: "Unisex", availableSizes: ["M", "L", "XL"], stockStatus: "in_stock", styleTags: ["sporty", "casual", "athleisure"], occasion: ["gym", "travel"], color: "Grey", material: "Cotton Blend", images: { displayUrl: "./images/8.jpg", vtoUrl: "./images/8.jpg" } },
    { id: "oxford-button-down-shirt", name: "Oxford Button-Down Shirt", price: 69.90, category: "Tops", subCategory: "shirt", gender: "Male", availableSizes: ["S", "M", "L"], stockStatus: "in_stock", styleTags: ["smart", "formal", "office"], occasion: ["work", "presentation", "wedding"], color: "White", material: "Cotton", images: { displayUrl: "./images/11.jpg", vtoUrl: "./images/11.jpg" } },

    // --- BOTTOMS ---
    { id: "relaxed-fit-jeans", name: "Relaxed Fit Jeans", price: 89.90, category: "Bottoms", subCategory: "jeans", gender: "Unisex", availableSizes: ["S", "M", "L", "XL"], stockStatus: "in_stock", styleTags: ["casual", "streetwear"], occasion: ["university", "hangout"], color: "Blue", material: "Denim", images: { displayUrl: "./images/4.jpg", vtoUrl: "./images/4.jpg" } },
    { id: "slim-fit-black-jeans", name: "Slim Fit Black Jeans", price: 99.90, category: "Bottoms", subCategory: "jeans", gender: "Male", availableSizes: ["28", "30", "32", "34"], stockStatus: "in_stock", styleTags: ["smart_casual", "night_out", "sleek"], occasion: ["dinner", "date"], color: "Black", material: "Denim", images: { displayUrl: "./images/5.jpg", vtoUrl: "./images/5.jpg" } },
    { id: "utility-cargo-pants", name: "Utility Cargo Pants", price: 110.00, category: "Bottoms", subCategory: "pants", gender: "Unisex", availableSizes: ["S", "M", "L"], stockStatus: "in_stock", styleTags: ["streetwear", "utilitarian", "gorpcore"], occasion: ["outdoor", "festival"], color: "Khaki", material: "Canvas", images: { displayUrl: "./images/6.jpg", vtoUrl: "./images/6.jpg" } },
    { id: "chino-trousers", name: "Chino Trousers", price: 79.90, category: "Bottoms", subCategory: "pants", gender: "Male", availableSizes: ["30", "32", "34"], stockStatus: "in_stock", styleTags: ["smart_casual", "preppy"], occasion: ["office", "dinner"], color: "Navy", material: "Cotton Twill", images: { displayUrl: "./images/12.jpg", vtoUrl: "./images/12.jpg" } },

    // --- OUTERWEAR ---
    { id: "denim-trucker-jacket", name: "Denim Trucker Jacket", price: 129.90, category: "Outerwear", subCategory: "jacket", gender: "Unisex", availableSizes: ["M", "L"], stockStatus: "in_stock", styleTags: ["classic", "layering", "vintage"], occasion: ["date", "casual_hangout"], color: "Light Blue", material: "Denim", images: { displayUrl: "./images/9.jpg", vtoUrl: "./images/9.jpg" } },
    { id: "oversized-bomber-jacket", name: "Oversized Bomber Jacket", price: 149.00, category: "Outerwear", subCategory: "jacket", gender: "Unisex", availableSizes: ["L", "XL"], stockStatus: "low_stock", styleTags: ["streetwear", "statement", "warm"], occasion: ["night_out", "winter"], color: "Army Green", material: "Nylon", images: { displayUrl: "./images/10.jpg", vtoUrl: "./images/10.jpg" } }
];

let currentSelectedSize = 'M';

window.tailwind.config = { theme: { extend: { colors: { border: "hsl(20 10% 85%)", background: "hsl(30 20% 98%)", primary: { DEFAULT: "hsl(20 10% 15%)", foreground: "hsl(30 20% 98%)" }, accent: { DEFAULT: "hsl(20 70% 47%)", foreground: "hsl(30 20% 98%)" } }, fontFamily: { heading: ['"Playfair Display"', 'serif'], body: ['"Inter"', 'sans-serif'] }, animation: { 'fade-in-up': 'fadeInUp 0.8s ease-out forwards' } } } };

/* =========================================
   3. FUNCTIONS
   ========================================= */

// --- COOKIES ---
window.injectCookieBanner = () => {
    // 1. Guard: Check if user is logged in
    if (!auth.currentUser) return;

    // 2. Guard: Check if already accepted
    if (localStorage.getItem('fitsential_cookie_accepted')) return;

    // 3. Guard: Prevent duplicates
    if (document.getElementById('cookie-banner')) return;

    const bannerHTML = `
    <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 animate-fade-in-up">
        <div class="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="bg-gray-100 p-2 rounded-full"><i data-lucide="cookie" class="w-5 h-5 text-accent"></i></div>
                <p class="text-sm text-gray-600">We use cookies to improve your experience. By using our site, you agree to our policy.</p>
            </div>
            <button onclick="acceptCookies()" class="bg-black text-white px-6 py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition">Accept</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    if(window.lucide) lucide.createIcons();
};

window.acceptCookies = () => {
    localStorage.setItem('fitsential_cookie_accepted', 'true');
    const banner = document.getElementById('cookie-banner');
    if(banner) {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
    }
};

// --- HEADER & NAVIGATION ---
window.injectHeader = () => {
    const path = window.location.pathname;
    const isActive = (p) => path.includes(p) ? 'text-accent' : 'text-gray-600 hover:text-accent';
    const headerHTML = `
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all">
        <div class="container mx-auto px-6 py-4 flex items-center justify-between">
            <a href="index.html" class="font-heading text-2xl font-semibold text-primary">FItsential</a>
            <nav class="hidden md:flex items-center relative bg-gray-100/50 rounded-full px-2 py-1.5 border border-white/20 shadow-inner">
                <div id="nav-lamp" class="absolute top-0 bottom-0 rounded-full bg-white shadow-sm border border-gray-200 z-0 opacity-0 transition-all duration-300 ease-out" style="height: 100%; top: 0;">
                    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-t-full opacity-20"></div>
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-8 bg-accent/20 blur-md rounded-full"></div>
                </div>
                <a href="shop.html" class="nav-item relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-300 ${isActive('shop.html')}" onmouseover="moveLamp(this)">Shop</a>
                <a href="fitroom.html" class="nav-item relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-300 ${isActive('fitroom.html')}" onmouseover="moveLamp(this)">Fitroom</a>
            </nav>
            <div class="flex items-center gap-2">
                <div class="flex items-center bg-transparent rounded-full px-2 transition-all duration-300" id="search-container">
                    <input type="text" id="global-search" placeholder="Search..." class="w-0 overflow-hidden bg-transparent focus:w-32 md:focus:w-48 transition-all duration-300 outline-none text-sm border-b border-transparent focus:border-accent" onkeydown="if(event.key === 'Enter') window.location.href='shop.html?search='+this.value">
                    <button onclick="toggleSearch()" class="p-2 hover:text-accent"><i data-lucide="search" class="w-5 h-5"></i></button>
                </div>
                <a href="#" onclick="handleWishlistClick(event)" class="p-2 hover:text-accent relative ${path.includes('wishlist.html') ? 'text-accent' : ''}"><i data-lucide="heart" class="w-5 h-5"></i></a>
                <a href="#" onclick="handleCartClick(event)" class="p-2 hover:text-accent relative ${path.includes('cart.html') ? 'text-accent' : ''}">
                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                    <span id="cart-badge" class="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium hidden">0</span>
                </a>
                <div id="auth-icon-container" class="relative">
                    <a href="login.html" class="p-2 hover:text-accent"><i data-lucide="log-in" class="w-5 h-5"></i></a>
                </div>
            </div>
        </div>
    </header>`;
    if (!document.querySelector('header')) { document.body.insertAdjacentHTML('afterbegin', headerHTML); setTimeout(initLampNav, 100); window.addEventListener('load', initLampNav); }
};

window.moveLamp = (target) => { const lamp = document.getElementById('nav-lamp'); if (!lamp || !target) return; const navRect = target.parentElement.getBoundingClientRect(); const itemRect = target.getBoundingClientRect(); const leftPos = itemRect.left - navRect.left; lamp.style.width = `${itemRect.width}px`; lamp.style.transform = `translateX(${leftPos}px)`; lamp.style.opacity = '1'; };
window.initLampNav = () => { const links = document.querySelectorAll('.nav-item'); let activeLink = null; links.forEach(link => { if (path.includes(link.getAttribute('href'))) activeLink = link; }); const lamp = document.getElementById('nav-lamp'); const nav = document.querySelector('nav'); if (activeLink) { moveLamp(activeLink); } else if (lamp) { lamp.style.opacity = '0'; } if(nav && activeLink) { nav.addEventListener('mouseleave', () => moveLamp(activeLink)); } };
window.injectFooter = () => { const footerHTML = `<footer class="bg-black text-white py-16 mt-auto"><div class="container mx-auto px-6 grid md:grid-cols-4 gap-12"><div><h3 class="font-heading text-2xl font-semibold mb-4">FItsential</h3><p class="text-sm text-gray-400">Curated fashion for the modern individual.</p></div><div><h4 class="font-medium mb-4 uppercase text-sm text-white">Shop</h4><ul class="space-y-2 text-sm text-gray-400"><li><a href="shop.html" class="hover:text-accent">New Arrivals</a></li><li><a href="shop.html" class="hover:text-accent">Sale</a></li></ul></div><div><h4 class="font-medium mb-4 uppercase text-sm text-white">Support</h4><ul class="space-y-2 text-sm text-gray-400"><li><a href="size-guide.html" class="hover:text-accent">Size Guide</a></li><li><a href="track.html" class="hover:text-accent">Track Order</a></li><li><a href="return.html" class="hover:text-accent">Returns</a></li><li><a href="faq.html" class="hover:text-accent">FAQ</a></li><li><a href="about.html" class="hover:text-accent">About Us</a></li></ul></div><div><h4 class="font-medium mb-4 uppercase text-sm text-white">Connect</h4><div class="flex gap-4"><i data-lucide="facebook" class="w-5 h-5 cursor-pointer hover:text-accent"></i><i data-lucide="instagram" class="w-5 h-5 cursor-pointer hover:text-accent"></i><i data-lucide="linkedin" class="w-5 h-5 cursor-pointer hover:text-accent"></i><i data-lucide="youtube" class="w-5 h-5 cursor-pointer hover:text-accent"></i></div></div></div><div class="container mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">&copy; 2026 FItsential. All rights reserved.</div></footer>`; if (!document.querySelector('footer')) document.body.insertAdjacentHTML('beforeend', footerHTML); };

window.updateHeaderUI = (user) => {
    const container = document.getElementById('auth-icon-container');
    if (!container) return;
    if (user) {
        container.innerHTML = `
            <div id="user-popover" class="popover-wrapper relative">
                <button onclick="openPopover('user-popover')" class="popover-trigger p-2 hover:text-accent flex items-center gap-2 ${window.location.pathname.includes('profile') ? 'text-green-700' : 'text-gray-600'}">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </button>
                <div class="popover-content absolute top-full right-0 mt-2 w-48 bg-white border border-border shadow-lg rounded-lg p-2 origin-top-right">
                    <div class="popover-form space-y-1">
                        <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">My Profile</a>
                        <a href="orders.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">My Orders</a>
                        <button onclick="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Sign Out</button>
                    </div>
                </div>
            </div>`;
        const userRef = doc(db, "users", user.uid);
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const items = docSnap.data().cartItems || [];
                const badge = document.getElementById('cart-badge');
                if(badge) { badge.innerText = items.length; badge.classList.remove('hidden'); if(items.length===0) badge.classList.add('hidden'); }
            }
        });
    } else {
        container.innerHTML = `<a href="login.html" class="p-2 hover:text-accent"><i data-lucide="log-in" class="w-5 h-5"></i></a>`;
    }
    if(window.lucide) lucide.createIcons();
};

window.logout = () => {
    localStorage.removeItem('fitsential_cookie_accepted');
    signOut(auth).then(()=>window.location.href="login.html");
};

// --- CHATBOT ---
window.handleChatSend = (inputId, containerId) => {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;
    const msg = input.value.trim();
    if (!msg) return;
    const userDiv = document.createElement('div');
    userDiv.className = "bg-black text-white p-3 rounded-lg rounded-tr-none text-sm ml-auto max-w-[80%] mb-2 animate-fade-in-up";
    userDiv.innerText = msg;
    container.appendChild(userDiv);
    input.value = "";
    container.scrollTop = container.scrollHeight;
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = "bg-gray-100 text-gray-800 p-3 rounded-lg rounded-tl-none text-sm mr-auto max-w-[80%] mb-2 animate-fade-in-up";
        aiDiv.innerText = "That's a stylish choice! I can help you find matching items or check specific sizes.";
        container.appendChild(aiDiv);
        container.scrollTop = container.scrollHeight;
    }, 1000);
};
window.toggleChat = () => { document.getElementById('chat-window-float').classList.toggle('hidden'); };

// --- CART ---
window.loadCart = async () => {
    onAuthStateChanged(auth, async (user) => {
        const guestState = document.getElementById('guest-state'); const emptyState = document.getElementById('empty-state'); const cartSummary = document.getElementById('cart-summary'); const container = document.getElementById('cart-container');
        if (!user) { if(guestState) guestState.classList.remove('hidden'); if(cartSummary) cartSummary.classList.add('hidden'); if(emptyState) emptyState.classList.add('hidden'); return; }
        if(guestState) guestState.classList.add('hidden');
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            const rawItems = docSnap.exists() ? (docSnap.data().cartItems || []) : [];
            const groupedItems = {};
            rawItems.forEach(item => { const key = `${item.id}-${item.size||'M'}`; if(groupedItems[key]) { groupedItems[key].qty += 1; } else { groupedItems[key] = { ...item, qty: 1, uniqueKey: key }; } });
            const items = Object.values(groupedItems);
            if (items.length === 0) { if(container) container.innerHTML = ''; if(emptyState) emptyState.classList.remove('hidden'); if(cartSummary) cartSummary.classList.add('hidden'); } else {
                if(emptyState) emptyState.classList.add('hidden'); if(cartSummary) cartSummary.classList.remove('hidden');
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                const shipping = subtotal > 150 ? 0 : 12;
                document.getElementById('summary-subtotal').innerText = `$${subtotal.toFixed(2)}`;
                document.getElementById('summary-total').innerText = `$${(subtotal + shipping).toFixed(2)}`;
                if(container) {
                    container.innerHTML = items.map(item => `<div class="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-lg border border-border relative animate-fade-in-up"><img src="${item.images.displayUrl}" class="w-24 h-28 object-cover rounded-md bg-gray-50"><div class="flex-1 text-center sm:text-left"><h3 class="font-heading text-lg font-medium">${item.name}</h3><p class="text-sm text-gray-500 mb-2">Size: ${item.size || 'M'}</p><p class="font-bold text-lg">$${item.price.toFixed(2)}</p></div><div class="flex items-center border border-border rounded-md"><button onclick="updateCartQty('${item.id}', -1, '${item.size||'M'}')" class="px-3 py-1 hover:bg-gray-100 transition">-</button><span class="px-3 py-1 font-medium">${item.qty}</span><button onclick="updateCartQty('${item.id}', 1, '${item.size||'M'}')" class="px-3 py-1 hover:bg-gray-100 transition">+</button></div><div class="absolute top-4 right-4 delete-wrapper" id="del-wrap-${item.uniqueKey}"><button onclick="handleDeleteStep('${item.uniqueKey}', '${item.id}', '${item.size||'M'}')" class="delete-main-btn bg-white border border-gray-200 text-gray-400 p-2 rounded-md transition hover:border-red-200 hover:text-red-500"><i data-lucide="trash-2" class="w-4 h-4" id="del-icon-${item.uniqueKey}"></i><span class="text-xs font-bold hidden ml-1" id="del-text-${item.uniqueKey}">CONFIRM</span></button><button onclick="cancelDelete('${item.uniqueKey}')" class="cancel-btn bg-gray-100 p-2 rounded-md hidden ml-1 text-gray-500 hover:text-black"><i data-lucide="x" class="w-4 h-4"></i></button></div></div>`).join('');
                    if(window.lucide) lucide.createIcons();
                }
            }
        });
    });
};
window.updateCartQty = async (productId, change, size) => { const user = auth.currentUser; if(!user) return; const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef); let items = snap.data().cartItems || []; if (change > 0) { const product = products.find(p => p.id === productId); items.push({ ...product, size: size }); } else { const index = items.findIndex(i => i.id === productId && (i.size||'M') === size); if (index > -1) items.splice(index, 1); } await updateDoc(userRef, { cartItems: items }); };
window.handleDeleteStep = (uniqueKey, id, size) => { const wrapper = document.getElementById(`del-wrap-${uniqueKey}`); const mainBtn = wrapper.querySelector('.delete-main-btn'); const icon = document.getElementById(`del-icon-${uniqueKey}`); const text = document.getElementById(`del-text-${uniqueKey}`); const cancelBtn = wrapper.querySelector('.cancel-btn'); if (wrapper.classList.contains('expanded')) { removeFromCart(id, size); } else { wrapper.classList.add('expanded'); mainBtn.classList.remove('bg-white', 'text-gray-400'); mainBtn.classList.add('bg-red-600', 'text-white', 'border-red-600'); icon.setAttribute('data-lucide', 'check'); text.classList.remove('hidden'); cancelBtn.classList.remove('hidden'); if(window.lucide) lucide.createIcons(); } };
window.cancelDelete = (uniqueKey) => { const wrapper = document.getElementById(`del-wrap-${uniqueKey}`); const mainBtn = wrapper.querySelector('.delete-main-btn'); const icon = document.getElementById(`del-icon-${uniqueKey}`); const text = document.getElementById(`del-text-${uniqueKey}`); const cancelBtn = wrapper.querySelector('.cancel-btn'); wrapper.classList.remove('expanded'); mainBtn.classList.add('bg-white', 'text-gray-400'); mainBtn.classList.remove('bg-red-600', 'text-white', 'border-red-600'); icon.setAttribute('data-lucide', 'trash-2'); text.classList.add('hidden'); cancelBtn.classList.add('hidden'); if(window.lucide) lucide.createIcons(); };
window.removeFromCart = async (productId, size) => { const user = auth.currentUser; if(!user) return; const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef); let items = snap.data().cartItems || []; const newItems = items.filter(i => !(i.id === productId && (i.size||'M') === size)); await updateDoc(userRef, { cartItems: newItems }); };

// --- WISHLIST & ORDERS ---
window.loadWishlist = async () => { onAuthStateChanged(auth, async (user) => { const container = document.getElementById('wishlist-container'); const empty = document.getElementById('wishlist-empty'); const guest = document.getElementById('guest-state'); if (!user) { if(container) container.innerHTML = ''; if(empty) empty.classList.add('hidden'); if(guest) guest.classList.remove('hidden'); return; } if(guest) guest.classList.add('hidden'); onSnapshot(doc(db, "users", user.uid), (docSnap) => { let items = docSnap.exists() ? (docSnap.data().wishlistItems || []) : []; if (items.length === 0) { container.innerHTML = ''; empty.classList.remove('hidden'); } else { empty.classList.add('hidden'); container.innerHTML = items.map((item) => `<div class="group relative animate-fade-in-up"><div class="aspect-[4/5] bg-secondary rounded-lg overflow-hidden mb-3 relative"><img src="${item.images.displayUrl}" class="w-full h-full object-cover"><button onclick="removeFromWishlistPage(event, '${item.id}')" class="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition z-10"><i data-lucide="x" class="w-4 h-4"></i></button><div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"><button onclick="handleAddToCart(event, '${item.id}')" class="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 shadow-lg">Add to Cart</button></div></div><h3 class="font-medium text-lg">${item.name}</h3><p class="text-gray-500">$${item.price.toFixed(2)}</p></div>`).join(''); if(window.lucide) lucide.createIcons(); } }); }); };
window.loadOrders = async () => { onAuthStateChanged(auth, async (user) => { if(!user) { window.location.href='login.html'; return; } const container = document.getElementById('orders-container'); if(!container) return; const snap = await getDoc(doc(db, "users", user.uid)); const orders = snap.exists() ? (snap.data().orders || []) : []; orders.sort((a,b) => new Date(b.date) - new Date(a.date)); container.innerHTML = orders.length === 0 ? '<div class="text-center text-gray-500 py-10">No orders placed yet.</div>' : orders.map(o => `<div class="bg-white border border-border rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition"><div class="flex flex-col md:flex-row justify-between border-b border-border pb-4 mb-4 gap-4"><div><p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Placed On</p><p class="font-medium">${new Date(o.date).toLocaleDateString()}</p></div><div><p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p><p class="font-medium text-accent">$${o.total.toFixed(2)}</p></div><div><p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p><span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">${o.status}</span></div></div><div class="space-y-4">${o.items.map(i => `<div class="flex items-center gap-4"><img src="${i.images.displayUrl}" class="w-16 h-20 object-cover rounded-md bg-gray-50"><div><p class="font-medium text-sm">${i.name}</p><p class="text-xs text-gray-500">Size: ${i.size || 'M'} | $${i.price.toFixed(2)}</p></div></div>`).join('')}</div><div class="flex justify-between items-center mt-6 pt-4 border-t border-border"><span class="text-xs text-gray-400 font-mono">ID: ${o.id}</span><button onclick="window.location.href='track.html?id=${o.id}'" class="text-sm text-black underline hover:text-accent">Track Order</button></div></div>`).join(''); }); };

// --- SHOP RENDERERS ---
window.renderShop = (filter="All") => {
    const grid = document.getElementById('product-grid'); if(!grid) return;
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search') || "";
    let displayProducts = products;
    if(filter !== "All") displayProducts = products.filter(p => p.category === filter);
    if(searchTerm) { displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())); if(filter !== "All") window.history.pushState({}, "", "shop.html"); }
    document.querySelectorAll('.cat-btn').forEach(btn => { btn.className = "cat-btn px-6 py-2 rounded-full border border-border text-sm hover:border-accent transition bg-white text-gray-700"; if(btn.innerText === filter) { btn.classList.add('active-filter'); btn.classList.remove('bg-white', 'text-gray-700'); } });
    grid.innerHTML = displayProducts.map(product => `<div class="group relative animate-fade-in-up"><div class="aspect-[4/5] bg-secondary rounded-lg overflow-hidden mb-3 relative"><img src="${product.images.displayUrl}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105"><button id="wish-btn-${product.id}" data-id="${product.id}" onclick="toggleWishlist(event, '${product.id}')" class="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition z-10"><i data-lucide="heart" class="w-3.5 h-3.5"></i></button><div class="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"><a href="product.html?id=${product.id}" class="flex-1 bg-white py-2 rounded text-xs font-medium hover:bg-accent hover:text-white transition shadow-sm text-center flex items-center justify-center">View</a><button onclick="handleAddToCart(event, '${product.id}')" class="flex-1 bg-primary text-white py-2 rounded text-xs font-medium hover:bg-gray-800 transition shadow-sm flex items-center justify-center">Add</button></div></div><h3 class="font-medium text-base line-clamp-1">${product.name}</h3><p class="text-xs text-gray-500">$${product.price.toFixed(2)}</p></div>`).join('');
    if(window.lucide) lucide.createIcons(); if(auth.currentUser) syncWishlistState(auth.currentUser);
};
window.renderProductDetail = (id) => { const product = products.find(p => p.id === id); if (!product) return; document.getElementById('p-image').src = product.images.displayUrl; document.getElementById('p-name').innerText = product.name; document.getElementById('p-price').innerText = `$${product.price.toFixed(2)}`; document.getElementById('p-desc').innerText = product.description || `A premium item.`; document.getElementById('add-to-cart-btn').onclick = (e) => handleAddToCart(e, product.id); const wBtn = document.getElementById('add-to-wish-btn'); wBtn.id = `wish-btn-${product.id}`; wBtn.setAttribute('data-id', product.id); wBtn.onclick = (e) => toggleWishlist(e, product.id); loadReviews(id); checkReviewEligibility(id); };
window.selectSize = (btn, size) => { currentSelectedSize = size; document.querySelectorAll('.size-btn').forEach(b => { b.classList.remove('selected', 'bg-black', 'text-white', 'border-black'); b.classList.add('border-border'); }); btn.classList.add('selected', 'bg-black', 'text-white', 'border-black'); };

// --- UTILITIES ---
window.toggleSearch = () => { const el = document.getElementById('global-search'); if(el.classList.contains('w-0')){ el.classList.remove('w-0'); el.classList.add('w-32'); el.focus(); } else { el.classList.add('w-0'); } };
window.handleCartClick = (e) => { e.preventDefault(); if(auth.currentUser) window.location.href='cart.html'; else window.location.href='cart.html'; };
window.handleWishlistClick = (e) => { e.preventDefault(); if(auth.currentUser) window.location.href='wishlist.html'; else window.location.href='wishlist.html'; };
window.filterCategory = (cat) => renderShop(cat);
window.setupLoginListeners = () => { const inputs = document.querySelectorAll('input'); inputs.forEach(i => i.addEventListener('input', () => { i.classList.remove('border-red-500', 'animate-shake'); const err = i.closest('form').querySelector('p.text-red-500'); if(err) err.classList.add('hidden'); })); };
window.checkLoginMessages = (params) => { if(params.get('msg')==='login_required') { const el = document.getElementById('login-error-msg'); if(el){ el.innerText="Please log in to continue."; el.classList.remove('hidden'); }}};
window.handleAuth = async (e, type) => { e.preventDefault(); const form = e.target; const emailInput = type==='login' ? document.getElementById('login-email') : document.getElementById('signup-email'); const passInput = type==='login' ? document.getElementById('login-pass') : document.getElementById('signup-pass'); const errorMsg = type==='login' ? document.getElementById('login-error-msg') : document.getElementById('signup-error-msg'); const btn = form.querySelector('button'); const originalText = btn.innerText; btn.innerText = "Processing..."; btn.disabled = true; [emailInput, passInput].forEach(i => i.classList.remove('border-red-500')); if(errorMsg) errorMsg.classList.add('hidden'); try { if(type === 'signup') { const c = await createUserWithEmailAndPassword(auth, emailInput.value, passInput.value); await setDoc(doc(db,"users",c.user.uid),{email: emailInput.value, joined: new Date().toISOString(), cartItems:[], wishlistItems:[], orders:[], myReviews:[]}); } else { await signInWithEmailAndPassword(auth, emailInput.value, passInput.value); } window.location.href = "index.html"; } catch(err) { btn.innerText = originalText; btn.disabled = false; if (errorMsg) { let message = "Username of Password is incorrect."; if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') { message = "Incorrect email or password."; emailInput.classList.add('border-red-500', 'animate-shake'); passInput.classList.add('border-red-500', 'animate-shake'); } else if (err.code === 'auth/email-already-in-use') { message = "Email already registered."; emailInput.classList.add('border-red-500'); } else if (err.code === 'auth/weak-password') { message = "Password must be 6+ chars."; passInput.classList.add('border-red-500'); } errorMsg.querySelector('span').innerText = message; errorMsg.classList.remove('hidden'); setTimeout(() => { emailInput.classList.remove('animate-shake'); passInput.classList.remove('animate-shake'); }, 500); } } };
window.initSeedPage = () => { const btn = document.getElementById('seed-btn'); const status = document.getElementById('seed-status'); if(!btn) return; btn.onclick = async () => { const user = auth.currentUser; if (!user) { alert("Please log in first."); window.location.href = 'login.html'; return; } if(!confirm(`Upload ${products.length} products to Firestore?`)) return; btn.innerText = "Uploading..."; btn.disabled = true; btn.classList.add('opacity-50'); try { let count = 0; for (const product of products) { await setDoc(doc(db, "products", product.id), product, { merge: true }); status.innerText = `Uploaded: ${product.name}...`; count++; } btn.innerText = `Success! (${count})`; btn.classList.add('bg-green-600'); status.innerText = "Complete."; } catch (error) { console.error(error); btn.innerText = "Error"; } finally { btn.disabled = false; btn.classList.remove('opacity-50'); } }; };
window.toggleWishlist = async (e, productId) => { if(e) { e.preventDefault(); e.stopPropagation(); } const btn = (e && e.currentTarget) ? e.currentTarget : document.getElementById(`wish-btn-${productId}`); if(!btn) return; const user = auth.currentUser; if (!user) { window.location.href = "login.html?msg=login_required"; return; } const product = products.find(p => p.id === productId); if(!product) return; const isCurrentlyRed = btn.classList.contains('text-red-500'); const icon = btn.querySelector('svg') || btn.querySelector('i'); if (isCurrentlyRed) { btn.classList.remove('text-red-500', 'fill-current'); btn.classList.add('text-gray-400'); if(icon) { icon.setAttribute('fill', 'none'); icon.classList.remove('fill-current'); } } else { btn.classList.add('text-red-500', 'fill-current'); btn.classList.remove('text-gray-400'); if(icon) { icon.setAttribute('fill', 'currentColor'); icon.classList.add('fill-current'); } } try { const userRef = doc(db, "users", user.uid); if(!isCurrentlyRed) await setDoc(userRef, { wishlistItems: arrayUnion(product) }, { merge: true }); else await updateDoc(userRef, { wishlistItems: arrayRemove(product) }); } catch(err) {} };
window.removeFromWishlistPage = async (e, productId) => { if(e) { e.preventDefault(); e.stopPropagation(); } const user = auth.currentUser; if (!user) return; const btn = e.currentTarget; const card = btn.closest('.group'); if(card) { card.style.opacity = '0'; setTimeout(() => card.remove(), 300); } try { const product = products.find(p => p.id === productId); const userRef = doc(db, "users", user.uid); await updateDoc(userRef, { wishlistItems: arrayRemove(product) }); } catch(err) { console.error(err); } };
window.handleAddToCart = async (e, productId) => { if(e) { e.preventDefault(); e.stopPropagation(); } const btn = e ? e.currentTarget : null; const product = products.find(p => p.id === productId); const user = auth.currentUser; if (!user) { window.location.href = "login.html?msg=login_required"; return; } if(btn) { const orig = btn.innerHTML; btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i>`; btn.classList.add('bg-green-600', 'text-white'); if(window.lucide) lucide.createIcons(); setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('bg-green-600'); }, 2000); } const cartItem = { ...product, size: currentSelectedSize }; try { const userRef = doc(db, "users", user.uid); await setDoc(userRef, { cartItems: arrayUnion(cartItem) }, { merge: true }); } catch (error) { alert(error.message); } };
window.syncWishlistState = async (user) => { const userRef = doc(db, "users", user.uid); onSnapshot(userRef, (docSnap) => { if(docSnap.exists()) { const items = docSnap.data().wishlistItems || []; document.querySelectorAll('[id^="wish-btn-"]').forEach(btn => { const pid = btn.getAttribute('data-id'); const inWishlist = items.find(i => i.id === pid); const icon = btn.querySelector('svg') || btn.querySelector('i'); if(inWishlist) { btn.classList.add('text-red-500', 'fill-current'); btn.classList.remove('text-gray-400'); if(icon) icon.setAttribute('fill', 'currentColor'); } else { btn.classList.remove('text-red-500', 'fill-current'); btn.classList.add('text-gray-400'); if(icon) icon.setAttribute('fill', 'none'); } }); } }); };
window.setupPopovers = () => { window.openPopover = (id) => { document.querySelectorAll('.popover-wrapper').forEach(p => p.classList.remove('active')); const w = document.getElementById(id); if(w) w.classList.add('active'); }; window.closePopover = (id) => { const w = document.getElementById(id); if(w) { w.classList.remove('active'); setTimeout(() => { const c = w.querySelector('.popover-content'); if(c) c.classList.remove('show-success'); }, 300); } }; window.submitPopover = (e, id, cb) => { if(e) e.preventDefault(); const w = document.getElementById(id); if(w) { const c = w.querySelector('.popover-content'); const b = w.querySelector('button[type="submit"]'); if(b) { const txt = b.innerHTML; b.innerHTML = `<i data-lucide="loader" class="animate-spin w-4 h-4"></i>`; if(window.lucide) lucide.createIcons(); setTimeout(() => { b.innerHTML = txt; c.classList.add('show-success'); if(cb) cb(); }, 1000); } } }; document.addEventListener('click', (e) => { if (!e.target.closest('.popover-wrapper')) document.querySelectorAll('.popover-wrapper.active').forEach(w => w.classList.remove('active')); }); };
window.initProfilePage = () => { onAuthStateChanged(auth, async (u) => { if(u) { const d = await getDoc(doc(db,"users",u.uid)); if(d.exists()) { document.getElementById('p-display-name').innerText=d.data().email; } } }); };
window.initFitroom = () => {};
window.initCheckout = () => { onAuthStateChanged(auth, async (user) => { if(!user) window.location.href='login.html'; else { const d = await getDoc(doc(db,"users",user.uid)); if(!d.data().cartItems?.length) window.location.href='cart.html'; else document.getElementById('checkout-subtotal').innerText = `$${d.data().cartItems.reduce((s,i)=>s+i.price,0).toFixed(2)}`; } }); };
window.setCheckoutStep = (step) => { ['step-shipping','step-payment','step-review'].forEach(id=>document.getElementById(id).classList.add('hidden')); document.getElementById(step).classList.remove('hidden'); };
window.placeOrder = async () => { const user = auth.currentUser; const btn = document.getElementById('place-order-btn'); btn.innerText = "Processing..."; try { const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef); const items = snap.data().cartItems || []; const total = items.reduce((s, i) => s + i.price, 0); const orderId = 'ORD-' + Date.now(); await updateDoc(userRef, { orders: arrayUnion({ id: orderId, userId: user.uid, items, total, status: "Processing", date: new Date().toISOString() }), cartItems: [] }); window.location.href = `confirmation.html?orderId=${orderId}`; } catch (e) { alert(e.message); btn.innerText = "Place Order"; } };

/* =========================================
   4. MAIN EXECUTION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    if (window.lucide) lucide.createIcons();

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Page Specific Inits
    if (path.includes('shop.html')) renderShop();
    if (path.includes('product.html')) renderProductDetail(params.get('id'));
    if (path.includes('cart.html')) loadCart();
    if (path.includes('checkout.html')) initCheckout();
    if (path.includes('wishlist.html')) loadWishlist();
    if (path.includes('profile.html')) initProfilePage();
    if (path.includes('login.html')) { checkLoginMessages(params); setupLoginListeners(); }
    if (path.includes('orders.html')) loadOrders();
    if (path.includes('seed.html')) initSeedPage();
    if (path.includes('fitroom.html')) {
        initFitroom();
        window.sendChatMessage = () => handleChatSend('chat-input-embedded', 'chat-box-embedded');
    } else {
        window.sendChatMessage = () => handleChatSend('chat-input-float', 'chat-messages-float');
    }

    setupPopovers();

    // AUTH STATE LISTENER (Handles Header & Cookies)
    onAuthStateChanged(auth, (user) => {
        updateHeaderUI(user);
        if (user) {
            injectCookieBanner(); // Show Cookie Banner ON LOGIN
            if(typeof syncWishlistState === 'function') syncWishlistState(user);
        } else {
            const banner = document.getElementById('cookie-banner');
            if(banner) banner.remove(); // Hide if logged out
        }
    });
});