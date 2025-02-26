
import { useEffect } from 'react';

const Fireworks = () => {
  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    const createFirework = (x: number, y: number) => {
      const particleCount = 100;
      const angleIncrement = (Math.PI * 2) / particleCount;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = baseColor;
        particle.style.boxShadow = `0 0 6px ${baseColor}`;

        const angle = angleIncrement * i + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 8 + 4;
        const spread = Math.random() * 0.8 + 0.6;
        const xEnd = Math.cos(angle) * speed * 50 * spread;
        const yEnd = Math.sin(angle) * speed * 50 * spread + 50;

        particle.style.setProperty('--x-end', `${xEnd}px`);
        particle.style.setProperty('--y-end', `${yEnd}px`);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        document.body.appendChild(particle);

        particle.addEventListener('animationend', () => {
          particle.remove();
        });
      }
    };

    const launchFirework = () => {
      const startX = Math.random() * window.innerWidth;
      const endY = window.innerHeight * (Math.random() * 0.3 + 0.2);
      const endX = startX + (Math.random() * 100 - 50);

      const rising = document.createElement('div');
      rising.classList.add('rising');
      rising.style.left = `${startX}px`;
      rising.style.top = `${window.innerHeight}px`;

      document.body.appendChild(rising);

      const duration = 1000 + Math.random() * 500;
      let startTime: number | null = null;

      function animate(currentTime: number) {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          const easeOutQuad = 1 - Math.pow(1 - progress, 2);
          const currentY = window.innerHeight - (window.innerHeight - endY) * easeOutQuad;
          const currentX = startX + (endX - startX) * progress;
          
          rising.style.top = `${currentY}px`;
          rising.style.left = `${currentX}px`;
          
          requestAnimationFrame(animate);
        } else {
          rising.remove();
          createFirework(endX, endY);
        }
      }

      requestAnimationFrame(animate);
    };

    const interval = setInterval(() => {
      launchFirework();
    }, Math.random() * 1000 + 500);

    return () => {
      clearInterval(interval);
      // Clean up any remaining particles and rising elements
      document.querySelectorAll('.particle, .rising').forEach(el => el.remove());
    };
  }, []);

  return null;
};

export default Fireworks;
