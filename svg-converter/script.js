document.addEventListener('DOMContentLoaded', () => {
    // --- Element Refs ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const selectFileButton = document.getElementById('select-file-button');
    const svgInput = document.getElementById('svg-input');
    const previewArea = document.getElementById('preview-area');
    const convertButton = document.getElementById('convert-button');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValue = document.getElementById('scale-value');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const transparentBg = document.getElementById('transparent-bg');
    // Modal refs
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const errorOkButton = document.getElementById('error-ok-button');

    // --- State ---
    let loadedSvgData = null;

    // --- Functions ---
    
    // Custom error display
    function showError(message) {
        errorMessage.textContent = message;
        errorModal.style.display = 'flex';
    }

    // Handles file selection (from drop or input)
    function handleFile(file) {
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadedSvgData = e.target.result;
                svgInput.value = loadedSvgData;
                updatePreview(loadedSvgData);
            };
            reader.readAsText(file);
        } else {
            showError('请上传有效的 SVG 文件！');
        }
    }

    // Updates the preview area with SVG content
    function updatePreview(svgString) {
        if (svgString) {
            previewArea.innerHTML = svgString;
        } else {
            previewArea.innerHTML = '<p>选择文件后将显示预览</p>';
        }
    }

    // The main conversion and download logic
    async function convertAndDownload() {
        if (!loadedSvgData) {
            showError('请先上传或粘贴 SVG 代码。');
            return;
        }

        const format = document.querySelector('input[name="format"]:checked').value;
        const quality = qualitySlider.value / 10;
        const scale = parseFloat(scaleSlider.value);

        try {
            // 1. 将 SVG 字符串转成 Blob，再生成本地 URL
            const blob = new Blob([loadedSvgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // 2. 创建 Image 对象并加载上面的 URL
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const cssWidth = img.width * scale;
                const cssHeight = img.height * scale;

                canvas.width = cssWidth;
                canvas.height = cssHeight;
                const ctx = canvas.getContext('2d');

                // 背景
                if (format !== 'png' || !transparentBg.checked) {
                    ctx.fillStyle = bgColorPicker.value;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 3. 导出数据并下载
                const dataUrl = canvas.toDataURL(`image/${format}`, quality);
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `converted-${Date.now()}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                showError('SVG 渲染失败，请确认您的 SVG 代码是否有效。');
            };
            img.src = url;
        } catch (err) {
            console.error(err);
            showError(`转换失败: ${err.message}`);
        }
    }

    // --- Event Listeners ---
    
    // Close modal
    errorOkButton.addEventListener('click', () => {
        errorModal.style.display = 'none';
    });

    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // File Drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // File Select Button
    selectFileButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    
    // SVG code paste
    svgInput.addEventListener('input', () => {
        loadedSvgData = svgInput.value;
        updatePreview(loadedSvgData);
    });

    // Settings listeners
    qualitySlider.addEventListener('input', (e) => qualityValue.textContent = e.target.value);
    scaleSlider.addEventListener('input', (e) => scaleValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`);
    transparentBg.addEventListener('change', () => {
        bgColorPicker.disabled = transparentBg.checked;
    });

    // Convert button
    convertButton.addEventListener('click', convertAndDownload);

    // Initial load
    if (svgInput.value) {
        loadedSvgData = svgInput.value;
        updatePreview(loadedSvgData);
    }
}); 