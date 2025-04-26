import { Start } from './scenes/Start.js';
import { Transition } from './scenes/Transition.js';
import { Push } from './scenes/Push.js';
import { Pull } from './scenes/Pull.js';
import { OnesAndZeroes } from './scenes/OnesAndZeroes.js';
import { BalanceSheet } from './scenes/BalanceSheet.js';
import { Sculpting } from './scenes/Sculpting.js';
import { Waves } from './scenes/Waves.js';
import { Dots } from './scenes/Dots.js';
import { Blocks } from './scenes/Blocks.js';
import { NormalDay } from './scenes/NormalDay.js';
import { Seesaw } from './scenes/Seesaw.js';
import { Tightrope } from './scenes/Tightrope.js';
import { StrengthPuzzle } from './scenes/StrengthPuzzle.js';
import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 320,
    height: 240,
    backgroundColor: '#FFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    pixelArt: true,
    scene: [
        Start,
        Transition,
        Push,
        Pull,
        OnesAndZeroes,
        BalanceSheet,
        Sculpting,
        Waves,
        Dots,
        Blocks,
        NormalDay,
        Seesaw,
        Tightrope,
        StrengthPuzzle,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            