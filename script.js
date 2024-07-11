document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const colorInputs = [
        document.getElementById('color1'),
        document.getElementById('color2'),
        document.getElementById('color3'),
        document.getElementById('color4')
    ];
    const generateButton = document.getElementById('generate');
    const gradientPreview = document.getElementById('gradient-preview');
    const ctx = gradientPreview.getContext('2d');

    // Set canvas size to match iPhone 13 aspect ratio
    const canvasWidth = 300;
    const canvasHeight = 650;
    gradientPreview.width = canvasWidth;
    gradientPreview.height = canvasHeight;

    function generatePattern() {
        console.log('Generating pattern');
        const colors = colorInputs.map(input => input.value);
        console.log('Colors:', colors);

        // Clear previous content
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Create color blobs
        const numBlobs = 15; // Increased for more variation
        const blobs = [];

        for (let i = 0; i < numBlobs; i++) {
            blobs.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                radius: Math.random() * 200 + 100, // Increased radius range
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Draw blobs with smoother edges
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                let totalInfluence = 0;
                let r = 0, g = 0, b = 0;

                blobs.forEach(blob => {
                    const dx = x - blob.x;
                    const dy = y - blob.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    // Smoother falloff function
                    const influence = Math.pow(Math.max(0, 1 - distance / blob.radius), 2);
                    totalInfluence += influence;

                    const [br, bg, bb] = hexToRgb(blob.color);
                    r += br * influence;
                    g += bg * influence;
                    b += bb * influence;
                });

                if (totalInfluence > 0) {
                    ctx.fillStyle = `rgb(${r/totalInfluence}, ${g/totalInfluence}, ${b/totalInfluence})`;
                } else {
                    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]; // Random color if no influence
                }
                ctx.fillRect(x, y, 1, 1);
            }
        }

        // Apply texture
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 20 - 10;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);

        console.log('Pattern generation complete');
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    generateButton.addEventListener('click', function() {
        console.log('Generate button clicked');
        generatePattern();
    });

    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('Color input changed');
            generatePattern();
        });
    });

    // Initial generation
    generatePattern();
});