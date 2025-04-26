export class Waves extends Phaser.Scene {

    constructor() {
        super('Waves');
    }

    preload() {
        this.load.image('wave', 'assets/wave.png');
        this.load.image('wave_end', 'assets/wave_end.png');
        this.load.image('beach', 'assets/beach.png');
        this.load.image('beach_stick', 'assets/beach_stick.png');
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
        this.leftWaves = [];
        this.rightWaves = [];
        this.cursorPosition = 0;

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5); i++) {
            this.leftWaves[i] = 1;
            this.rightWaves[i] = Phaser.Math.Between(1, 5);
        }

        //Game Objects
        this.beach = this.add.image(160, 120, 'beach');
        this.correct = this.add.image(240, 16, 'correct');
        this.incorrect = this.add.image(240, 16, 'incorrect');
        this.leftWaveGroup = this.add.group();
        this.rightWaveGroup = this.add.group();
        this.leftWaveEndGroup = this.add.group();

        for (let i = 0; i < this.rightWaves.length; i++) {
            for (let e = 0; e < 5; e++) {
                this.leftWaveGroup.create(160 - 16 - 32 * e, 40 + 16 + 32 * i, 'wave');
                this.leftWaveGroup.getChildren()[i * 5 + e].setVisible(false);
            }
            for (let e = 0; e < this.rightWaves[i]; e++) {
                if (e == this.rightWaves[i] - 1) {
                    this.rightWaveGroup.create(160 + 16 + 32 * e, 40 + 16 + 32 * i, 'wave_end');
                } else {
                    this.rightWaveGroup.create(160 + 16 + 32 * e, 40 + 16 + 32 * i, 'wave');
                }
            }
            this.leftWaveGroup.getChildren()[i * 5].setVisible(true);
            this.leftWaveEndGroup.create(160 - 16, 40 + 16 + 32 * i, 'wave_end');
            this.leftWaveEndGroup.getChildren()[i].setRotation(Math.PI);
        }

        this.stick = this.add.image(160 - 16 - 32 * 4, 40 + 16, 'beach_stick');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 5000,
            loop: false,
            callback: this.timeEnd,
            callbackScope: this,
            paused: false
        })

        //Tells player the remaining time left with 3 decimal places
        this.timerText = this.add.text(160 - 48, 0, 'N/A', { fontSize: '32px', fill: '#fff' });
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
            if (this.cursorPosition <= 0) {
                this.cursorPosition = this.rightWaves.length - 1;
            } else {
                this.cursorPosition--;
            }
            this.stick.setY(40 + 16 + 32 * this.cursorPosition);
        }
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.cursorPosition >= this.rightWaves.length - 1) {
                this.cursorPosition = 0;
            } else {
                this.cursorPosition++;
            }
        }
        this.stick.setY(40 + 16 + 32 * this.cursorPosition);
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.leftWaves[this.cursorPosition] > 1) {
                this.leftWaveGroup.getChildren()[this.cursorPosition * 5 + this.leftWaves[this.cursorPosition] - 1].setVisible(false);
                this.leftWaves[this.cursorPosition]--;
                this.leftWaveEndGroup.getChildren()[this.cursorPosition].setX(160 - 16 - 32 * (this.leftWaves[this.cursorPosition] - 1));
            }
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.leftWaves[this.cursorPosition] < 5) {
                this.leftWaves[this.cursorPosition]++;
                this.leftWaveGroup.getChildren()[this.cursorPosition * 5 + this.leftWaves[this.cursorPosition] - 1].setVisible(true);
                this.leftWaveEndGroup.getChildren()[this.cursorPosition].setX(160 - 16 - 32 * (this.leftWaves[this.cursorPosition] - 1));
            }
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            this.stick.setVisible(false);
            let allCorrect = true;
            for (let i = 0; i < this.rightWaves.length; i++) {
                if (this.rightWaves[i] != this.leftWaves[i]) {
                    allCorrect = false;
                }
            }
            if (allCorrect == true) {
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
