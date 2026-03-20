import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const PARTICLE_COUNT = 8;
const BURST_RADIUS = 40;

export default function ParticleBurst({ x, y, color, onDone }) {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: BURST_RADIUS * (0.6 + Math.random() * 0.6),
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const anims = particles.map(p =>
      Animated.timing(p.anim, {
        toValue: 1,
        duration: 380 + Math.random() * 80,
        useNativeDriver: false,
      })
    );
    Animated.parallel(anims).start(() => onDone?.());
  }, []);

  return (
    <Svg
      style={{
        position: 'absolute',
        top: y - BURST_RADIUS * 1.5,
        left: x - BURST_RADIUS * 1.5,
        width: BURST_RADIUS * 3,
        height: BURST_RADIUS * 3,
        pointerEvents: 'none',
      }}
      pointerEvents="none"
    >
      {particles.map((p, i) => {
        const cx = BURST_RADIUS * 1.5 + Math.cos(p.angle) * p.dist * p.anim._value;
        const cy = BURST_RADIUS * 1.5 + Math.sin(p.angle) * p.dist * p.anim._value;
        // We use Animated for the radius/opacity via a native workaround
        return (
          <AnimatedParticle
            key={i}
            anim={p.anim}
            angle={p.angle}
            dist={p.dist}
            color={color}
            cx={BURST_RADIUS * 1.5}
            cy={BURST_RADIUS * 1.5}
          />
        );
      })}
    </Svg>
  );
}

function AnimatedParticle({ anim, angle, dist, color, cx, cy }) {
  // Derive position from anim value
  const [pos, setPos] = React.useState({ cx, cy, r: 5, opacity: 1 });

  React.useEffect(() => {
    const id = anim.addListener(({ value }) => {
      setPos({
        cx: cx + Math.cos(angle) * dist * value,
        cy: cy + Math.sin(angle) * dist * value,
        r: 5 * (1 - value * 0.4),
        opacity: 1 - value,
      });
    });
    return () => anim.removeListener(id);
  }, []);

  return (
    <Circle
      cx={pos.cx}
      cy={pos.cy}
      r={pos.r}
      fill={color}
      opacity={pos.opacity}
    />
  );
}
