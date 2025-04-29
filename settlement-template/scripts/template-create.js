// 全局变量
let selectedProcess = null;
let processes = [];
let templateInfo = {
    name: '',
    description: '',
    settlementTypes: []
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    initializeEventListeners();
    loadProcesses();
    showTemplateInfoForm();
});

// 初始化拖拽功能
function initializeDragAndDrop() {
    const processItems = document.querySelectorAll('.process-item');
    const processContainer = document.getElementById('processContainer');

    // 初始化左侧环节的拖拽
    processItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // 初始化流程区域的拖拽
    processContainer.addEventListener('dragover', handleDragOver);
    processContainer.addEventListener('dragleave', handleDragLeave);
    processContainer.addEventListener('drop', handleDrop);
}

// 初始化拖拽排序
function initializeDragSort() {
    const processList = document.getElementById('processList');
    const processCards = processList.querySelectorAll('.process-item-card');

    processCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', handleSortDragStart);
        card.addEventListener('dragend', handleSortDragEnd);
        card.addEventListener('dragover', handleSortDragOver);
        card.addEventListener('drop', handleSortDrop);
    });
}

// 处理拖拽开始
function handleDragStart(e) {
    const type = e.target.dataset.type;
    const name = e.target.querySelector('.text-sm').textContent;
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, name }));
    e.dataTransfer.effectAllowed = 'copy';
    e.target.classList.add('opacity-50');
}

// 处理拖拽结束
function handleDragEnd(e) {
    e.target.classList.remove('opacity-50');
}

// 处理拖拽悬停
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const placeholder = document.querySelector('.process-placeholder');
    if (placeholder) {
        placeholder.classList.add('border-blue-500', 'bg-blue-50');
    }
}

// 处理拖拽离开
function handleDragLeave(e) {
    e.preventDefault();
    const placeholder = document.querySelector('.process-placeholder');
    if (placeholder) {
        placeholder.classList.remove('border-blue-500', 'bg-blue-50');
    }
}

// 处理放置
function handleDrop(e) {
    e.preventDefault();
    const placeholder = document.querySelector('.process-placeholder');
    if (placeholder) {
        placeholder.classList.remove('border-blue-500', 'bg-blue-50');
    }

    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const newProcess = {
            id: Date.now(),
            type: data.type,
            name: data.name,
            data: {
                description: '',
                materials: [],
                dependencies: [],
                follower: '',
                cycle: '',
                triggerCondition: ''
            }
        };

        processes.push(newProcess);
        renderProcesses();
        selectProcess(processes.length - 1);
    } catch (error) {
        console.error('拖拽数据解析错误:', error);
    }
}

// 处理排序拖拽开始
function handleSortDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('opacity-50');
    e.dataTransfer.effectAllowed = 'move';
}

// 处理排序拖拽结束
function handleSortDragEnd(e) {
    e.target.classList.remove('opacity-50');
}

// 处理排序拖拽悬停
function handleSortDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const draggingCard = document.querySelector('.process-item-card.opacity-50');
    const targetCard = e.target.closest('.process-item-card');
    
    if (!targetCard || targetCard === draggingCard) return;
    
    const rect = targetCard.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    
    if (e.clientY < midY) {
        targetCard.classList.add('border-t-2', 'border-blue-500');
        targetCard.classList.remove('border-b-2');
    } else {
        targetCard.classList.add('border-b-2', 'border-blue-500');
        targetCard.classList.remove('border-t-2');
    }
}

// 处理排序放置
function handleSortDrop(e) {
    e.preventDefault();
    
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const targetCard = e.target.closest('.process-item-card');
    if (!targetCard) return;
    
    const toIndex = parseInt(targetCard.dataset.index);
    if (fromIndex === toIndex) return;
    
    const rect = targetCard.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertBefore = e.clientY < midY;
    
    // 移除所有拖拽指示线
    document.querySelectorAll('.process-item-card').forEach(card => {
        card.classList.remove('border-t-2', 'border-b-2', 'border-blue-500');
    });
    
    // 移动环节
    const [movedItem] = processes.splice(fromIndex, 1);
    const newIndex = insertBefore ? toIndex : toIndex + 1;
    processes.splice(newIndex, 0, movedItem);
    
    // 更新选中索引
    if (selectedProcess === fromIndex) {
        selectedProcess = newIndex;
    } else if (selectedProcess > fromIndex && selectedProcess <= toIndex) {
        selectedProcess--;
    } else if (selectedProcess < fromIndex && selectedProcess >= toIndex) {
        selectedProcess++;
    }
    
    renderProcesses();
}

