export default class Snake {
  constructor(scene) {
    this.scene = scene;
    this.lastMoveTime = 0;
    this.moveInterval = 100;
    this.tileSize = 16;
    this.direction = Phaser.Math.Vector2.RIGHT;
    this.body = [];
    this.body.push(
      this.scene.add
        .rectangle(
          this.scene.game.config.width / 2,
          this.scene.game.config.height / 2,
          this.tileSize,
          this.tileSize,
          0x00ff00
        )
        .setOrigin(0)
    );

    this.apple = this.scene.add
      .rectangle(0, 0, this.tileSize, this.tileSize, 0x0000ff)
      .setOrigin(0);

    this.positionApple();

    scene.input.keyboard.on('keydown', (e) => {
      this.keydown(e);
    });
  }

  positionApple() {
    this.apple.x =
      Math.floor(
        (Math.random() * this.scene.game.config.width) / this.tileSize
      ) * this.tileSize;
    this.apple.y =
      Math.floor(
        (Math.random() * this.scene.game.config.height) / this.tileSize
      ) * this.tileSize;
  }

  keydown(event) {
    switch (event.keyCode) {
      case 37: // Left
      case 65:
        if (this.direction !== Phaser.Math.Vector2.RIGHT) {
          this.direction = Phaser.Math.Vector2.LEFT;
        }
        break;
      case 38: // Up
      case 87:
        if (this.direction !== Phaser.Math.Vector2.DOWN) {
          this.direction = Phaser.Math.Vector2.UP;
        }
        break;
      case 39: // Right
      case 68:
        if (this.direction !== Phaser.Math.Vector2.LEFT) {
          this.direction = Phaser.Math.Vector2.RIGHT;
        }
        break;
      case 40: // Down
      case 83:
        if (this.direction !== Phaser.Math.Vector2.UP) {
          this.direction = Phaser.Math.Vector2.DOWN;
        }
        break;
    }
  }

  update(time) {
    if (time >= this.lastMoveTime + this.moveInterval) {
      this.move();
      this.lastMoveTime = time;
    }
  }

  move() {
    let new_x = this.body[0].x + this.direction.x * this.tileSize;
    let new_y = this.body[0].y + this.direction.y * this.tileSize;

    if (this.apple.x == new_x && this.apple.y == new_y) {
      this.body.push(
        this.scene.add
          .rectangle(
            /*unused*/ 0,
            /*unused*/ 0,
            this.tileSize,
            this.tileSize,
            0xffff00
          )
          .setOrigin(0)
      );
      this.positionApple();
    }

    for (let index = this.body.length - 1; index > 0; index--) {
      this.body[index].x = this.body[index - 1].x;
      this.body[index].y = this.body[index - 1].y;
    }
    this.body[0].x = new_x;
    this.body[0].y = new_y;

    // Death by going off the screen
    if (
      new_x < 0 ||
      new_x > this.scene.game.config.width ||
      new_y < 0 ||
      new_y > this.scene.game.config.height
    ) {
      this.scene.scene.restart();
    }

    // Death by eating own tail
    let tail = this.body.slice(1);
    if (tail.some((s) => s.x == this.body[0].x && s.y == this.body[0].y)) {
      this.scene.scene.restart();
    }
  }
}
