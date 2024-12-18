document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.querySelector('.preview-container');

    let originalImage = null;
    let originalFileSize = 0;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件拖拽处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processFile(file);
        }
    });

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    });

    // 质量滑块处理
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage(originalImage);
        }
    });

    // 处理上传的文件
    function processFile(file) {
        const reader = new FileReader();
        originalFileSize = file.size;
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                originalPreview.src = e.target.result;
                originalSize.textContent = formatFileSize(originalFileSize);
                compressImage(originalImage);
                previewContainer.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        // 获取最低质量（1%）时的文件大小
        const minQualityDataUrl = canvas.toDataURL('image/jpeg', 0.01);
        const minSize = Math.round((minQualityDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        
        // 计算当前质量下应该对应的文件大小
        const currentQuality = quality.value / 100;
        const targetSize = minSize + (originalFileSize - minSize) * currentQuality;
        
        // 二分查找接近目标大小的质量值
        let left = 0.01;
        let right = 1;
        let bestQuality = left;
        let bestDataUrl = minQualityDataUrl;
        
        while (left <= right) {
            const mid = (left + right) / 2;
            const testDataUrl = canvas.toDataURL('image/jpeg', mid);
            const testSize = Math.round((testDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
            
            if (Math.abs(testSize - targetSize) < Math.abs(Math.round((bestDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4) - targetSize)) {
                bestQuality = mid;
                bestDataUrl = testDataUrl;
            }
            
            if (testSize < targetSize) {
                left = mid + 0.01;
            } else {
                right = mid - 0.01;
            }
        }
        
        // 使用找到的最佳质量值
        if (quality.value === '100') {
            compressedPreview.src = originalImage.src;
            document.getElementById('compressedSize').textContent = formatFileSize(originalFileSize);
        } else {
            compressedPreview.src = bestDataUrl;
            const finalSize = Math.round((bestDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
            document.getElementById('compressedSize').textContent = formatFileSize(finalSize);
        }
        
        // 设置下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed_image.jpg';
            link.href = compressedPreview.src;
            link.click();
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 