// 获取环节背景色类
function getProcessBgClass(type) {
    switch (type) {
        case 'material': return 'bg-blue-50';
        case 'confirmation': return 'bg-green-50';
        case 'pms': return 'bg-orange-50';
        case 'customer': return 'bg-purple-50';
        case 'stamp': return 'bg-red-50';
        default: return 'bg-gray-50';
    }
}

// 获取环节边框色类
function getProcessBorderClass(type) {
    switch (type) {
        case 'material': return 'border-blue-200';
        case 'confirmation': return 'border-green-200';
        case 'pms': return 'border-orange-200';
        case 'customer': return 'border-purple-200';
        case 'stamp': return 'border-red-200';
        default: return 'border-gray-200';
    }
}

// 获取环节选中背景色类
function getProcessSelectedBgClass(type) {
    switch (type) {
        case 'material': return 'bg-blue-100';
        case 'confirmation': return 'bg-green-100';
        case 'pms': return 'bg-orange-100';
        case 'customer': return 'bg-purple-100';
        case 'stamp': return 'bg-red-100';
        default: return 'bg-gray-100';
    }
}

// 获取环节选中边框色类
function getProcessSelectedBorderClass(type) {
    switch (type) {
        case 'material': return 'border-blue-500';
        case 'confirmation': return 'border-green-500';
        case 'pms': return 'border-orange-500';
        case 'customer': return 'border-purple-500';
        case 'stamp': return 'border-red-500';
        default: return 'border-gray-500';
    }
}

// 渲染流程列表
function renderProcesses() {
    const processList = document.getElementById('processList');
    const placeholder = document.querySelector('.process-placeholder');
    
    if (processes.length === 0) {
        placeholder.classList.remove('hidden');
        processList.innerHTML = '';
        showTemplateInfoForm();
        return;
    }

    placeholder.classList.add('hidden');
    processList.innerHTML = processes.map((process, index) => {
        const isSelected = selectedProcess === index;
        const bgClass = isSelected ? getProcessSelectedBgClass(process.type) : getProcessBgClass(process.type);
        const borderClass = isSelected ? getProcessSelectedBorderClass(process.type) : getProcessBorderClass(process.type);
        
        return `
            <div class="process-item-card ${bgClass} border ${borderClass} rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow 
                        ${isSelected ? 'border-2' : ''}" 
                 data-index="${index}" draggable="true">
                <div class="flex items-center justify-between">
                    <div class="flex items-center" onclick="selectProcess(${index})">
                        <span class="process-icon ${getProcessIconClass(process.type)} mr-3">
                            <i class="${getProcessIcon(process.type)}"></i>
                        </span>
                        <span class="text-sm font-medium">${process.name || getProcessTypeName(process.type)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="text-gray-400 hover:text-gray-600" onclick="event.stopPropagation(); deleteProcess(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <span class="text-gray-400 cursor-move">
                            <i class="fas fa-grip-vertical"></i>
                        </span>
                    </div>
                </div>
                <div class="mt-2" onclick="selectProcess(${index})">
                    ${getProcessPreview(process)}
                </div>
            </div>
        `;
    }).join('');

    // 重新绑定点击事件
    const processCards = processList.querySelectorAll('.process-item-card');
    processCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) { // 排除按钮点击
                const index = parseInt(card.dataset.index);
                selectProcess(index);
            }
        });
    });

    initializeDragSort();
}

// 获取环节图标
function getProcessIcon(type) {
    switch (type) {
        case 'material': return 'fas fa-file-alt';
        case 'confirmation': return 'fas fa-check-circle';
        case 'pms': return 'fas fa-cogs';
        case 'customer': return 'fas fa-building';
        case 'stamp': return 'fas fa-stamp';
        default: return 'fas fa-question-circle';
    }
}

// 获取环节图标类
function getProcessIconClass(type) {
    switch (type) {
        case 'material': return 'text-blue-600';
        case 'confirmation': return 'text-green-600';
        case 'pms': return 'text-orange-600';
        case 'customer': return 'text-purple-600';
        case 'stamp': return 'text-red-600';
        default: return 'text-gray-600';
    }
}

