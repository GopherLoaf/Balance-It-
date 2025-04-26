export class OnesAndZeroes extends Phaser.Scene {

    constructor() {
        super('OnesAndZeroes');
    }

    preload() {
        this.load.image('box', 'assets/box.png');
        this.load.image('one', 'assets/one.png');
        this.load.image('minus_one', 'assets/minus_one.png');
        this.load.image('zero', 'assets/zero.png');
        this.load.image('question', 'assets/question.png');
        this.load.image('equals', 'assets/equals.png');
    }

    create() {
        //Getting registry value for score and lives
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up.addListener('down', this.inputUp, this);
        this.cursors.down.addListener('down', this.inputDown, this);
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Variables
        this.sum = 0;
        this.inputTime = false;
        this.inputNumber = 0;
        this.win = false;

        //Game Objects
        this.zero = this.add.image(160, 120, 'zero');
        this.zerotwo = this.add.image(280, 120, 'zero');
        this.equals = this.add.image(220, 120, 'equals');
        this.correct = this.add.image(220, 120, 'correct');
        this.incorrect = this.add.image(220, 120, 'incorrect');
        this.numbers = this.add.group();
        this.numberText = this.add.text(160 - 12, 120 - 8, '0', { fontSize: '16px', fill: '#000' });
        this.inputText = this.add.text(160 - 12, 180 - 8, '0', { fontSize: '16px', fill: '#000' });

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5); i++) {
            var random = Phaser.Math.Between(-1, 1);
            this.sum += random;
            this.createNumber(160, 120 - (64 * i + 192), random);
            this.tweens.add({
                targets: this.numbers.getChildren()[0 + 4 * i],
                y: 120,
                duration: 3000 + 1000 * i,
                ease: 'Linear',
                yoyo: false,
                repeat: 0
            });
            random = Phaser.Math.Between(-1, 1);
            this.sum += random;
            this.createNumber(160 + (64 * i + 192), 120, random);
            this.tweens.add({
                targets: this.numbers.getChildren()[1 + 4 * i],
                x: 160,
                duration: 3000 + 1000 * i,
                ease: 'Linear',
                yoyo: false,
                repeat: 0
            });
            random = Phaser.Math.Between(-1, 1);
            this.sum += random;
            this.createNumber(160, 120 + (64 * i + 192), random);
            this.tweens.add({
                targets: this.numbers.getChildren()[2 + 4 * i],
                y: 120,
                duration: 3000 + 1000 * i,
                ease: 'Linear',
                yoyo: false,
                repeat: 0
            });
            random = Phaser.Math.Between(-1, 1);
            this.sum += random;
            this.createNumber(160 - (64 * i + 192), 120, random);
            this.tweens.add({
                targets: this.numbers.getChildren()[3 + 4 * i],
                x: 160,
                duration: 3000 + 1000 * i,
                ease: 'Linear',
                yoyo: false,
                repeat: 0
            });
        }

        this.box = this.add.image(160, 120, 'box');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);
        this.numberText.setVisible(false);
        this.inputText.setVisible(false);
        this.equals.setVisible(false);
        this.zerotwo.setVisible(false);

        //Time until the player is allowed input
        this.beforeInput = this.time.addEvent({
            delay: 3000 + 1000 * Math.min(parseInt(this.score / 10), 4),
            loop: false,
            callback: this.beginInput,
            callbackScope: this,
            paused: false
        })

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 5000,
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

        if(this.inputNumber > -1) {
            this.inputText.setText('+' + this.inputNumber);
        } else {
            this.inputText.setText(this.inputNumber);
        }
    }

    beginInput() {
        //Function to prepare game for player input
        this.timer.paused = false;
        this.timerText.setVisible(true);
        this.inputTime = true;
        this.inputText.setVisible(true);
        this.equals.setVisible(true);
        this.zerotwo.setVisible(true);
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

    createNumber(x, y, number) {
        switch(number) {
            case 0:
            this.numbers.create(x, y, 'zero');
            break;
            case 1:
            this.numbers.create(x, y, 'one');
            break;
            case -1:
            this.numbers.create(x, y, 'minus_one');
            break;
            default:
            this.numbers.create(x, y, 'question');
        }
    }

    inputUp() {
        if (this.inputTime == true) {
            this.inputNumber++;
        }
    }

    inputDown() {
        if (this.inputTime == true) {
            this.inputNumber--;
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            this.zero.setVisible(false);
            this.tweens.add({
                targets: this.inputText,
                y: 120 - 8,
                duration: 2000,
                ease: 'Linear',
                yoyo: false,
                repeat: 0
            })
            if (this.sum > -1){
                this.numberText.setX(160 - 4)
            } else {
                this.numberText.setX(160 - 12);
            }
            this.numberText.setText(this.sum);
            this.numberText.setVisible(true);
            this.numbers.children.iterate(child => {
                child.setVisible(false);
            });
            if (this.inputNumber + this.sum == 0) {
                this.win = true;
                this.correct.setVisible(true);
                this.sound.play('right');
            } else {
                this.win = false;
                this.incorrect.setVisible(true);
                this.sound.play('wrong');
            }
        }
    }
    
}
