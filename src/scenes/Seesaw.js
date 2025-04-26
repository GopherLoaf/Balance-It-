export class Seesaw extends Phaser.Scene {

    constructor() {
        super('Seesaw');
    }

    preload() {
        this.load.image('black_square', 'assets/black_square.png');
        this.load.image('red_square', 'assets/red_square.png');
        this.load.image('orange_square', 'assets/orange_square.png');
        this.load.image('yellow_square', 'assets/yellow_square.png');
        this.load.image('green_square', 'assets/green_square.png');
        this.load.image('blue_square', 'assets/blue_square.png');
        this.load.image('violet_square', 'assets/violet_square.png');
        this.load.image('shape_select', 'assets/shape_select.png');
        this.load.image('seesaw', 'assets/seesaw.png');
        this.load.image('seesaw_left', 'assets/seesaw_left.png');
        this.load.image('seesaw_right', 'assets/seesaw_right.png');
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
        this.inputTime = true;
        this.cursorPosition = 0;
        this.options = [];

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 2, 6); i++) {
            this.options[i] = Phaser.Math.Between(1, 16);
        }

        this.answer = Phaser.Math.Between(0, this.options.length - 1);

        //Game Objects
        this.optionBlocks = [];
        this.answerBlocks = this.add.group();
        this.select = this.add.image(64 + 32, 240 - 32, 'shape_select');
        this.other = this.add.image(320 - 64 - 32, 24 + 32 + 24, 'shape_select');
        this.seesaw = this.add.image(160, 64 + 24, 'seesaw_right');
        this.correct = this.add.image(160, 24 + 32, 'correct');
        this.incorrect = this.add.image(160, 24 + 32, 'incorrect');

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 2, 6); i++) {
            this.optionBlocks[i] = this.add.group();
            let potentialPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            for (let e = 0; e < this.options[i]; e++) {
                let random = Phaser.Math.Between(0, potentialPositions.length - 1);
                this.createSquare(i, potentialPositions[random]);
                potentialPositions.splice(random, 1);
            }
        }

        let potentialPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        for (let i = 0; i < this.options[this.answer]; i++) {
            let random = Phaser.Math.Between(0, potentialPositions.length - 1);
            this.answerBlocks.create(320 - 64 - 64 + 8 + 16 * (potentialPositions[random] % 4), 24 + 8 + 16 * parseInt(potentialPositions[random] / 4) + 24, 'black_square');
            potentialPositions.splice(random, 1);
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

    inputUp() {
        if (this.inputTime == true) {
            if (this.cursorPosition < this.options.length - 3) {
                this.cursorPosition += 3;
            }
            this.select.setY(240 - 32 - 64 * parseInt(this.cursorPosition / 3));
        }
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.cursorPosition > 2) {
                this.cursorPosition -= 3;
            }
            this.select.setY(240 - 32 - 64 * parseInt(this.cursorPosition / 3));
        }
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.cursorPosition % 3 < 2 && this.cursorPosition < this.options.length - 1) {
                this.cursorPosition++;
            }
            this.select.setX(64 + 32 + 64 * (this.cursorPosition % 3));
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.cursorPosition % 3 != 0) {
                this.cursorPosition--;
            }
            this.select.setX(64 + 32 + 64 * (this.cursorPosition % 3));
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            if (this.options[this.cursorPosition] == this.options[this.answer]) {
                this.win = true;
                this.sound.play('right');
                this.correct.setVisible(true);
                this.seesaw.setTexture('seesaw');
                this.other.setY(this.other.y - 24);
                this.answerBlocks.children.iterate(child => {
                    child.setY(child.y - 24);
                })
                this.select.setPosition(64 + 32, 32 + 24);
                this.optionBlocks[this.cursorPosition].children.iterate(child => {
                    child.setX(child.x - (64 + 8) - 64 * (this.cursorPosition % 3) + 64 + 8);
                    child.setY(child.y - (240 - 8) + 64 * parseInt(this.cursorPosition / 3) - 8 + 64 + 24);
                })
            } else {
                this.win = false;
                this.sound.play('wrong');
                this.incorrect.setVisible(true);
                if (this.options[this.cursorPosition] < this.options[this.answer]) {
                    this.select.setPosition(64 + 32, 32);
                    this.optionBlocks[this.cursorPosition].children.iterate(child => {
                        child.setX(child.x - (64 + 8) - 64 * (this.cursorPosition % 3) + 64 + 8);
                        child.setY(child.y - (240 - 8) + 64 * parseInt(this.cursorPosition / 3) - 8 + 64);
                    })
                } else {
                    this.seesaw.setTexture('seesaw_left');
                    this.other.setY(this.other.y - 48);
                    this.answerBlocks.children.iterate(child => {
                        child.setY(child.y - 48);
                    })
                    this.select.setPosition(64 + 32, 32 + 48);
                    this.optionBlocks[this.cursorPosition].children.iterate(child => {
                        child.setX(child.x - (64 + 8) - 64 * (this.cursorPosition % 3) + 64 + 8);
                        child.setY(child.y - (240 - 8) + 64 * parseInt(this.cursorPosition / 3) - 8 + 64 + 48);
                    })
                }
            }
        }
    }

    createSquare(optionNumber, position) {
        switch (optionNumber) {
            case 0:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4), 240 - 8 - 16 * parseInt(position / 4), 'red_square');
            break;
            case 1:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4) + 64, 240 - 8 - 16 * parseInt(position / 4), 'orange_square');
            break;
            case 2:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4) + 128, 240 - 8 - 16 * parseInt(position / 4), 'yellow_square');
            break;
            case 3:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4), 240 - 8 - 16 * parseInt(position / 4) - 64, 'green_square');
            break;
            case 4:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4) + 64, 240 - 8 - 16 * parseInt(position / 4) - 64, 'blue_square');
            break;
            case 5:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4) + 128, 240 - 8 - 16 * parseInt(position / 4) - 64, 'violet_square');
            break;
            default:
            this.optionBlocks[optionNumber].create(64 + 8 + 16 * (position % 4), 240 - 8 - 16 * parseInt(position / 4), 'black_square');
        }
    }
    
}
