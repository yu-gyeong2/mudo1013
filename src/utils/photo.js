// 사진에 무한도전 스타일 워터마크/자막 합성 유틸리티

export async function processPhotoWithWatermark(fileOrDataUrl, text = '무한도전 텔레파시 상봉!', subtext = '') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0, width, height);

        // Bottom gradient for subtitle readability
        const gradHeight = Math.max(120, height * 0.22);
        const gradient = ctx.createLinearGradient(0, height - gradHeight, 0, height);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.6)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - gradHeight, width, gradHeight);

        // Subtitle (무한도전 궁서체/고딕 느낌)
        const fontSize = Math.max(24, Math.round(width * 0.045));
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const textY = height - (subtext ? fontSize * 1.2 : fontSize * 0.6);

        // Black stroke
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(4, Math.round(fontSize * 0.15));
        ctx.strokeText(text, width / 2, textY);

        // Yellow fill
        ctx.fillStyle = '#FFE800';
        ctx.fillText(text, width / 2, textY);

        if (subtext) {
          const subFontSize = Math.max(16, Math.round(fontSize * 0.65));
          ctx.font = `600 ${subFontSize}px sans-serif`;
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeText(subtext, width / 2, height - subFontSize * 0.6);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(subtext, width / 2, height - subFontSize * 0.6);
        }

        // Top-left 무한도전 엠블럼 마크
        const markSize = Math.max(36, Math.round(width * 0.08));
        ctx.save();
        ctx.beginPath();
        ctx.arc(markSize * 0.9, markSize * 0.9, markSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE800';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.font = `900 ${Math.round(markSize * 0.65)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.fillText('無', markSize * 0.9, markSize * 0.9);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        console.error('Canvas processing failed', e);
        resolve(img.src);
      }
    };
    img.onerror = (e) => reject(e);

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
