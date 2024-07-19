document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const generateButton = document.getElementById('generate');
    const downloadButton = document.getElementById('download');
    const gradientPreview = document.getElementById('gradient-preview');
    const ctx = gradientPreview.getContext('2d');

    // Set canvas size to match iPhone 13 aspect ratio
    const canvasWidth = 300;
    const canvasHeight = 650;
    gradientPreview.width = canvasWidth;
    gradientPreview.height = canvasHeight;

    let currentColorButton;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    function generatePattern() {
        console.log('Generating pattern');
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'block';

        const colors = Array.from(document.querySelectorAll('.color-button')).map(button => button.dataset.color);
        console.log('Colors:', colors);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const numBlobs = 30;
        const blobs = [];

        colors.forEach(color => {
            blobs.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                radius: Math.random() * 200 + 100,
                color: color
            });
        });

        for (let i = colors.length; i < numBlobs; i++) {
            blobs.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                radius: Math.random() * 200 + 100,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        console.log('Blobs created:', blobs.length);

        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                let totalWeight = 0;
                let r = 0, g = 0, b = 0;

                blobs.forEach(blob => {
                    const dx = x - blob.x;
                    const dy = y - blob.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    const weight = Math.pow(Math.max(0, 1 - distance / blob.radius), 2);
                    totalWeight += weight;

                    const [br, bg, bb] = hexToRgb(blob.color);
                    r += br * weight;
                    g += bg * weight;
                    b += bb * weight;
                });

                if (totalWeight > 0) {
                    ctx.fillStyle = `rgb(${Math.round(r/totalWeight)}, ${Math.round(g/totalWeight)}, ${Math.round(b/totalWeight)})`;
                } else {
                    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                }
                ctx.fillRect(x, y, 1, 1);
            }
        }

        console.log('Pattern drawn');

        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 15;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);

        console.log('Texture applied');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    const debouncedGeneratePattern = debounce(generatePattern, 300);

    document.querySelectorAll('.color-button').forEach(button => {
        button.style.backgroundColor = button.dataset.color;
        button.addEventListener('click', function() {
            currentColorButton = this;
            const colorPicker = document.getElementById('colorPicker');
            const colorPickerModal = document.getElementById('colorPickerModal');
            if (colorPicker && colorPickerModal) {
                colorPicker.value = this.dataset.color;
                colorPickerModal.style.display = 'block';
            }
        });
    });

    const doneBtn = document.getElementById('doneBtn');
    if (doneBtn) {
        doneBtn.addEventListener('click', function() {
            const colorPicker = document.getElementById('colorPicker');
            const colorPickerModal = document.getElementById('colorPickerModal');
            if (colorPicker && colorPickerModal && currentColorButton) {
                const color = colorPicker.value;
                currentColorButton.style.backgroundColor = color;
                currentColorButton.dataset.color = color;
                colorPickerModal.style.display = 'none';
                debouncedGeneratePattern();
            }
        });
    }

    window.onclick = function(event) {
        const colorPickerModal = document.getElementById('colorPickerModal');
        if (event.target == colorPickerModal) {
            colorPickerModal.style.display = 'none';
        }
    }

    if (generateButton) {
        generateButton.addEventListener('click', debouncedGeneratePattern);
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            console.log('Download button clicked');
            const dataUrl = gradientPreview.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'tie-dye-pattern.png';
            link.href = dataUrl;
            link.click();
        });
    }

    generatePattern(); // Initial generation
});