// 获取环节类型名称
function getProcessTypeName(type) {
    switch (type) {
        case 'material': return '资料准备';
        case 'confirmation': return '结算确认';
        case 'pms': return '精明购内部结算';
        case 'customer': return '客户系统结算';
        case 'stamp': return '扫描件盖章';
        default: return '未知类型';
    }
}

// 获取环节预览信息
function getProcessPreview(process) {
    let previewContent = '';
    
    // 添加跟进人和处理周期信息
    const followerInfo = process.data.follower ? 
        `<div class="text-xs text-gray-500 mb-1">跟进人：${process.data.follower}</div>` : '';
    const cycleInfo = process.data.cycle ? 
        `<div class="text-xs text-gray-500 mb-1">处理周期：${process.data.cycle}天</div>` : '';
    
    switch (process.type) {
        case 'material':
            if (process.data.materials && process.data.materials.length > 0) {
                previewContent = `
                    ${followerInfo}
                    ${cycleInfo}
                    <div class="mt-2">
                        <div class="text-xs text-gray-500 mb-1">资料清单：</div>
                        <div class="flex flex-wrap gap-1">
                            ${process.data.materials.map(material => `
                                <span class="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    ${material}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                previewContent = `${followerInfo}${cycleInfo}`;
            }
            break;
        case 'confirmation':
            if (process.data.dependencies && process.data.dependencies.length > 0) {
                previewContent = `
                    ${followerInfo}
                    ${cycleInfo}
                    <div class="mt-2">
                        <div class="text-xs text-gray-500 mb-1">依赖环节：</div>
                        <div class="flex flex-wrap gap-1">
                            ${process.data.dependencies.map(dep => {
                                let typeClass = '';
                                let typeText = '';
                                if (dep.includes('结算资料') || dep.includes('合同')) {
                                    typeClass = 'bg-blue-100 text-blue-800';
                                    typeText = '资料';
                                } else if (dep.includes('确认')) {
                                    typeClass = 'bg-green-100 text-green-800';
                                    typeText = '确认';
                                } else if (dep.includes('系统')) {
                                    typeClass = 'bg-purple-100 text-purple-800';
                                    typeText = '系统';
                                }
                                return `
                                    <span class="inline-block px-2 py-1 text-xs rounded-full ${typeClass}">
                                        <span class="text-xs">${typeText}</span> ${dep}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            } else {
                previewContent = `${followerInfo}${cycleInfo}`;
            }
            break;
        case 'customer':
            if (process.data.dependencies && process.data.dependencies.length > 0) {
                previewContent = `
                    ${followerInfo}
                    ${cycleInfo}
                    <div class="mt-2">
                        <div class="text-xs text-gray-500 mb-1">依赖环节：</div>
                        <div class="flex flex-wrap gap-1">
                            ${process.data.dependencies.map(dep => {
                                let typeClass = '';
                                let typeText = '';
                                if (dep.includes('结算单') || dep.includes('BUPO') || dep.includes('截图')) {
                                    typeClass = 'bg-blue-100 text-blue-800';
                                    typeText = '资料';
                                } else if (dep.includes('确认')) {
                                    typeClass = 'bg-green-100 text-green-800';
                                    typeText = '确认';
                                }
                                return `
                                    <span class="inline-block px-2 py-1 text-xs rounded-full ${typeClass}">
                                        <span class="text-xs">${typeText}</span> ${dep}
                                    </span>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            } else {
                previewContent = `${followerInfo}${cycleInfo}`;
            }
            break;
        case 'pms':
            previewContent = `
                ${followerInfo}
                ${cycleInfo}
                ${process.data.description ? `<div class="text-sm text-gray-500">${process.data.description}</div>` : ''}
            `;
            break;
        case 'stamp':
            previewContent = `
                ${followerInfo}
                ${cycleInfo}
                ${process.data.description ? `<div class="text-sm text-gray-500">${process.data.description}</div>` : ''}
            `;
            break;
    }

    return previewContent;
}

