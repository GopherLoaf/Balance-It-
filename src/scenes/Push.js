//Testing microgame
export class Push extends Phaser.Scene {

    constructor() {
        super('Push');
    }

    preload() {
        this.load.image('background', 'assets/space.png');

        //  The one sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('one', 'assets/one.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        
        this.one = this.physics.add.sprite(0, 0, 'one');

        this.goal = this.physics.add.staticSprite(200, 200, 'one');

        this.physics.add.overlap(this.one, this.goal, this.goalGet, null, this);

        this.timer = this.time.addEvent({
            delay: 5000,
            loop: false,
            callback: this.timeEnd,
            callbackScope: this
        })

        this.timerText = this.add.text(0, 20, 'Timer: b', { fontSize: '32px', fill: '#fff' });
        var remaining = parseInt(this.timer.getRemainingSeconds() * 1000) / 1000;
        this.timerText.setText('Timer: ' + remaining);
    }

    update() {
        var remaining = parseInt(this.timer.getRemainingSeconds()) + 1;
        this.timerText.setText('Timer: ' + remaining);

        this.background.tilePositionX += 2;

        if (this.cursors.left.isDown) {
            this.one.x -= 2;
        }
        if (this.cursors.right.isDown) {
            this.one.x += 2;
        }

        if (this.cursors.up.isDown) {
            this.one.y -= 2;
        }
        if (this.cursors.down.isDown) {
            this.one.y += 2;
        }
    }

    goalGet(one, goal)
    {
        this.score++;
        this.registry.set('score', this.score);

        this.scene.start('Transition');
    }

    timeEnd() {
        this.lives--;
        this.registry.set('lives', this.lives);

        if (this.registry.get('lives') < 1) {
            this.scene.start('GameOver');
        } else {
            this.scene.start('Transition');
        }
    }
    
}
