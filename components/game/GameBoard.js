import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Tile from './Tile';
import ParticleBurst from '../effects/ParticleBurst';
import FloatingText from '../effects/FloatingText';
import { GRID_SIZE } from '../../constants/gameConfig';
import { TILE_COLORS } from '../../constants/colors';

const { width: SW } = Dimensions.get('window');
const BOARD_PADDING = 16;
const BOARD_SIZE = SW - BOARD_PADDING * 2;
const TILE_SIZE = BOARD_SIZE / GRID_SIZE;

export default function GameBoard({ tiles, onTileTap, phase, lastScore, lastTapTile }) {
  const [particles, setParticles] = React.useState([]);
  const [floatingTexts, setFloatingTexts] = React.useState([]);
  const boardRef = useRef(null);

  const handleTileTap = (tile) => {
    onTileTap(tile, (pos, score, color) => {
      // Spawn particle burst
      const id = Date.now() + Math.random();
      setParticles(p => [...p, { id, x: pos.x, y: pos.y, color: TILE_COLORS[color] || '#FFF' }]);

      // Spawn floating text
      setFloatingTexts(t => [...t, { id, x: pos.x, y: pos.y, text: `+${score}` }]);
    });
  };

  return (
    <View style={styles.board}>
      {tiles.map((tile, idx) => {
        const row = Math.floor(idx / GRID_SIZE);
        const col = idx % GRID_SIZE;
        return (
          <Tile
            key={tile.id}
            tile={tile}
            tileSize={TILE_SIZE}
            phase={phase}
            onPress={(t) => {
              // Calculate approximate screen position for effects
              const x = BOARD_PADDING + col * TILE_SIZE + TILE_SIZE / 2;
              const y = col * TILE_SIZE + TILE_SIZE / 2;
              handleTileTap(t);
            }}
          />
        );
      })}

      {/* Effect overlays */}
      {particles.map(p => (
        <ParticleBurst
          key={p.id}
          x={p.x}
          y={p.y}
          color={p.color}
          onDone={() => setParticles(prev => prev.filter(pp => pp.id !== p.id))}
        />
      ))}
      {floatingTexts.map(ft => (
        <FloatingText
          key={ft.id}
          x={ft.x}
          y={ft.y}
          text={ft.text}
          onDone={() => setFloatingTexts(prev => prev.filter(f => f.id !== ft.id))}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    marginHorizontal: BOARD_PADDING,
  },
});
