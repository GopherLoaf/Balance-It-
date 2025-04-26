export class BalanceSheet extends Phaser.Scene {

    constructor() {
        super('BalanceSheet');
    }

    preload() {
        this.load.image('grid', 'assets/grid.png');
        this.load.image('numpad', 'assets/numpad.png');
        this.load.image('red_circle', 'assets/red_circle.png');
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
        this.cursorPosition = [0, 0];
        this.inputTime = true;
        this.inputString = "";
        this.missingNumber = Phaser.Math.Between(0, 2);
        this.assets = [Phaser.Math.Between(0, Math.min(parseInt(this.score / 10) + 1, 5) * 100), Phaser.Math.Between(0, Math.min(parseInt(this.score / 10) + 1, 5) * 100), 0];
        this.assets[2] = this.assets[0] + this.assets[1];
        this.assetText = [];

        //Game Objects
        this.title = this.add.text(0, 0 + 4, 'Balance Sheet', { fontSize: '16px', fill: '#000', fixedWidth: 320, align: 'center' });
        this.subtitle = this.add.text(0, 20 + 4, 'ASSETS', { fontSize: '16px', fill: '#000', fixedHeight: 20});
        this.assetText[0] = this.add.text(0, 40 + 4, ' Cash', { fontSize: '16px', fill: '#000'});
        this.assetText[1] = this.add.text(0, 60 + 4, ' Accounts Receivable', { fontSize: '16px', fill: '#000'});
        this.assetText[2] = this.add.text(0, 80 + 4, 'TOTAL ASSETS', { fontSize: '16px', fill: '#000'});
        this.assetNumText = [];
        this.assetNumText[0] = this.add.text(200, 40 + 4, '$' + this.assets[0], { fontSize: '16px', fill: '#000', fixedWidth: 60, align: 'right' });
        this.assetNumText[1] = this.add.text(200, 60 + 4, '$' + this.assets[1], { fontSize: '16px', fill: '#000', fixedWidth: 60, align: 'right' });
        this.assetNumText[2] = this.add.text(260, 80 + 4, '$' + this.assets[2], { fontSize: '16px', fill: '#000', fixedWidth: 60, align: 'right' });
        this.assetNumText[this.missingNumber].setText('$');
        this.correct = this.add.image(240, 180, 'correct');
        this.incorrect = this.add.image(240, 180, 'incorrect');
        this.grid = this.add.image(160, 60, 'grid');
        this.numpad = this.add.image(60, 180, 'numpad');
        this.circle = this.add.image((60 - 98 / 2 + 32 / 2), (180 - 98 / 2 + 24 / 2) + 25 * 2, 'red_circle');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 10000,
            loop: false,
            callback: this.timeEnd,
            callbackScope: this,
            paused: false
        })

        //Tells player the remaining time left with 3 decimal places
        this.timerText = this.add.text(320 - 72, 240 - 24, 'N/A', { fontSize: '24px', fill: '#000' });
        var remaining = parseInt(this.timer.getRemainingSeconds() * 1000) / 1000;
        this.timerText.setText(remaining);
        this.timerText.setVisible(true);
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
            if (this.cursorPosition[1] >= 3) {
                this.cursorPosition[1] = 0;
            } else {
                this.cursorPosition[1]++;
            }
        }
        this.moveSelection();
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.cursorPosition[1] <= 0) {
                this.cursorPosition[1] = 3;
            } else {
                this.cursorPosition[1]--;
            }
        }
        this.moveSelection();
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.cursorPosition[0] >= 2) {
                this.cursorPosition[0] = 0;
            } else {
                this.cursorPosition[0]++;
            }
        }
        this.moveSelection();
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.cursorPosition[0] <= 0) {
                this.cursorPosition[0] = 2;
            } else {
                this.cursorPosition[0]--;
            }
        }
        this.moveSelection();
    }

    inputSpace() {
        if (this.inputTime == true) {
            if (this.cursorPosition[1] > 2) {
                switch(this.cursorPosition[0]) {
                    case 0:
                    this.inputString = this.inputString + 0;
                    this.assetNumText[this.missingNumber].setText('$' + this.inputString);
                    break;
                    case 1:
                    this.inputString = this.inputString.substring(0, this.inputString.length - 1);
                    this.assetNumText[this.missingNumber].setText('$' + this.inputString);
                    break;
                    case 2:
                    this.inputTime = false;
                    if (isNaN(this.inputString) == false && parseInt(this.inputString) == this.assets[this.missingNumber]) {
                        this.win = true;
                        this.correct.setVisible(true);
                        this.sound.play('right');
                    } else {
                        this.win = false;
                        this.incorrect.setVisible(true);
                        this.sound.play('wrong');
                    }
                    break;
                    default:
                }
            } else {
                this.inputString = this.inputString + (3 * this.cursorPosition[1] + this.cursorPosition[0] + 1);
                this.assetNumText[this.missingNumber].setText('$' + this.inputString);
            }
        }
    }

    moveSelection() {
        if (this.cursorPosition[1] > 2) {
            this.circle.setPosition((60 - 98 / 2 + 32 / 2) + 33 * this.cursorPosition[0], (180 - 98 / 2 + 24 / 2) + (25 * 3));
        } else {
            this.circle.setPosition((60 - 98 / 2 + 32 / 2) + 33 * this.cursorPosition[0], (180 - 98 / 2 + 24 / 2) + (25 * 2) - 25 * this.cursorPosition[1]);
        }
    }
    
}
