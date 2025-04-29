document.addEventListener('DOMContentLoaded', function() {
    // 初始化菜单激活状态
    initMenuActive();
    
    // 初始化客户搜索
    initCustomerSearch();
    
    // 初始化客户卡片点击事件
    initCustomerCards();
});

// 初始化菜单激活状态
function initMenuActive() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
        
        // 添加点击事件
        item.addEventListener('click', function(e) {
            // 移除所有激活状态
            menuItems.forEach(i => i.classList.remove('active'));
            // 添加当前项的激活状态
            this.classList.add('active');
        });
    });
}

// 初始化客户搜索
function initCustomerSearch() {
    const searchInput = document.querySelector('.customer-search input');
    const customerCards = document.querySelectorAll('.customer-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchText = e.target.value.toLowerCase();
            
            customerCards.forEach(card => {
                const customerName = card.querySelector('span').textContent.toLowerCase();
                if (customerName.includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// 初始化客户卡片点击事件
function initCustomerCards() {
    const customerCards = document.querySelectorAll('.customer-card');
    
    customerCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除所有卡片的选中状态
            customerCards.forEach(c => c.classList.remove('selected'));
            // 添加当前卡片的选中状态
            this.classList.add('selected');
            
            // 触发客户选择事件
            const customerName = this.querySelector('span').textContent;
            const event = new CustomEvent('customerSelected', {
                detail: { customerName }
            });
            document.dispatchEvent(event);
        });
    });
}

// 切换布局模式（有无客户栏）
function toggleLayout(hasCustomerBar = true) {
    const body = document.body;
    if (hasCustomerBar) {
        body.classList.remove('wide-layout');
    } else {
        body.classList.add('wide-layout');
    }
} 