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
      fpsLimit: 120,
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
            quantity: 10,
          },
          bubble: {
            distance: 250,
            size: 12,
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
          enable: true,
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
          speed: 1.2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: window.innerWidth > 768 ? 60 : 30,
        },
        opacity: {
          value: { min: 0.05, max: 0.15 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          }
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 3,
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
