export class Blocks extends Phaser.Scene {

    constructor() {
        super('Blocks');
    }

    preload() {
        this.load.image('block1', 'assets/block1.png');
        this.load.image('block2', 'assets/block2.png');
        this.load.image('block3', 'assets/block3.png');
        this.load.image('block4', 'assets/block4.png');
        this.load.image('block5', 'assets/block5.png');
        this.load.image('block6', 'assets/block6.png');
        this.load.image('block7', 'assets/block7.png');
        this.load.image('block8', 'assets/block8.png');
        this.load.image('block9', 'assets/block9.png');
        this.load.image('blockquestion', 'assets/blockquestion.png');
        this.load.image('blockselect', 'assets/blockselect.png');
        this.load.image('scale', 'assets/scale.png');
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
        this.numbers = [];
        this.sum = 0;
        this.cursorPosition = 0;

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 2, 6); i++) {
            this.numbers[i] = Phaser.Math.Between(1, 9);
            this.sum += this.numbers[i];
        }

        this.rightNumber = this.sum - (this.numbers[Phaser.Math.Between(0, this.numbers.length - 1)] * 2);

        //Game Objects
        this.leftBlocks = this.add.group();
        this.rightBlocks = this.add.group();
        this.scale1 = this.add.image(160 - 80, 240 - 16, 'scale');
        this.scale2 = this.add.image(160 + 80, 240 - 16, 'scale');
        this.correct = this.add.image(160, 240 - 16, 'correct');
        this.incorrect = this.add.image(160, 240 - 16, 'incorrect');
        this.leftTotal = this.add.text(0, 240 - 4 - 16, '???', { fontSize: '16px', fill: '#fff', fixedWidth: 160, align: 'center' });
        this.rightTotal = this.add.text(160, 240 - 4 - 16, this.rightNumber, { fontSize: '16px', fill: '#fff', fixedWidth: 160, align: 'center' });

        for (let i = 0; i < this.numbers.length; i++) {
            this.createLeftBlock(30 + 20 + 60 * (i % 2), 240 - 30 - 60 * parseInt(i / 2) - 32, this.numbers[i]);
            if (i < this.numbers.length - 1) {
                this.rightBlocks.create(160 + 30 + 20 + 60 * (i % 2), 240 - 30 - 60 * parseInt(i / 2) - 32, 'blockquestion');
            }
        }

        this.selection = this.add.image(30 + 20, 240 - 30 - 32, 'blockselect');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 8000,
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
            if (this.cursorPosition < this.numbers.length - 2) {
                this.cursorPosition += 2;
            }
        }
        this.selection.setY(240 - 30 - 60 * parseInt(this.cursorPosition / 2) - 32);
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.cursorPosition > 1) {
                this.cursorPosition -= 2;
            }
        }
        this.selection.setY(240 - 30 - 60 * parseInt(this.cursorPosition / 2) - 32);
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.cursorPosition % 2 == 0 && this.cursorPosition < this.numbers.length - 1) {
                this.cursorPosition++;
            }
        }
        this.selection.setX(30 + 20 + 60 * (this.cursorPosition % 2));
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.cursorPosition % 2 == 1) {
                this.cursorPosition--;
            }
        }
        this.selection.setX(30 + 20 + 60 * (this.cursorPosition % 2));
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            this.leftBlocks.getChildren()[this.cursorPosition].setPosition(160 + 30 + 20 + 60 * (this.rightBlocks.getChildren().length % 2), 240 - 30 - 60 * parseInt(this.rightBlocks.getChildren().length / 2) - 32);
            this.leftTotal.setText(this.sum - this.numbers[this.cursorPosition]);
            this.rightTotal.setText(this.rightNumber + this.numbers[this.cursorPosition]);
            if (this.rightNumber + this.numbers[this.cursorPosition] == this.sum - this.numbers[this.cursorPosition]) {
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

    createLeftBlock(x, y, number) {
        switch(number) {
            case 1:
            this.leftBlocks.create(x, y, 'block1');
            break;
            case 2:
            this.leftBlocks.create(x, y, 'block2');
            break;
            case 3:
            this.leftBlocks.create(x, y, 'block3');
            break;
            case 4:
            this.leftBlocks.create(x, y, 'block4');
            break;
            case 5:
            this.leftBlocks.create(x, y, 'block5');
            break;
            case 6:
            this.leftBlocks.create(x, y, 'block6');
            break;
            case 7:
            this.leftBlocks.create(x, y, 'block7');
            break;
            case 8:
            this.leftBlocks.create(x, y, 'block8');
            break;
            case 9:
            this.leftBlocks.create(x, y, 'block9');
            break;
            default:
            this.leftBlocks.create(x, y, 'blockquestion');
        }
    }
    
}
