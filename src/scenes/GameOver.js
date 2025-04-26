export class GameOver extends Phaser.Scene {

    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png');
        this.load.audio('sad', 'assets/sad.wav');
    }

    create() {
        //Getting registry value for score and lives
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Game Objects
        const gameover = this.add.image(160, 120, 'gameover');

        //Audio
        this.sound.play('sad');

        //Display score
        this.scoreText = this.add.text(0, 240 - 32, 'Score: N/A', { fontSize: '32px', fill: '#000', fixedWidth: 320, align: 'center' });
        this.scoreText.setText('Score: ' + this.score);
    }

    update() {
    }

    inputSpace() {
        this.registry.set('score', 1);
        this.registry.set('lives', 3);
        
        this.scene.start('Start');
    }
    
}
