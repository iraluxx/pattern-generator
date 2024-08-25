document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const colorInputs = [
        document.getElementById('color1'),
        document.getElementById('color2'),
        document.getElementById('color3'),
        document.getElementById('color4')
    ];
    const generateButton = document.getElementById('generate');
    const downloadButton = document.getElementById('download');
    const gradientPreview = document.getElementById('gradient-preview');
    const ctx = gradientPreview.getContext('2d');

    // Set canvas size to match iPhone 13 aspect ratio
    const canvasWidth = 300;
    const canvasHeight = 650;
    gradientPreview.width = canvasWidth;
    gradientPreview.height = canvasHeight;

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    function generatePattern() {
        document.getElementById('loadingIndicator').style.display = 'block';
        
        setTimeout(() => {
            console.log('Generating pattern');
            const colors = colorInputs.map(input => input.value);
            console.log('Colors:', colors);

            // Clear previous content
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Create color blobs
            const numBlobs = 30;
            const blobs = [];

            // Ensure each color is used at least once
            colors.forEach(color => {
                blobs.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    radius: Math.random() * 200 + 100,
                    color: color
                });
            });

            // Add remaining random blobs
            for (let i = colors.length; i < numBlobs; i++) {
                blobs.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    radius: Math.random() * 200 + 100,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }

            // Draw blobs with improved blending
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

            // Apply subtle texture
            const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 15;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
            }
            ctx.putImageData(imageData, 0, 0);

            document.getElementById('loadingIndicator').style.display = 'none';
            console.log('Pattern generation complete');
        }, 0);
    }

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

    const debouncedGeneratePattern = debounce(generatePattern, 300);

    colorInputs.forEach(input => {
        input.addEventListener('change', debouncedGeneratePattern);
    });

    generateButton.addEventListener('click', generatePattern);

    downloadButton.addEventListener('click', function() {
        const dataUrl = gradientPreview.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'tie-dye-pattern.png';
        link.href = dataUrl;
        link.click();
    });

    // Initial generation
    generatePattern();
});

document.addEventListener('DOMContentLoaded', function() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        const hexSpan = input.nextElementSibling;
        
        // Update hex value on initial load
        hexSpan.textContent = input.value;
        
        // Update hex value when color changes
        input.addEventListener('input', function() {
            hexSpan.textContent = this.value;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate');
    let isFirstClick = true;

    generateButton.addEventListener('click', function() {
        if (isFirstClick) {
            generateButton.textContent = 'generate again!';
            isFirstClick = false;
        }
        
        // Your existing code to generate the pattern goes here
        generatePattern();
    });

    function generatePattern() {
        // Your existing pattern generation code
        // ...
    }

    // Rest of your JavaScript code
    // ...
});