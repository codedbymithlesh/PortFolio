import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // loadSlim loads the slim version of tsParticles which includes the most common features
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    return {
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
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'bubble', // Makes them grow when hovered
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          bubble: {
            distance: 200,
            size: 20,
            duration: 2,
            opacity: 0.8,
          },
        },
      },
      particles: {
        color: {
          value: ['#08D7FB', '#2AA9F2', '#635EEA'], // Neon Blue, Bright Blue, Purple Accent
        },
        links: {
          enable: false, 
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 0.8,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 35, // Far fewer particles
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: ['circle', 'triangle', 'polygon'],
          options: {
            polygon: {
              sides: 6 // Hexagons
            }
          }
        },
        size: {
          value: { min: 4, max: 12 }, // Much larger shapes
        },
      },
      detectRetina: true,
      style: {
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }
    };
  }, []);

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
};

export default ParticlesBackground;
