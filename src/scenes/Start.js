export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('controls', 'assets/controls.png');
        this.load.spritesheet('title', 'assets/title.png', { frameWidth: 320, frameHeight: 120 });
        this.load.audio('right', 'assets/right.wav');
        this.load.audio('wrong', 'assets/wrong.wav');
        this.load.image('correct', 'assets/correct.png');
        this.load.image('incorrect', 'assets/incorrect.png');
        this.load.audio('menu', 'assets/menu.wav');
    }

    create() {
        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Game Objects
        const title = this.add.sprite(160, 60 - 10, 'title');
        const controls = this.add.image(160, 120 + 60, 'controls');

        //Audio
        this.bgm = this.sound.add('menu');
        this.bgm.loop = true;
        this.bgm.play();

        //Animation
        title.anims.create({
            key: 'boil',
            frames: this.anims.generateFrameNumbers('title', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1,
            randomFrame: true
        });
        title.play('boil')

        this.tweens.add({
            targets: title,
            y: 90 + 10,
            duration: 2000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
    }

    update() {
    }

    inputSpace() {
        this.registry.set('score', 31);
        this.registry.set('lives', 3);

        this.scene.start('Transition');
        this.bgm.stop();
    }
    
}
