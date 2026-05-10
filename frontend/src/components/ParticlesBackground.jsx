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
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: window.innerWidth > 768, // Disable hover effect on touch devices
            mode: 'bubble',
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          bubble: {
            distance: 200,
            size: 15,
            duration: 2,
            opacity: 0.8,
          },
        },
      },
      particles: {
        color: {
          value: ['#08D7FB', '#2AA9F2', '#635EEA'],
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
          speed: 0.6, // Slower speed = less CPU
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1200, // Increase area = fewer particles per pixel
          },
          value: window.innerWidth > 768 ? 30 : 15, // Fewer on mobile
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: ['circle', 'triangle', 'polygon'],
          options: {
            polygon: {
              sides: 6
            }
          }
        },
        size: {
          value: { min: 4, max: 10 },
        },
      },
      detectRetina: false, // Save 2x processing
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
