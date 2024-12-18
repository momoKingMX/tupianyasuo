# 图片压缩工具

这是一个简单易用的在线图片压缩工具，具有苹果风格的界面设计。

## 功能特点

- 支持上传 PNG、JPG 格式图片
- 实时预览原图和压缩后的效果
- 可调节压缩比例
- 显示压缩前后文件大小
- 支持下载压缩后的图片
- 响应式设计，支持各种设备

## 技术实现

- 使用原生 HTML5 和 CSS3 构建界面
- 使用 JavaScript 处理图片压缩
- 采用 Flexbox 布局
- 遵循苹果设计风格 

## 压缩算法优化经验

### 文件大小线性对应问题

在实现压缩质量滑块控制时，遇到了一个重要问题：如何确保压缩质量（0-100%）与输出文件大小之间保持线性对应关系？

#### 问题描述
- 最初的实现中，当压缩质量达到中间值（约46%）时，输出文件大小就已经达到原始大小
- 这导致滑块后半段的调节失去了实际意义
- 用户无法通过滑块精确控制输出文件大小

#### 解决方案
1. 获取最低质量（1%）时的文件大小作为基准值
2. 根据当前滑块位置，计算期望的目标文件大小：
    ```javascript
    targetSize = minSize + (originalSize - minSize) * (quality / 100)
    ```
3. 使用二分查找算法寻找最接近目标大小的质量值
4. 仅在质量值为100%时使用原始图片

#### 优化效果
- 压缩质量从0%到100%，输出文件大小呈现线性增长
- 只有在100%质量时才会等于原始文件大小
- 用户可以更精确地控制压缩后的文件大小
- 提供了更好的用户体验