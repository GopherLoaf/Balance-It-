export class StrengthPuzzle extends Phaser.Scene {

    constructor() {
        super('StrengthPuzzle');
    }

    preload() {
        this.load.image('dude', 'assets/dude.png');
        this.load.image('boulder', 'assets/boulder.png');
        this.load.image('ground', 'assets/ground.png');
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
        this.playerPosition = [Phaser.Math.Between(0, 4), Phaser.Math.Between(0, 4)];
        this.playerOtherPosition = [Phaser.Math.Between(1, 3), Phaser.Math.Between(1, 3)];
        this.grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.gridOther = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.answers = [];

        //Game Objects
        this.correct = this.add.image(160, 120, 'correct');
        this.incorrect = this.add.image(160, 120, 'incorrect');
        this.ground = this.add.image(60 + 20, 120, 'ground');
        this.groundOther = this.add.image(320 - 60 - 20, 120, 'ground');
        this.boulderGroup = this.add.group();
        this.boulderOtherGroup = this.add.group();
        this.playerImage = this.add.image(20 + 12 + 24 * this.playerPosition[0], 120 - 60 + 12 + 24 * this.playerPosition[1], 'dude');
        this.playerOtherImage = this.add.image(320 - 120 - 20 + 12 + 24 * this.playerOtherPosition[0], 120 - 60 + 12 + 24 * this.playerOtherPosition[1], 'dude');

        for (let i = 0; i < Math.min(parseInt(this.score / 20) + 1, 3); i++) {
            let randomPosition = [Phaser.Math.Between(1, 3), Phaser.Math.Between(1, 3)];
            if (this.grid[randomPosition[0]][randomPosition[1]] == 0 && !(randomPosition[0] == this.playerPosition[0] && randomPosition[1] == this.playerPosition[1])){
                this.grid[randomPosition[0]][randomPosition[1]] = i + 1;
                this.boulderGroup.create(20 + 12 + 24 * randomPosition[0], 120 - 60 + 12 + 24 * randomPosition[1], 'boulder');
            } else {
                i--;
            }
        }

        for (let i = 0; i < Math.min(parseInt(this.score / 20) + 1, 3); i++) {
            let randomPosition = [Phaser.Math.Between(0, 4), Phaser.Math.Between(0, 4)];
            if (this.gridOther[randomPosition[0]][randomPosition[1]] == 0 && !(randomPosition[0] == this.playerOtherPosition[0] && randomPosition[1] == this.playerOtherPosition[1])){
                this.gridOther[randomPosition[0]][randomPosition[1]] = i + 1;
                this.boulderOtherGroup.create(320 - 120 - 20 + 12 + 24 * randomPosition[0], 120 - 60 + 12 + 24 * randomPosition[1], 'boulder');
                this.answers[i] = randomPosition;
            } else {
                i--;
            }
        }

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
            if (this.playerPosition[1] - 2 > -1 && this.grid[this.playerPosition[0]][this.playerPosition[1] - 1] != 0 && this.grid[this.playerPosition[0]][this.playerPosition[1] - 2] == 0) {
                this.boulderGroup.getChildren()[this.grid[this.playerPosition[0]][this.playerPosition[1] - 1] - 1].setY(this.boulderGroup.getChildren()[this.grid[this.playerPosition[0]][this.playerPosition[1] - 1] - 1].y - 24);
                this.grid[this.playerPosition[0]][this.playerPosition[1] - 2] = this.grid[this.playerPosition[0]][this.playerPosition[1] - 1];
                this.grid[this.playerPosition[0]][this.playerPosition[1] - 1] = 0;
            }
            if (this.playerPosition[1] - 1 > -1 && this.grid[this.playerPosition[0]][this.playerPosition[1] - 1] == 0) {
                this.playerImage.setY(this.playerImage.y - 24);
                this.playerPosition[1] -= 1;
            }
        }
    }

    inputDown() {
        if (this.inputTime == true) {
            if (this.playerPosition[1] + 2 < 5 && this.grid[this.playerPosition[0]][this.playerPosition[1] + 1] != 0 && this.grid[this.playerPosition[0]][this.playerPosition[1] + 2] == 0) {
                this.boulderGroup.getChildren()[this.grid[this.playerPosition[0]][this.playerPosition[1] + 1] - 1].setY(this.boulderGroup.getChildren()[this.grid[this.playerPosition[0]][this.playerPosition[1] + 1] - 1].y + 24);
                this.grid[this.playerPosition[0]][this.playerPosition[1] + 2] = this.grid[this.playerPosition[0]][this.playerPosition[1] + 1];
                this.grid[this.playerPosition[0]][this.playerPosition[1] + 1] = 0;
            }
            if (this.playerPosition[1] + 1 < 5 && this.grid[this.playerPosition[0]][this.playerPosition[1] + 1] == 0) {
                this.playerImage.setY(this.playerImage.y + 24);
                this.playerPosition[1] += 1;
            }
        }
    }

    inputRight() {
        if (this.inputTime == true) {
            if (this.playerPosition[0] + 2 < 5 && this.grid[this.playerPosition[0] + 1][this.playerPosition[1]] != 0 && this.grid[this.playerPosition[0] + 2][this.playerPosition[1]] == 0) {
                this.boulderGroup.getChildren()[this.grid[this.playerPosition[0] + 1][this.playerPosition[1]] - 1].setX(this.boulderGroup.getChildren()[this.grid[this.playerPosition[0] + 1][this.playerPosition[1]] - 1].x + 24);
                this.grid[this.playerPosition[0] + 2][this.playerPosition[1]] = this.grid[this.playerPosition[0] + 1][this.playerPosition[1]];
                this.grid[this.playerPosition[0] + 1][this.playerPosition[1]] = 0;
            }
            if (this.playerPosition[0] + 1 < 5 && this.grid[this.playerPosition[0] + 1][this.playerPosition[1]] == 0) {
                this.playerImage.setX(this.playerImage.x + 24);
                this.playerPosition[0] += 1;
            }
        }
    }

    inputLeft() {
        if (this.inputTime == true) {
            if (this.playerPosition[0] - 2 > -1 && this.grid[this.playerPosition[0] - 1][this.playerPosition[1]] != 0 && this.grid[this.playerPosition[0] - 2][this.playerPosition[1]] == 0) {
                this.boulderGroup.getChildren()[this.grid[this.playerPosition[0] - 1][this.playerPosition[1]] - 1].setX(this.boulderGroup.getChildren()[this.grid[this.playerPosition[0] - 1][this.playerPosition[1]] - 1].x - 24);
                this.grid[this.playerPosition[0] - 2][this.playerPosition[1]] = this.grid[this.playerPosition[0] - 1][this.playerPosition[1]];
                this.grid[this.playerPosition[0] - 1][this.playerPosition[1]] = 0;
            }
            if (this.playerPosition[0] - 1 > -1 && this.grid[this.playerPosition[0] - 1][this.playerPosition[1]] == 0) {
                this.playerImage.setX(this.playerImage.x - 24);
                this.playerPosition[0] -= 1;
            }
        }
    }

    inputSpace() {
        if (this.inputTime == true) {
            this.inputTime = false;
            this.win = true;
            for (let i = 0; i < this.answers.length; i++) {
                if (this.grid[this.answers[i][0]][this.answers[i][1]] == 0) {
                    this.win = false;
                }
            }
            if (!(this.playerPosition[0] == this.playerOtherPosition[0] && this.playerPosition[1] == this.playerOtherPosition[1])){
                this.win = false;
            }
            if (this.win == true){
                this.correct.setVisible(true);
                this.sound.play('right');
            } else {
                this.incorrect.setVisible(true);
                this.sound.play('wrong');
            }
        }
    }
    
}