// 显示模板基本信息表单
function showTemplateInfoForm() {
    const propertyPanel = document.getElementById('propertyPanel');
    const propertyPlaceholder = propertyPanel.querySelector('.property-placeholder');
    
    if (propertyPlaceholder) {
        propertyPlaceholder.classList.add('hidden');
    }

    const propertyContent = document.createElement('div');
    propertyContent.className = 'property-content';
    propertyContent.innerHTML = `
        <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">流程基本信息</h3>
            <form id="templateInfoForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">流程名称</label>
                    <input type="text" name="templateName" value="${templateInfo.name || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateTemplateName(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">使用说明</label>
                    <textarea name="templateDescription" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateTemplateDescription(this.value)">${templateInfo.description || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">结算主体</label>
                    <div class="mt-2 space-y-2 flex flex-col">
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="总部" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('总部') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">总部</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="广东" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('广东') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">广东</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="华北" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('华北') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">华北</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="华中" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('华中') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">华中</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="湖南" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('湖南') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">湖南</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="苏皖" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('苏皖') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">苏皖</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementEntity" value="西北" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementEntities?.includes('西北') ? 'checked' : ''}
                                   onchange="updateSettlementEntities(this)">
                            <span class="ml-2 text-sm text-gray-700">西北</span>
                        </label>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">结算科目</label>
                    <div class="mt-2 space-y-2 flex flex-col">
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementType" value="核销" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementTypes?.includes('核销') ? 'checked' : ''}
                                   onchange="updateSettlementTypes(this)">
                            <span class="ml-2 text-sm text-gray-700">核销</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementType" value="广告" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementTypes?.includes('广告') ? 'checked' : ''}
                                   onchange="updateSettlementTypes(this)">
                            <span class="ml-2 text-sm text-gray-700">广告</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementType" value="RTB" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementTypes?.includes('RTB') ? 'checked' : ''}
                                   onchange="updateSettlementTypes(this)">
                            <span class="ml-2 text-sm text-gray-700">RTB</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="settlementType" value="服务费" 
                                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   ${templateInfo.settlementTypes?.includes('服务费') ? 'checked' : ''}
                                   onchange="updateSettlementTypes(this)">
                            <span class="ml-2 text-sm text-gray-700">服务费</span>
                        </label>
                    </div>
                </div>
            </form>
        </div>
    `;

    const existingContent = propertyPanel.querySelector('.property-content');
    if (existingContent) {
        existingContent.remove();
    }

    propertyPanel.appendChild(propertyContent);
}

// 更新模板名称
function updateTemplateName(name) {
    templateInfo.name = name;
}

// 更新模板说明
function updateTemplateDescription(description) {
    templateInfo.description = description;
}

// 更新结算内容
function updateSettlementTypes(checkbox) {
    if (!templateInfo.settlementTypes) {
        templateInfo.settlementTypes = [];
    }
    
    if (checkbox.checked) {
        templateInfo.settlementTypes.push(checkbox.value);
    } else {
        const index = templateInfo.settlementTypes.indexOf(checkbox.value);
        if (index > -1) {
            templateInfo.settlementTypes.splice(index, 1);
        }
    }
}

