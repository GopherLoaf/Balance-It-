export class Sculpting extends Phaser.Scene {

    constructor() {
        super('Sculpting');
    }

    preload() {
        this.load.image('stone', 'assets/stone.png');
        this.load.image('sandstone', 'assets/sandstone.png');
        this.load.image('chisel', 'assets/chisel.png');
        this.load.image('sculpture_censor', 'assets/sculpture_censor.png');
    }

    create() {
        //Getting registry value for score and lives
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up.addListener('down', this.inputUp, this);
        this.cursors.down.addListener('down', this.inputDown, this);
        this.cursors.left.addListener('down', this.inputLeft, this);
        this.cursors.right.addListener('down', this.inputRight, this);
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Variables
        this.win = false;
        this.positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.stone = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
        this.sandstone = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
        this.cursorPosition = [0, 0];
        this.inputTime = false;
        this.correctPositions = [];

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5); i++) {
            let random = Phaser.Math.Between(0, this.positions.length - 1);
            this.stone[parseInt(this.positions[random] / 5)][this.positions[random] % 5] = 0;
            this.correctPositions[i] = [parseInt(this.positions[random] / 5), this.positions[random] % 5];
            this.positions.splice(random, 1);
        }

        //Game Objects
        this.correct = this.add.image(160, 120, 'correct');
        this.incorrect = this.add.image(160, 120, 'incorrect');
        this.stoneGroup = this.add.group();
        this.sandstoneGroup = this.add.group();

        for (let i = 0; i < 2; i++) {
            for (let e = 0; e < 5; e++) {
                this.stoneGroup.create(160 + 40 + 20 + 40 * i, 40 + 20 + 40 * e, 'stone');
                this.sandstoneGroup.create(40 + 20 + 40 * i, 40 + 20 + 40 * e, 'sandstone');
                if (this.stone[i][e] == 0) {
                    this.stoneGroup.getChildren()[i * 5 + e].setVisible(false);
                }
            }
        }

        this.censor = this.add.image(160 + 40 + 40, 40 + 100, 'sculpture_censor');
        this.chisel = this.add.image(40 + 20 + 10, 40 + 20 - 20 + 5, 'chisel');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);
        this.censor.setVisible(false);
        this.chisel.setVisible(false);

        //Time until the player is allowed input
        this.beforeInput = this.time.addEvent({
            delay: 1000,
            loop: false,
            callback: this.beginInput,
            callbackScope: this,
            paused: false
        })

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: this.timeEnd,
            callbackScope: this,
            paused: true
        })

        //Tells player the remaining time left with 3 decimal places
        this.timerText = this.add.text(160 - 48, 0, 'N/A', { fontSize: '32px', fill: '#000' });
        var remaining = parseInt(this.timer.getRemainingSeconds() * 1000) / 1000;
        this.timerText.setText(remaining);
        this.timerText.setVisible(false);
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

    inputUp() {
        if (this.inputTime == true) {
            if (this.cursorPosition[1] <= 0) {
                this.cursorPosition[1] = 4;
            } else {
                this.cursorPosition[1]--;
            }
            this.moveSelection();
        }
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.cursorPosition[1] >= 4) {
                this.cursorPosition[1] = 0;
            } else {
                this.cursorPosition[1]++;
            }
            this.moveSelection();
        }
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.cursorPosition[0] >= 1) {
                this.cursorPosition[0] = 0;
            } else {
                this.cursorPosition[0]++;
            }
            this.moveSelection();
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.cursorPosition[0] <= 0) {
                this.cursorPosition[0] = 1;
            } else {
                this.cursorPosition[0]--;
            }
            this.moveSelection();
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.sandstoneGroup.getChildren()[this.cursorPosition[0] * 5 + this.cursorPosition[1]].setVisible(false);
            this.sandstone[this.cursorPosition[0]][this.cursorPosition[1]] = 0;
            if (this.stone[this.cursorPosition[0]][this.cursorPosition[1]] == 0) {
                let allCorrect = true;
                for (let i = 0; i < this.correctPositions.length; i++) {
                    if (this.sandstone[this.correctPositions[i][0]][this.correctPositions[i][1]] == 1) {
                        allCorrect = false;
                    }
                }
                if (allCorrect == true) {
                    this.inputTime = false;
                    this.correct.setVisible(true);
                    this.win = true;
                    this.chisel.setVisible(false);
                    this.censor.setVisible(false);
                    this.sound.play('right');
                }
            } else {
                this.inputTime = false;
                this.incorrect.setVisible(true);
                this.chisel.setVisible(false);
                this.censor.setVisible(false);
                this.sound.play('wrong');
            }
        }
    }

    moveSelection() {
        this.chisel.setPosition(40 + 20 + 10 + 40 * this.cursorPosition[0], 40 + 20 - 20 + 5 + 40 * this.cursorPosition[1]);
    }

    beginInput() {
        //Function to prepare game for player input
        this.timer.paused = false;
        this.timerText.setVisible(true);
        this.inputTime = true;
        this.chisel.setVisible(true);
        this.censor.setVisible(true);
    }
    
}
