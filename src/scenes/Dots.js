export class Dots extends Phaser.Scene {

    constructor() {
        super('Dots');
    }

    preload() {
        this.load.image('dividing_line', 'assets/dividing_line.png');
        this.load.image('dot', 'assets/dot.png');
    }

    create() {
        //Getting registry value for score and lives
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.left.addListener('down', this.inputLeft, this);
        this.cursors.right.addListener('down', this.inputRight, this);
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Variables
        this.win = false;
        this.inputTime = true;
        this.rightSideMore = false;
        this.leftDotPositions = [[], [], [], [], []];
        this.rightDotPositions = [[], [], [], [], []];
        this.playerSide = 0;

        if (Phaser.Math.Between(0, 1) == 0) {
            this.rightSideMore = true;
        } else {
            this.rightSideMore = false;
        }

        //Game Objects
        this.playerDot = this.add.image(160, 40 + 20 + 40 * 2, 'dot');
        this.line = this.add.image(160, 120, 'dividing_line');
        this.correct = this.add.image(160, 40 + 20 + 40 * 2, 'correct');
        this.incorrect = this.add.image(160, 40 + 20 + 40 * 2, 'incorrect');
        this.leftDots = this.add.group();
        this.rightDots = this.add.group();

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5) * 2; i++) {
            if (this.rightSideMore == false || i < Math.min(parseInt(this.score / 10) + 1, 5) * 2 - 1) {
                let randomPosition = [Phaser.Math.Between(0, 3), Phaser.Math.Between(0, 4)];
                if (typeof this.leftDotPositions[randomPosition[0]][randomPosition[1]] === 'undefined' && !(randomPosition[0] == 3 && randomPosition[1] == 2)) {
                    this.leftDotPositions[randomPosition[0]][randomPosition[1]] = 1;
                    this.leftDots.create(20 + 40 * randomPosition[0], 40 + 20 + 40 * randomPosition[1], 'dot');
                } else {
                    i--;
                }
            }
        }

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5) * 2; i++) {
            if (this.rightSideMore == true || i < Math.min(parseInt(this.score / 10) + 1, 5) * 2 - 1) {
                let randomPosition = [Phaser.Math.Between(0, 3), Phaser.Math.Between(0, 4)];
                if (typeof this.rightDotPositions[randomPosition[0]][randomPosition[1]] === 'undefined' && !(randomPosition[0] == 0 && randomPosition[1] == 2)) {
                    this.rightDotPositions[randomPosition[0]][randomPosition[1]] = 1;
                    this.rightDots.create(160 + 20 + 40 * randomPosition[0], 40 + 20 + 40 * randomPosition[1], 'dot');
                } else {
                    i--;
                }
            }
        }

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: this.timeEnd,
            callbackScope: this,
            paused: false
        })

        //Tells player the remaining time left with 3 decimal places
        this.timerText = this.add.text(160 - 48, 0, 'N/A', { fontSize: '32px', fill: '#000' });
        var remaining = parseInt(this.timer.getRemainingSeconds() * 1000) / 1000;
        this.timerText.setText(remaining);
    }

    update() {
        //Update the timer
        var remaining = parseInt(this.timer.getRemainingSeconds() * 1000) / 1000;
        this.timerText.setText(remaining);
    }

    timeEnd() {
        //Updates score or lives in the registry then starts transition scene or gameover scene
        if (this.win == true) {
            this.score++;
            this.registry.set('score', this.score);
            
            this.scene.start('Transition');
        } else {
            this.lives--;
            this.registry.set('lives', this.lives);
            
            if (this.registry.get('lives') < 1) {
                this.scene.start('GameOver');
            } else {
                this.scene.start('Transition');
            }
        }
    }

    inputRight() {
        if (this.inputTime == true) {
            this.playerSide = 1;
            this.playerDot.setX(160 + 20);
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            this.playerSide = -1;
            this.playerDot.setX(160 - 20);
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            if ((this.playerSide == 1 && this.rightSideMore == false) || (this.playerSide == -1 & this.rightSideMore == true)) {
                this.correct.setVisible(true);
                this.win = true;
                this.sound.play('right');
            } else {
                this.incorrect.setVisible(true);
                this.win = false;
                this.sound.play('wrong');
            }
        }
    }
    
}