// 显示属性面板
function showPropertyPanel(process) {
    const propertyPanel = document.getElementById('propertyPanel');
    const propertyPlaceholder = propertyPanel.querySelector('.property-placeholder');
    
    if (propertyPlaceholder) {
        propertyPlaceholder.classList.add('hidden');
    }

    let formContent = '';
    switch (process.type) {
        case 'material':
            formContent = `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节名称</label>
                    <input type="text" name="process_name" value="${process.name || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessName(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节说明</label>
                    <textarea name="process_description" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateProcessDescription(this.value)">${process.data.description || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">跟进人</label>
                    <input type="text" name="follower" value="${process.data.follower || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessFollower(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">处理周期（天）</label>
                    <input type="number" name="process_cycle" value="${process.data.cycle || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessCycle(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">必要资料</label>
                    <div class="mt-2 space-y-4">
                        <div class="flex items-center justify-between">
                            <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="window.location.href='material-management.html'">
                                <i class="fas fa-plus mr-1"></i>创建新资料
                            </button>
                        </div>
                        <div class="mt-2 space-y-4">
                            ${getMaterialList(process)}
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'confirmation':
            formContent = `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节名称</label>
                    <input type="text" name="process_name" value="${process.name || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessName(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节说明</label>
                    <textarea name="process_description" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateProcessDescription(this.value)">${process.data.description || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">跟进人</label>
                    <input type="text" name="follower" value="${process.data.follower || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessFollower(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">确认方</label>
                    <select name="confirmer" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onchange="updateConfirmer(this.value)">
                        <option value="">请选择确认方</option>
                        ${getCustomerOptions(process.data.confirmer)}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">处理周期（天）</label>
                    <input type="number" name="process_cycle" value="${process.data.cycle || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessCycle(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">确认凭证说明</label>
                    <textarea name="confirmation_proof" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateConfirmationProof(this.value)">${process.data.confirmationProof || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">自动确认</span>
                        <button type="button" 
                                class="${process.data.autoConfirmation ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                role="switch"
                                aria-checked="${process.data.autoConfirmation}"
                                onclick="toggleAutoConfirmation(this)">
                            <span class="${process.data.autoConfirmation ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                    </label>
                </div>
                <div class="mb-4 ${process.data.autoConfirmation ? '' : 'hidden'}" id="dependencySection">
                    <label class="block text-sm font-medium text-gray-700">依赖环节</label>
                    <div class="mt-2 space-y-2">
                        ${getDependencyList(process)}
                    </div>
                </div>
            `;
            break;
        case 'customer':
            formContent = `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节名称</label>
                    <input type="text" name="process_name" value="${process.name || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessName(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节说明</label>
                    <textarea name="process_description" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateProcessDescription(this.value)">${process.data.description || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">跟进人</label>
                    <input type="text" name="follower" value="${process.data.follower || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessFollower(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">处理周期（天）</label>
                    <input type="number" name="process_cycle" value="${process.data.cycle || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessCycle(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">完成凭证</label>
                    <textarea name="completion_proof" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateCompletionProof(this.value)">${process.data.completionProof || ''}</textarea>
                </div>
                <div class="mt-6">
                    <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="previewCustomerSystemGuide()">
                        <i class="fas fa-eye mr-1"></i>客户系统操作说明
                    </button>
                </div>
            `;
            break;
        case 'stamp':
            formContent = `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节名称</label>
                    <input type="text" name="process_name" value="${process.name || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessName(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">环节说明</label>
                    <textarea name="process_description" 
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onchange="updateProcessDescription(this.value)">${process.data.description || ''}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">跟进人</label>
                    <input type="text" name="follower" value="${process.data.follower || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessFollower(this.value)">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">处理周期（天）</label>
                    <input type="number" name="process_cycle" value="${process.data.cycle || ''}" 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                           onchange="updateProcessCycle(this.value)">
                </div>
                <div class="mt-6 space-y-4">
                    <div>
                        <a href="#" class="text-blue-600 hover:text-blue-800 text-sm block">
                            <i class="fas fa-link mr-1"></i>打印机链接扫描说明
                        </a>
                    </div>
                    <div>
                        <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="previewStampGuide()">
                            <i class="fas fa-eye mr-1"></i>用章申请说明
                        </button>
                    </div>
                </div>
            `;
            break;
    }

    const propertyContent = document.createElement('div');
    propertyContent.className = 'property-content';
    propertyContent.innerHTML = `
        <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">${getProcessTypeName(process.type)}</h3>
            <form id="processPropertyForm">
                ${formContent}
            </form>
        </div>
    `;

    const existingContent = propertyPanel.querySelector('.property-content');
    if (existingContent) {
        existingContent.remove();
    }

    propertyPanel.appendChild(propertyContent);
}

// 更新环节名称
function updateProcessName(name) {
    if (selectedProcess !== null) {
        processes[selectedProcess].name = name;
        renderProcesses();
    }
}

// 更新环节说明
function updateProcessDescription(description) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.description = description;
        renderProcesses();
    }
}

// 更新跟进人
function updateProcessFollower(follower) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.follower = follower;
        renderProcesses();
    }
}

// 更新处理周期
function updateProcessCycle(cycle) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.cycle = cycle;
        renderProcesses();
    }
}

// 预览客户系统操作说明
function previewCustomerSystemGuide() {
    // TODO: 实现客户系统操作说明的预览功能
    alert('客户系统操作说明预览功能待实现');
}

// 预览PMS操作说明
function previewPMSGuide() {
    // TODO: 实现PMS操作说明的预览功能
    alert('PMS操作说明预览功能待实现');
}

// 预览用章申请说明
function previewStampGuide() {
    // TODO: 实现用章申请说明的预览功能
    alert('用章申请说明预览功能待实现');
}

// 初始化事件监听
function initializeEventListeners() {
    // 流程区域点击事件
    const processContainer = document.getElementById('processContainer');
    processContainer.addEventListener('click', (e) => {
        // 如果点击的是空白区域
        if (e.target === processContainer || e.target.classList.contains('process-placeholder')) {
            deselectProcess();
        }
    });

    // 重置按钮点击事件
    const resetButton = document.getElementById('resetFlow');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('确定要重置流程吗？所有环节将被清空。')) {
                processes = [];
                selectedProcess = null;
                renderProcesses();
            }
        });
    }

    // 保存按钮点击事件
    const saveButton = document.getElementById('saveFlow');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // TODO: 实现保存逻辑
            alert('保存功能待实现');
        });
    }
}

// 取消所有环节的选中状态
function deselectAllProcesses() {
    // 移除所有环节的选中样式
    const selectedCards = document.querySelectorAll('.process-item-card');
    selectedCards.forEach(card => {
        const index = parseInt(card.dataset.index);
        if (index >= 0 && index < processes.length) {
            const type = processes[index].type;
            card.classList.remove('border-2', getProcessSelectedBgClass(type), getProcessSelectedBorderClass(type));
            card.classList.add(getProcessBgClass(type), getProcessBorderClass(type));
        }
    });
    
    // 重置选中索引
    selectedProcess = null;
}

// 选择流程
function selectProcess(index) {
    if (index === selectedProcess) {
        deselectProcess();
        return;
    }
    
    // 先取消所有环节的选中状态
    deselectAllProcesses();
    
    // 更新选中的索引
    selectedProcess = index;
    
    // 添加新的选中样式
    const processCard = document.querySelector(`.process-item-card[data-index="${index}"]`);
    if (processCard) {
        const type = processes[index].type;
        processCard.classList.remove(getProcessBgClass(type), getProcessBorderClass(type));
        processCard.classList.add('border-2', getProcessSelectedBgClass(type), getProcessSelectedBorderClass(type));
    }
    
    // 显示属性面板
    showPropertyPanel(processes[index]);
}

// 取消选择流程
function deselectProcess() {
    deselectAllProcesses();
    showTemplateInfoForm();
}

// 删除环节
function deleteProcess(index) {
    if (confirm('确定要删除这个环节吗？')) {
        processes.splice(index, 1);
        // 如果删除的是当前选中的环节，取消选中状态
        if (selectedProcess === index) {
            deselectProcess();
        } else if (selectedProcess > index) {
            // 如果删除的是当前选中环节之前的环节，更新选中索引
            selectedProcess--;
        }
        renderProcesses();
    }
}

// 获取资料列表
function getMaterialList(process) {
    const materials = [
        {
            name: '广告费结算单-盖章扫描件',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/ad-fee-settlement.pdf'
        },
        {
            name: '服务费结算单-盖章扫描件',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/service-fee-settlement.pdf'
        },
        {
            name: '广告费结算单-excel',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/ad-fee-settlement.xlsx'
        },
        {
            name: '服务费结算单-excel',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/service-fee-settlement.xlsx'
        },
        {
            name: '季度PO-盖章扫描件',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/quarterly-po.pdf'
        },
        {
            name: '年度合同--盖章扫描件',
            acquisition: '从客户处获取',
            example: 'settlement-template/examples/annual-contract.pdf'
        }
    ];

    return materials.map(material => `
        <div class="bg-white rounded-lg border border-gray-200 p-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">${material.name}</span>
                <input type="radio" name="material_list" value="${material.name}" 
                       class="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       ${process.data.material === material.name ? 'checked' : ''}
                       onchange="updateMaterialList(this)">
            </div>
            <div class="text-xs text-gray-500 mb-2">获取方式：${material.acquisition}</div>
            <div class="flex items-center">
                <button class="text-blue-600 hover:text-blue-800 text-xs" onclick="previewMaterial('${material.example}')">
                    <i class="fas fa-eye mr-1"></i>查看样例
                </button>
            </div>
        </div>
    `).join('');
}

// 更新资料列表
function updateMaterialList(radio) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.material = radio.value;
        renderProcesses();
    }
}

// 获取依赖环节复选框
function getDependencyCheckboxes(process) {
    const dependencies = [
        { value: '湖南结算资料', type: '资料' },
        { value: '合同', type: '资料' },
        { value: 'Owen确认', type: '确认' },
        { value: '客户系统结算', type: '系统' },
        { value: '结算单', type: '资料' },
        { value: 'BUPO', type: '资料' },
        { value: 'Owen结算确认邮件', type: '确认' },
        { value: '资源位截图', type: '资料' }
    ];

    return dependencies.map(dep => `
        <label class="inline-flex items-center">
            <input type="checkbox" name="dependency" value="${dep.value}" 
                   class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                   ${process.data.dependencies?.includes(dep.value) ? 'checked' : ''}
                   onchange="updateProcessDependencies(this)">
            <span class="ml-2 text-sm text-gray-700">
                <span class="inline-block px-2 py-1 text-xs rounded-full ${getDependencyTypeClass(dep.type)}">${dep.type}</span>
                ${dep.value}
            </span>
        </label>
    `).join('');
}

// 获取依赖类型样式类
function getDependencyTypeClass(type) {
    switch (type) {
        case '资料': return 'bg-blue-100 text-blue-800';
        case '确认': return 'bg-green-100 text-green-800';
        case '系统': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// 更新依赖环节
function updateProcessDependencies(checkbox) {
    if (selectedProcess !== null) {
        if (!processes[selectedProcess].data.dependencies) {
            processes[selectedProcess].data.dependencies = [];
        }
        
        if (checkbox.checked) {
            processes[selectedProcess].data.dependencies.push(checkbox.value);
        } else {
            const index = processes[selectedProcess].data.dependencies.indexOf(checkbox.value);
            if (index > -1) {
                processes[selectedProcess].data.dependencies.splice(index, 1);
            }
        }
        
        renderProcesses();
    }
}

// 获取依赖环节列表
function getDependencyList(process) {
    const dependencies = [
        { name: '季度合同', type: 'material' },
        { name: 'BUPO', type: 'material' },
        { name: '结算单', type: 'material' },
        { name: '结案报告', type: 'material' }
    ];

    return dependencies.map(dep => `
        <div class="bg-white rounded-lg border border-gray-200 p-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <span class="process-icon ${getProcessIconClass(dep.type)} mr-2">
                        <i class="${getProcessIcon(dep.type)}"></i>
                    </span>
                    <span class="text-sm font-medium">${dep.name}</span>
                </div>
                <input type="checkbox" name="dependency" value="${dep.name}" 
                       class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       ${process.data.dependencies?.includes(dep.name) ? 'checked' : ''}
                       onchange="updateProcessDependencies(this)">
            </div>
        </div>
    `).join('');
}

// 更新确认凭证说明
function updateConfirmationProof(value) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.confirmationProof = value;
        renderProcesses();
    }
}

// 获取客户选项
function getCustomerOptions(selectedValue) {
    const customers = [
        { id: 1, name: 'Owen', position: '总部结算经理', entity: '总部' },
        { id: 2, name: '李四', position: '结算专员', entity: '湖南大区' }
    ];

    return customers.map(customer => `
        <option value="${customer.id}" ${selectedValue === customer.id ? 'selected' : ''}>
            ${customer.name} - ${customer.position} (${customer.entity})
        </option>
    `).join('');
}

// 更新确认方
function updateConfirmer(value) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.confirmer = value;
        renderProcesses();
    }
}

// 切换自动确认状态
function toggleAutoConfirmation(button) {
    if (selectedProcess !== null) {
        const isChecked = button.getAttribute('aria-checked') === 'true';
        const newState = !isChecked;
        
        button.setAttribute('aria-checked', newState);
        button.classList.toggle('bg-blue-600', newState);
        button.classList.toggle('bg-gray-200', !newState);
        
        const span = button.querySelector('span');
        span.classList.toggle('translate-x-5', newState);
        span.classList.toggle('translate-x-0', !newState);
        
        processes[selectedProcess].data.autoConfirmation = newState;
        
        const dependencySection = document.getElementById('dependencySection');
        if (dependencySection) {
            dependencySection.classList.toggle('hidden', !newState);
        }
        
        renderProcesses();
    }
}

// 更新完成凭证
function updateCompletionProof(value) {
    if (selectedProcess !== null) {
        processes[selectedProcess].data.completionProof = value;
        renderProcesses();
    }
}

// 其他函数保持不变...
// ... existing code ... 