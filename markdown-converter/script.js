document.addEventListener('DOMContentLoaded', function () {
    const convertButton = document.getElementById('convert-button');
    const clearButton = document.getElementById('clear-button');
    const markdownInput = document.getElementById('markdown-input');

    const showdownConverter = new showdown.Converter();

    convertButton.addEventListener('click', function () {
        const markdownText = markdownInput.value;
        if (!markdownText.trim()) {
            alert('请输入 Markdown 内容！');
            return;
        }

        try {
            // 1. 将 Markdown 转换为 HTML
            const htmlContent = showdownConverter.makeHtml(markdownText);
            
            // 2. 将 HTML 转换为 DOCX
            // 我们需要将HTML内容包装一下，以确保兼容性
            const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`;
            const blob = htmlDocx.asBlob(fullHtml);

            // 3. 创建下载链接并触发
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document-${Date.now()}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('转换失败:', error);
            alert('抱歉，转换过程中发生错误。请检查您的 Markdown 内容或稍后再试。');
        }
    });

    clearButton.addEventListener('click', function () {
        markdownInput.value = '';
    });
}); 