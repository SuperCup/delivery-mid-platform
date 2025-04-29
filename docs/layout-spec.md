# 布局规范文档

## 页面整体布局

系统采用固定宽度布局，最小宽度1920px，主要分为四个区域：导航栏、菜单栏、客户栏和功能区。

## 1. 导航栏 (Navigation Bar)

位置：页面最顶部
- 宽度：1920px
- 高度：80px
- 背景色：白色 (bg-white)
- 边框：底部边框 (border-b border-gray-200)
- 定位：固定定位 (fixed)
- z-index：50

### 导航栏内容
- 左侧标题：
  - 文字：业务中台
  - 颜色：#FF673C
  - 字体大小：text-xl
  - 字重：font-bold

- 右侧用户信息：
  - 头像：圆形，40px x 40px (w-8 h-8)
  - 背景色：bg-gray-100
  - 图标颜色：text-gray-500
  - 用户名文字颜色：text-gray-600

## 2. 菜单栏 (Menu Bar)

位置：页面左侧
- 宽度：254px
- 高度：calc(100vh - 80px)
- 起始位置：top-[80px]
- 背景色：白色 (bg-white)
- 边框：右侧边框 (border-r border-gray-200)
- 定位：固定定位 (fixed)

### 菜单项
- 高度：60px
- 内边距：px-6
- 悬停效果：
  - 背景色：#D7E5FF
  - 文字颜色：#005EFF
- 选中状态：
  - 背景色：#D7E5FF
  - 文字颜色：#005EFF

## 3. 客户栏 (Customer Bar)

位置：菜单栏右侧
- 宽度：354px
- 高度：calc(100vh - 80px)
- 起始位置：left-[254px] top-[80px]
- 内边距：px-[25px]

### 客户栏内容
- 标题：
  - 文字大小：text-xl
  - 字重：font-bold
  - 下边距：mb-6

- 搜索框：
  - 宽度：100%
  - 内边距：pl-10 pr-4 py-2
  - 边框：border border-gray-300
  - 圆角：rounded-md

- 客户卡片：
  - 宽度：304px
  - 高度：64px
  - 背景色：白色
  - 圆角：rounded-lg
  - 阴影：hover:shadow-md
  - 间距：space-y-3

## 4. 功能区 (Content Area)

功能区有两种布局规格，取决于页面是否包含客户栏：

### 标准布局（包含客户栏）
位置：客户栏右侧
- 左边距：ml-[608px]（菜单栏254px + 客户栏354px）
- 顶部边距：pt-[80px]
- 内边距：p-6

### 宽屏布局（不包含客户栏）
位置：菜单栏右侧
- 左边距：ml-[254px]（仅菜单栏宽度）
- 顶部边距：pt-[80px]
- 内边距：p-6

### 白色容器
根据布局类型有两种尺寸规格：
1. 标准尺寸（有客户栏）：
   - 宽度：1292px
   - 高度：912px

2. 宽屏尺寸（无客户栏）：
   - 宽度：1621px
   - 高度：912px

共同样式：
- 背景色：白色
- 圆角：rounded-lg
- 阴影：shadow-lg

### 功能区内容布局
- 标题：
  - 字重：font-bold
  - 大小：text-lg
  - 下边距：mb-4

- 搜索和操作区：
  - 搜索框宽度：300px
  - 按钮间距：space-x-3
  - 下边距：mb-4

- 统计卡片：
  - 布局：grid grid-cols-4
  - 间距：gap-4
  - 下边距：mb-4

- 表格区域：
  - 边框：border border-gray-200
  - 圆角：rounded-lg

## 颜色规范

- 主题色：
  - 蓝色：#005EFF（按钮、链接）
  - 橙色：#FF673C（logo）
  
- 背景色：
  - 白色：#FFFFFF
  - 浅灰：#F9FAFB
  - 选中蓝：#D7E5FF

- 文字颜色：
  - 主要文字：text-gray-900
  - 次要文字：text-gray-600
  - 提示文字：text-gray-500

## 交互规范

- 按钮悬停效果：
  - 主要按钮：hover:bg-blue-700
  - 次要按钮：hover:bg-blue-50
  
- 菜单项悬停效果：
  - 背景：hover:bg-[#D7E5FF]
  - 文字：hover:text-[#005EFF]

- 卡片悬停效果：
  - 阴影：hover:shadow-md
  - 位移：transform: translateY(-2px)

## 响应式设计

当前系统采用固定宽度设计，最小宽度1920px，暂不支持响应式布局。如需添加响应式支持，请在此规范基础上进行扩展。 