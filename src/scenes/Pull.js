//Testing microgame
export class Pull extends Phaser.Scene {

    constructor() {
        super('Pull');
    }

    preload() {
        this.load.image('background', 'assets/space.png');

        //  The minus sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('minus', 'assets/minus_one.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        
        this.minus = this.physics.add.sprite(0, 0, 'minus');

        this.goal = this.physics.add.staticSprite(0, 200, 'minus');

        this.physics.add.overlap(this.minus, this.goal, this.goalGet, null, this);

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
            this.minus.x -= 2;
        }
        if (this.cursors.right.isDown) {
            this.minus.x += 2;
        }

        if (this.cursors.up.isDown) {
            this.minus.y -= 2;
        }
        if (this.cursors.down.isDown) {
            this.minus.y += 2;
        }
    }

    goalGet(minus, goal)
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
