export class NormalDay extends Phaser.Scene {

    constructor() {
        super('NormalDay');
    }

    preload() {
        this.load.image('normal_day_background', 'assets/normal_day_background.png');
        this.load.image('man', 'assets/man.png');
        this.load.image('good1', 'assets/good1.png');
        this.load.image('good2', 'assets/good2.png');
        this.load.image('good3', 'assets/good3.png');
        this.load.image('good4', 'assets/good4.png');
        this.load.image('good5', 'assets/good5.png');
        this.load.image('good6', 'assets/good6.png');
        this.load.image('bad1', 'assets/bad1.png');
        this.load.image('bad2', 'assets/bad2.png');
        this.load.image('bad3', 'assets/bad3.png');
        this.load.image('bad4', 'assets/bad4.png');
        this.load.image('bad5', 'assets/bad5.png');
        this.load.image('bad6', 'assets/bad6.png');
        this.load.image('good_icon', 'assets/good_icon.png');
        this.load.image('bad_icon', 'assets/bad_icon.png');
        this.load.image('neutral_icon', 'assets/neutral_icon.png');
        this.load.image('choice_halo', 'assets/choice_halo.png');

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
        this.inputTime = false;
        this.backgroundX = 0;
        this.eventTimers = [];
        this.goodEvents = [0, 1, 2, 3, 4, 5];
        this.badEvents = [0, 1, 2, 3, 4, 5];
        this.eventList = [];
        this.cursorPosition = -1;

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5); i++) {
            this.eventList[i * 2] = 0;
            this.eventList[i * 2 + 1] = 1;
        }

        let random = Phaser.Math.Between(0, 1);
        this.missingEvent = random;
        this.eventList.splice(random, 1);

        //Game Objects
        this.background0 = this.add.image(320, 120, 'normal_day_background');
        this.background1 = this.add.image(640 + 320, 120, 'normal_day_background');
        this.man = this.add.image(160, 105, 'man');
        this.icon = this.add.image(160, 45, 'neutral_icon');
        this.goodOption = this.add.image(130, 45, 'good_icon');
        this.badOption = this.add.image(190, 45, 'bad_icon');
        this.choice = this.add.image(160, 45, 'choice_halo');
        this.correct = this.add.image(160, 45, 'correct');
        this.incorrect = this.add.image(160, 45, 'incorrect');

        //Some game objects should not start visible
        this.correct.setVisible(false);
        this.incorrect.setVisible(false);
        this.goodOption.setVisible(false);
        this.badOption.setVisible(false);
        this.choice.setVisible(false);

        for (let i = 0; i < Math.min(parseInt(this.score / 10) + 1, 5) * 2; i++) {
            this.eventTimers[i] = this.time.addEvent({
                delay: 1000,
                loop: false,
                callback: this.eventSwitch,
                args: [i],
                callbackScope: this,
                paused: true
            })
        }

        this.eventTimers[0].paused = false;

        //Minigame ends when this timer is finished
        this.timer = this.time.addEvent({
            delay: 2000,
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

        this.moveBackgroundX(1);
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
            this.cursorPosition = 1;
            this.choice.setX(190);
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            this.cursorPosition = 0;
            this.choice.setX(130);
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            if (this.cursorPosition == this.missingEvent) {
                this.win = true;
                this.correct.setVisible(true);
                this.sound.play('right');
            } else {
                this.win = false;
                this.incorrect.setVisible(true);
                this.sound.play('wrong');
            }
            if (this.cursorPosition != -1) {
                this.switchMan(this.cursorPosition);
            }
        }
    }

    moveBackgroundX(addX) {
        this.backgroundX += addX;
        while (this.backgroundX >= 640) {
            this.backgroundX -= 640;
        }
        this.background0.setX(320 - this.backgroundX);
        this.background1.setX(320 + 640 - this.backgroundX);
    }

    eventSwitch(event) {
        if (event < Math.min(parseInt(this.score / 10) + 1, 5) * 2 - 1) {
            let random = Phaser.Math.Between(0, this.eventList.length - 1);
            let karmaEvent = this.eventList[random];
            this.eventList.splice(random, 1);
            this.switchMan(karmaEvent);
            this.eventTimers[event + 1].paused = false;
        } else {
            this.beginInput();
            this.man.setTexture('man');
            this.icon.setTexture('neutral_icon');
            this.goodOption.setVisible(true);
            this.badOption.setVisible(true);
        }
    }

    switchMan(karma) {
        if (karma == 0) {
            let random = Phaser.Math.Between(0, this.goodEvents.length - 1);
            let event = this.goodEvents[random];
            this.goodEvents.splice(random, 1);
            this.icon.setTexture('good_icon');
            switch (event) {
                case 0:
                this.man.setTexture('good1');
                break;
                case 1:
                this.man.setTexture('good2');
                break;
                case 2:
                this.man.setTexture('good3');
                break;
                case 3:
                this.man.setTexture('good4');
                break;
                case 4:
                this.man.setTexture('good5');
                break;
                case 5:
                this.man.setTexture('good6');
                break;
                default:
                this.man.setTexture('man');
            }
        } else {
            let random = Phaser.Math.Between(0, this.badEvents.length - 1);
            let event = this.badEvents[random];
            this.badEvents.splice(random, 1);
            this.icon.setTexture('bad_icon');
            switch (event) {
                case 0:
                this.man.setTexture('bad1');
                break;
                case 1:
                this.man.setTexture('bad2');
                break;
                case 2:
                this.man.setTexture('bad3');
                break;
                case 3:
                this.man.setTexture('bad4');
                break;
                case 4:
                this.man.setTexture('bad5');
                break;
                case 5:
                this.man.setTexture('bad6');
                break;
                default:
                this.man.setTexture('man');
            }
        }
    }

    beginInput() {
        //Function to prepare game for player input
        this.timer.paused = false;
        this.timerText.setVisible(true);
        this.inputTime = true;
        this.choice.setVisible(true);
    }
    
}
