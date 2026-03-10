import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { SLICE_COLORS, THEME } from '../constants/colors';

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 8;

function truncate(text, max = 12) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function slicePath(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function getTextColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#333333' : '#FFFFFF';
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const SpinningWheel = forwardRef(({ options }, ref) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0);
  const isSpinning = useRef(false);

  useImperativeHandle(ref, () => ({
    spin(onComplete) {
      if (isSpinning.current) return;
      isSpinning.current = true;

      const extraRotations = 5 + Math.random() * 5;
      const extraDegrees = extraRotations * 360 + Math.random() * 360;
      const newTotal = totalRotation.current + extraDegrees;

      Animated.timing(spinAnim, {
        toValue: newTotal,
        duration: 4000 + Math.random() * 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        totalRotation.current = newTotal;
        isSpinning.current = false;

        const sliceDeg = 360 / options.length;
        const normalized = ((270 - (newTotal % 360)) % 360 + 360) % 360;
        const index = Math.floor(normalized / sliceDeg) % options.length;
        onComplete(options[index]);
      });
    },
    reset() {
      spinAnim.setValue(0);
      totalRotation.current = 0;
      isSpinning.current = false;
    },
  }));

  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const n = options.length;
  const sliceAngle = (2 * Math.PI) / n;

  return (
    <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      <AnimatedSvg
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        style={{ transform: [{ rotate }] }}
      >
        {options.map((option, i) => {
          const startAngle = i * sliceAngle - Math.PI / 2;
          const endAngle = startAngle + sliceAngle;
          const midAngle = startAngle + sliceAngle / 2;
          const color = SLICE_COLORS[i % SLICE_COLORS.length];
          const textColor = getTextColor(color);
          const textR = RADIUS * 0.62;
          const tx = CENTER + textR * Math.cos(midAngle);
          const ty = CENTER + textR * Math.sin(midAngle);
          const labelDeg = (midAngle * 180) / Math.PI + 90;

          return (
            <React.Fragment key={i}>
              <Path
                d={slicePath(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                fill={color}
                stroke={THEME.white}
                strokeWidth={2}
              />
              <SvgText
                x={tx}
                y={ty}
                fontSize={n > 6 ? 11 : 13}
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
                alignmentBaseline="middle"
                rotation={labelDeg}
                originX={tx}
                originY={ty}
              >
                {truncate(option, n > 6 ? 10 : 12)}
              </SvgText>
            </React.Fragment>
          );
        })}
        <Circle cx={CENTER} cy={CENTER} r={18} fill={THEME.white} />
      </AnimatedSvg>
    </View>
  );
});

export default SpinningWheel;
