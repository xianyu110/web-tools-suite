document.addEventListener('DOMContentLoaded', function () {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');
    
    const wordButton = document.getElementById('word-button');
    const copyHtmlButton = document.getElementById('copy-html-button');
    const summarizeButton = document.getElementById('summarize-button');
    const clearButton = document.getElementById('clear-button');

    // 使用 marked.js 进行实时预览
    markdownInput.addEventListener('input', function() {
        const markdownText = markdownInput.value;
        htmlPreview.innerHTML = marked.parse(markdownText);
    });

    // 下载 Word 文档功能
    wordButton.addEventListener('click', function() {
        const markdownText = markdownInput.value;
        if (!markdownText.trim()) {
            alert('内容为空，无法生成 Word 文档。');
            return;
        }
        try {
            const htmlContent = marked.parse(markdownText);
            const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`;
            const blob = htmlDocx.asBlob(fullHtml);

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-content-${Date.now()}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Word 文档生成失败:', error);
            alert('抱歉，生成 Word 文档时发生错误。');
        }
    });

    // 复制 HTML 功能
    copyHtmlButton.addEventListener('click', function() {
        const htmlContent = htmlPreview.innerHTML;
        if (!htmlContent.trim()) {
            alert('没有内容可以复制。');
            return;
        }
        navigator.clipboard.writeText(htmlContent).then(function() {
            alert('HTML 已成功复制到剪贴板！');
        }, function(err) {
            console.error('复制失败: ', err);
            alert('抱歉，复制失败。您的浏览器可能不支持此操作。');
        });
    });

    // 清空功能
    clearButton.addEventListener('click', function() {
        markdownInput.value = '';
        htmlPreview.innerHTML = '';
    });
    
    // 智能摘要 (Pro 功能占位)
    summarizeButton.addEventListener('click', function() {
        alert('“智能摘要”是一项高级功能，需要连接到后端 AI 服务。在当前的纯前端版本中尚不可用。');
    });

    // 初始触发一次，以防有默认值
    if(markdownInput.value) {
        htmlPreview.innerHTML = marked.parse(markdownInput.value);
    }
}); 