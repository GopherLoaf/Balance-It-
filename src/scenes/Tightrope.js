export class Tightrope extends Phaser.Scene {

    constructor() {
        super('Tightrope');
    }

    preload() {
        this.load.image('walker', 'assets/walker.png');
        this.load.image('walker_left', 'assets/walker_left.png');
        this.load.image('walker_right', 'assets/walker_right.png');
        this.load.image('tightrope0', 'assets/tightrope0.png');
        this.load.image('tightrope1', 'assets/tightrope1.png');
        this.load.image('tightrope2', 'assets/tightrope2.png');
        this.load.image('tightrope3', 'assets/tightrope3.png');
        this.load.image('tightrope4', 'assets/tightrope4.png');
        this.load.image('tightrope5', 'assets/tightrope5.png');
        this.load.image('walker_fall', 'assets/walker_fall.png');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');
        this.load.image('up', 'assets/up.png');
    }

    create() {
        //Getting registry value for score and lives
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        //Cursor Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up.addListener('down', this.inputUp, this);
        this.cursors.left.addListener('down', this.inputLeft, this);
        this.cursors.right.addListener('down', this.inputRight, this);
        this.cursors.space.addListener('down', this.inputSpace, this);

        //Variables
        this.win = false;
        this.inputTime = true;
        this.directions = [];
        this.progress = 0;

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5); i++) {
            this.directions[i * 3] = Phaser.Math.Between(0, 1);
            this.directions[i * 3 + 1] = Phaser.Math.Between(0, 1);
            this.directions[i * 3 + 2] = -1;
        }

        //Game Objects
        this.tightrope = this.add.image(160, 120, 'tightrope0');
        this.walker = this.add.image(160, 120, 'walker');
        this.fall = this.add.image(160, 120, 'walker_fall');
        this.directionGroup = this.add.group();
        this.correct = this.add.image(160, 120, 'correct');
        this.incorrect = this.add.image(160, 120, 'incorrect');

        this.switchTightrope();
        this.switchWalker();
        this.createDirection();

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);
        this.fall.setVisible(false);

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 6000,
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
            this.tweens.add({
                targets: this.directionGroup.getChildren()[this.progress],
                y: 360 + 10,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });
            if (this.directions[this.progress] == -1) {
                this.progress++;
                this.switchTightrope();
                if (this.directions.length == this.progress) {
                    this.win = true;
                    this.sound.play('right');
                    this.correct.setVisible(true);
                    this.inputTime = false;
                } else {
                    this.switchWalker();
                    this.createDirection();
                }
            } else {
                this.win = false;
                this.sound.play('wrong');
                this.incorrect.setVisible(true);
                this.inputTime = false;
                this.walker.setVisible(false);
                this.fall.setVisible(true);
                if (this.directions[this.progress] == 0) {
                    this.fall.flipX = true;
                }
            }
        }
    }

    inputRight() {
        if (this.inputTime == true) {
            this.tweens.add({
                targets: this.directionGroup.getChildren()[this.progress],
                y: 360 + 10,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });
            if (this.directions[this.progress] == 0) {
                this.progress++;
                this.switchTightrope();
                this.switchWalker();
                this.createDirection();
            } else {
                this.win = false;
                this.sound.play('wrong');
                this.incorrect.setVisible(true);
                this.inputTime = false;
                this.walker.setVisible(false);
                this.fall.setVisible(true);
            }
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            this.tweens.add({
                targets: this.directionGroup.getChildren()[this.progress],
                y: 360 + 10,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });
            if (this.directions[this.progress] == 1) {
                this.progress++;
                this.switchTightrope();
                this.switchWalker();
                this.createDirection();
            } else {
                this.win = false;
                this.sound.play('wrong');
                this.incorrect.setVisible(true);
                this.inputTime = false;
                this.walker.setVisible(false);
                this.fall.setVisible(true);
                this.fall.flipX = true;
            }
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.tweens.add({
                targets: this.directionGroup.getChildren()[this.progress],
                y: 360 + 10,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });
            if (this.directions[this.progress] == -1) {
                this.progress++;
                this.switchTightrope();
                if (this.directions.length == this.progress) {
                    this.win = true;
                    this.sound.play('right');
                    this.correct.setVisible(true);
                    this.inputTime = false;
                } else {
                    this.switchWalker();
                    this.createDirection();
                }
            } else {
                this.win = false;
                this.sound.play('wrong');
                this.incorrect.setVisible(true);
                this.inputTime = false;
                this.walker.setVisible(false);
                this.fall.setVisible(true);
                if (this.directions[this.progress] == 0) {
                    this.fall.flipX = true;
                }
            }
        }
    }

    switchTightrope() {
        if (this.directions.length - this.progress == 0) {
            this.tightrope.setTexture('tightrope0'); 
        } else if (this.directions.length - this.progress < 4) {
            this.tightrope.setTexture('tightrope1');
        } else if (this.directions.length - this.progress < 7) {
            this.tightrope.setTexture('tightrope2');
        } else if (this.directions.length - this.progress < 10) {
            this.tightrope.setTexture('tightrope3');
        } else if (this.directions.length - this.progress < 13) {
            this.tightrope.setTexture('tightrope4');
        } else {
            this.tightrope.setTexture('tightrope5');
        }
    }

    switchWalker() {
        if (this.directions[this.progress] == 1) {
            this.walker.setTexture('walker_right'); 
        } else if (this.directions[this.progress] == 0) {
            this.walker.setTexture('walker_left'); 
        } else {
            this.walker.setTexture('walker'); 
        }
    }

    createDirection() {
        if (this.directions[this.progress] == 1) {
            this.directionGroup.create(147 + 10, 160 + 10, 'left');
        } else if (this.directions[this.progress] == 0) {
            this.walker.setTexture('walker_left'); 
            this.directionGroup.create(147 + 10, 160 + 10, 'right');
        } else {
            this.walker.setTexture('walker'); 
            this.directionGroup.create(147 + 10, 160 + 10, 'up');
        }
    }
    
}
