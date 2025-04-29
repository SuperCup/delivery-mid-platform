// 打开指引抽屉
function openGuidanceDrawer(stepName) {
    const drawer = document.getElementById('guidanceDrawer');
    const content = document.getElementById('guidanceContent');
    
    // 根据环节名称生成指引内容
    content.innerHTML = getGuidanceContent(stepName);
    
    drawer.classList.remove('translate-x-full');
}

// 关闭指引抽屉
function closeGuidanceDrawer() {
    const drawer = document.getElementById('guidanceDrawer');
    drawer.classList.add('translate-x-full');
}

// 获取指引内容
function getGuidanceContent(stepName) {
    switch (stepName) {
        case 'PO':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">PO文档是采购订单的正式文件，用于记录采购交易的具体信息。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料获取方式</h4>
                        <p class="text-gray-600">1. 从采购系统导出PO文档<br>2. 联系采购部门获取PO文件<br>3. 从供应商处获取PO确认文件</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料员样例</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('PO样例.xlsx')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-file-excel text-green-500 mr-1"></i>
                                PO样例.xlsx
                            </a>
                        </div>
                    </div>
                </div>
            `;
        case '合同':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">合同文件是双方达成协议的法律文件，需要包含完整的合同内容和签字盖章。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料获取方式</h4>
                        <p class="text-gray-600">1. 从法务部门获取合同原件<br>2. 从档案室调取合同副本<br>3. 联系供应商获取合同扫描件</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料员样例</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('合同样例.pdf')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-file-pdf text-red-500 mr-1"></i>
                                合同样例.pdf
                            </a>
                        </div>
                    </div>
                </div>
            `;
        case '核销明细':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">核销明细文件记录了费用核销的具体信息，需要包含完整的核销数据和证明文件。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料获取方式</h4>
                        <p class="text-gray-600">1. 从财务系统导出核销明细<br>2. 联系财务部门获取核销文件<br>3. 从供应商处获取核销确认</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料员样例</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('核销明细样例.xlsx')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-file-excel text-green-500 mr-1"></i>
                                核销明细样例.xlsx
                            </a>
                        </div>
                    </div>
                </div>
            `;
        case '资源位截图':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">资源位截图用于证明广告投放的位置和效果，需要包含完整的资源位信息。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料获取方式</h4>
                        <p class="text-gray-600">1. 从广告平台截图<br>2. 现场拍摄资源位照片<br>3. 从供应商处获取投放证明</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">资料员样例</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('资源位截图样例.jpg')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-file-image text-blue-500 mr-1"></i>
                                资源位截图样例.jpg
                            </a>
                        </div>
                    </div>
                </div>
            `;
        case '总部Owen确认':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">总部确认环节需要Owen对结算金额进行最终确认。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">确认方</h4>
                        <p class="text-gray-600">总部结算经理 Owen</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">确认方式</h4>
                        <p class="text-gray-600">1. 邮件确认<br>2. 系统确认<br>3. 书面确认</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">确认模板</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('确认邮件模板.eml')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-envelope text-yellow-500 mr-1"></i>
                                确认邮件模板.eml
                            </a>
                        </div>
                    </div>
                </div>
            `;
        case 'TM上传资料':
            return `
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">环节说明</h4>
                        <p class="text-gray-600">TM系统资料上传环节需要将结算资料上传至TM系统。</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">操作说明</h4>
                        <div class="mt-2">
                            <a href="#" onclick="previewFile('TM系统操作指南.pdf')" class="text-blue-600 hover:text-blue-800 flex items-center">
                                <i class="far fa-file-pdf text-red-500 mr-1"></i>
                                TM系统操作指南.pdf
                            </a>
                        </div>
                    </div>
                </div>
            `;
        default:
            return '<p class="text-gray-600">暂无指引信息</p>';
    }
} 