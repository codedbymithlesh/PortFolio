import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = React.memo(() => {
  const particlesInit = useCallback(async (engine) => {
    // loadSlim loads the slim version of tsParticles which includes the most common features
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    return {
      // ... existing options ...
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60, // Better for battery and performance
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: ['push', 'repulse'],
          },
          onHover: {
            enable: window.innerWidth > 768,
            mode: ['grab', 'bubble'],
          },
        },
        modes: {
          push: {
            quantity: 4, // Reduced for performance
          },
          bubble: {
            distance: 250,
            size: 10,
            duration: 2,
            opacity: 0.9,
          },
          grab: {
            distance: 250,
            links: {
              opacity: 0.4,
            },
          },
          repulse: {
            distance: 300,
            duration: 0.4,
          }
        },
      },
      particles: {
        color: {
          value: ['#DC2626', '#F87171', '#D97706', '#FCD34D', '#ffffff'],
        },
        links: {
          enable: window.innerWidth > 768, // Disable links on mobile for a cleaner look
          distance: 180,
          color: '#ffffff',
          opacity: 0.1,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: true,
          speed: 1.0, // Slightly slower for smoother feel
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1200, // Larger area = less density
          },
          value: window.innerWidth > 768 ? 45 : 20, // Adaptive count
        },
        opacity: {
          value: window.innerWidth > 768 ? { min: 0.05, max: 0.15 } : { min: 0.1, max: 0.3 }, // More visible on mobile
          animation: {
            enable: window.innerWidth > 768, // Disable animation on mobile
            speed: 0.5,
            sync: false,
          }
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: window.innerWidth > 768 ? { min: 1, max: 3 } : { min: 0.5, max: 1.5 }, // Smaller, sharper dots for mobile
          animation: {
            enable: window.innerWidth > 768, // Disable animation on mobile
            speed: 2,
            sync: false,
          }
        },
      },
      detectRetina: true,
      style: {
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }
    };
  }, []);

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
});

export default ParticlesBackground;
