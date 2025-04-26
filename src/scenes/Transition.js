export class Transition extends Phaser.Scene {

    constructor() {
        super('Transition');
    }

    preload() {
        this.load.audio('countdown', 'assets/countdown.wav');
        this.load.image('balance_sheet', 'assets/balance_sheet.png');
        this.load.image('blocks', 'assets/blocks.png');
        this.load.image('dots', 'assets/dots.png');
        this.load.image('normal_day', 'assets/normal_day.png');
        this.load.image('ones_and_zeroes', 'assets/ones_and_zeroes.png');
        this.load.image('sculpting', 'assets/sculpting.png');
        this.load.image('seesawt', 'assets/seesawt.png');
        this.load.image('strength_puzzle', 'assets/strength_puzzle.png');
        this.load.image('tightrope', 'assets/tightrope.png');
        this.load.image('waves', 'assets/waves.png');
        this.load.image('yinyang', 'assets/yinyang.png');
    }

    create() {
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Variables
        this.random = Phaser.Math.Between(0, 9);

        //Game Objects
        this.title = this.add.image(160, 120, 'title');
        this.livesGroup = this.add.group();

        for (let i = 0; i < this.lives; i++) {
            this.livesGroup.create(16 + 32 * i, 240 - 16, 'yinyang');
        }

        //The title card changes depending on the next microgame
        switch (this.random) {
            case 0:
            this.title.setTexture('balance_sheet');
            break;
            case 1:
            this.title.setTexture('blocks');
            break;
            case 2:
            this.title.setTexture('dots');
            break;
            case 3:
            this.title.setTexture('normal_day');
            break;
            case 4:
            this.title.setTexture('ones_and_zeroes');
            break;
            case 5:
            this.title.setTexture('sculpting');
            break;
            case 6:
            this.title.setTexture('seesawt');
            break;
            case 7:
            this.title.setTexture('strength_puzzle');
            break;
            case 8:
            this.title.setTexture('tightrope');
            break;
            case 9:
            this.title.setTexture('waves');
            break;
            default:
            this.title.setTexture('title');
        }

        //Timer before next microgame
        this.timer = this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: this.transition,
            callbackScope: this
        })

        //Audio
        this.sound.play('countdown');

        //Display level
        this.scoreText = this.add.text(0, 0, 'N/A', { fontSize: '32px', fill: '#000' });
        this.scoreText.setText(this.score);
    }

    update() {
    }

    transition() {
        //Switch to microgame
        switch (this.random) {
            case 0:
            this.scene.start('BalanceSheet');
            break;
            case 1:
            this.scene.start('Blocks');
            break;
            case 2:
            this.scene.start('Dots');
            break;
            case 3:
            this.scene.start('NormalDay');
            break;
            case 4:
            this.scene.start('OnesAndZeroes');
            break;
            case 5:
            this.scene.start('Sculpting');
            break;
            case 6:
            this.scene.start('Seesaw');
            break;
            case 7:
            this.scene.start('StrengthPuzzle');
            break;
            case 8:
            this.scene.start('Tightrope');
            break;
            case 9:
            this.scene.start('Waves');
            break;
            default:
            this.scene.start('Push');
        }
    }
    
}
