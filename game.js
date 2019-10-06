var gameScene;

var levels =
    [
        [['tile24', 'tile34'], ['tile12', 'tile13']],

        [['tile24', 'tile234', 'tile34'], ['tile124', 'tile1234', 'tile134'], ['tile12', 'tile123', 'tile13']],
     
        [['tile34', 'tile24', 'tile34'], ['tile14', 'tile14', 'tile14'], ['tile12', 'tile13', 'tile12']],

        [['tile24', 'tile23', 'tile23', 'tile34'], ['tile12', 'tile23', 'tile23', 'tile13']],

        [['tile24', 'tile23', 'tile23', 'tile34'],
         ['tile12', 'tile234', 'tile234', 'tile13'],
         ['tile24', 'tile123', 'tile123', 'tile34'],
         ['tile12', 'tile23', 'tile23', 'tile13']],

        // [['j1', 'j2', 'j3'], ['j4', 'j5', 'j6'], ['j7', 'j8', 'j9'], ['j10', 'j11', 'j12']],

        [['tile24', 'tile234', 'tile234', 'tile234', 'tile34'],
         ['tile124', 'tile1234', 'tile1234', 'tile1234', 'tile134'],
         ['tile124', 'tile1234', 'tile1234', 'tile1234', 'tile134'],
         ['tile12', 'tile123', 'tile123', 'tile123', 'tile13']]
    ];

class GameScene extends Phaser.Scene {

    constructor(name, lvl) {
        super(name);
        this.lvl = lvl;
    }

    initialize() {
        if (this.tiles != null){
            for (var i = 0; i < this.tiles.length; i++) {
                for (var j = 0; j < this.tiles[0].length; j++) {
                    this.tiles[i][j].destroy();
                }
            }
        }
        
        this.prepattern = levels[this.lvl];
        this.pattern = shuffle(this.prepattern);

        this.width = this.prepattern[0].length;
        this.height = this.prepattern.length;
        this.tilesize = 150;
        this.left = (800 - this.tilesize * this.width) / 2 + this.tilesize/2;
        this.top = 100 + (4 - this.height) * this.tilesize / 2;
        
        this.tiles = [];
        for (var i = 0; i < this.height; i++) {
            this.tiles[i] = [];
        }

        this.flipped = null;
        this.flipped2 = null;
        this.locked = 0;
        this.verticalMode = false;
        this.winb = false;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var x = j * this.tilesize + this.left;
                var y = i * this.tilesize + this.top;
                this.tiles[i][j] = this.add.image(x, y, 'back-1111');
                this.pattern[i][j].connectedComponent = {i: i, j: j, w:1, h:1};
                this.tiles[i][j].setCrop(3, 3, 144, 144);
            }
        }

        this.emitter = this.add.particles('spark').createEmitter({
            x: 0,
            y: 0,
            on: false,
            blendMode: 'ADD',
            scale: { start: 1, end: 0 },
            speed: { min: -50, max: 50 },
            quantity: 50
        });

        this.badEmitter = this.add.particles('spark2').createEmitter({
            x: 0,
            y: 0,
            on: false,
            lifespan: 300,
            blendMode: 'SCREEN',
            scale: { start: 1.5, end: 0 },
            speed: { min: -100, max: 100 },
            quantity: 50
        });
    }
    
    preload() {
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
        this.load.image('5', 'assets/5.png');
        this.load.image('6', 'assets/6.png');
        this.load.image('7', 'assets/7.png');
        this.load.image('8', 'assets/8.png');
        this.load.image('9', 'assets/9.png');
        this.load.image('arrows', 'assets/arrows.png');
        this.load.image('arrows2', 'assets/arrows2.png');
        this.load.image('dismantle', 'assets/dismantle.png');
        this.load.image('tile12', 'assets/tile12.png');
        this.load.image('tile13', 'assets/tile13.png');
        this.load.image('tile14', 'assets/tile14.png');
        this.load.image('tile23', 'assets/tile23.png');
        this.load.image('tile24', 'assets/tile24.png');
        this.load.image('tile34', 'assets/tile34.png');
        this.load.image('tile123', 'assets/tile123.png');
        this.load.image('tile124', 'assets/tile124.png');
        this.load.image('tile134', 'assets/tile134.png');
        this.load.image('tile234', 'assets/tile234.png');
        this.load.image('tile1234', 'assets/tile1234.png');
        // this.load.image('j1', 'assets/Joconde1.jpg');
        // this.load.image('j2', 'assets/Joconde2.jpg');
        // this.load.image('j3', 'assets/Joconde3.jpg');
        // this.load.image('j4', 'assets/Joconde4.jpg');
        // this.load.image('j5', 'assets/Joconde5.jpg');
        // this.load.image('j6', 'assets/Joconde6.jpg');
        // this.load.image('j7', 'assets/Joconde7.jpg');
        // this.load.image('j8', 'assets/Joconde8.jpg');
        // this.load.image('j9', 'assets/Joconde9.jpg');
        // this.load.image('j10', 'assets/Joconde10.jpg');
        // this.load.image('j11', 'assets/Joconde11.jpg');
        // this.load.image('j12', 'assets/Joconde12.jpg');

        this.load.image('spark', 'assets/spark.png');
        this.load.image('spark2', 'assets/spark2.png');
        // Create textures
        function createTextureBackCard(name, top, right, left, down, self) {
            var graph = self.make.graphics().setVisible(false);
            graph.clear();
            function fillCenteredRoundedRect(k, t, r, l, b) {
                var x = l ? k : -20;
                var y = t ? k : -20;
                graph.fillRoundedRect(x, y, 150 - x - (r ? k : -20), 150 - y - (b ? k : -20), 15);
            }
            graph.fillStyle(0xac87600);
            fillCenteredRoundedRect(3, top, right, left, down);
            graph.fillStyle(0xa96300);
            fillCenteredRoundedRect(6, top, right, left, down);
            graph.fillStyle(0xac87600);
            fillCenteredRoundedRect(9, top, right, left, down);
            graph.lineStyle(3, 0x764500);
            var spaceleft = left ? 15 : -5;
            var spaceright = right ? 15 : -5;
            var spacetop = top ? 15 : -5;
            var spacedown = down ? 15 : -5;
            for (var i = 0; i < 16; i++) {
                var x = spaceleft;
                var y = (i * 15) - (x - 15)/2;
                var z = 150 - spaceright;
                var t = (i * 15) - (z - 15)/2;
                if (t <= spacetop) {
                    var delta = spacetop - t;
                    t = spacetop;
                    z -= delta * 2;
                }
                if (y >= 150 - spacedown) {
                    var delta2 = y - 150 + spacedown;
                    y = 150 - spacedown;
                    x += delta2 * 2;
                }
                if (x < z)
                    graph.lineBetween(x, y, z, t);
            }
            graph.generateTexture(name, 150, 150);
        }
        for (var a = 0; a <= 1; a++) {
            for (var b = 0; b <= 1; b++) {
                for (var c = 0; c <= 1; c++) {
                    for (var d = 0; d <= 1; d++) {
                        createTextureBackCard('back-' + a + b + c + d, a == 1, b == 1, c == 1, d == 1, this);
                    }
                }
            }
        }
    }
    
    create() {
        this.add.rectangle(400, 450, 800, 900, 0xFFFFFF);
        this.initialize();
        this.input.on('pointerdown', function (self) {return function(pointer) {self.click(pointer, self)}}(this));

        this.button = this.add.image(300, 4 * this.tilesize + 125, 'arrows').setInteractive()
            .on('pointerdown', function (self) {return function() {if (self.locked == 0) {self.verticalMode = ! self.verticalMode; self.button.setTexture(self.verticalMode ? 'arrows2' : 'arrows' );}}}(this));
        this.button2 = this.add.image(500, 4 * this.tilesize + 125, 'dismantle').setInteractive().on('pointerdown', function(self) {return function() {if (self.locked == 0) {self.dismantle()}}}(this));
    }

    click(pointer, self) {
        var i = Math.round((pointer.y - self.top) / self.tilesize);
        var j = Math.round((pointer.x - self.left) / self.tilesize);
        var x = pointer.x;
        var y = pointer.y;

        if (i < 0 || j < 0 || i >= self.height || j >= self.width)
            return;
        if (self.locked > 0)
            return;
        if (self.isVisible(i, j)) {
            self.locked++;
            self.reset();
            return;
        }

        // We flip it
        self.flip(self.pattern[i][j].connectedComponent, false);
        if (self.flipped != null) {
            // If another one is flipped, we try to connect them
            self.flipped2 = self.pattern[i][j].connectedComponent
            self.connect(self.flipped, self.flipped2);

            // And then we reset
            self.locked++;
            self.time.delayedCall(self.emitter.shouldExplode ? 1300 : 1000, self.reset, [], self);
        }
        else {
            self.flipped = self.pattern[i][j].connectedComponent;
        }
    }

    getBackTexture(i, j) {
        var cc = this.pattern[i][j].connectedComponent;
        var a = (j == cc.j);
        var b = (j == cc.j + cc.w - 1);
        var c = (i == cc.i);
        var d = (i == cc.i + cc.h - 1);
        if (this.pattern[i][j].flipped)
            return ("back-" + (d ? 1 : 0) + (a ? 1 : 0) + (b ? 1 : 0) + (c ? 1 : 0));
        else
            return ("back-" + (c ? 1 : 0) + (b ? 1 : 0) + (a ? 1 : 0) + (d ? 1 : 0));            
    }
    
    isVisible(i, j) {
        if (this.flipped === null)
            return false;
        return (i >= this.flipped.i && j >= this.flipped.j
                && i < this.flipped.i + this.flipped.h
                && j < this.flipped.j + this.flipped.w);
    }
    
    flip(cc, flipback) {
        // Update the pattern
        for (var i = cc.i; i < cc.i + (this.verticalMode ? cc.h / 2 : cc.h); i++) {
            for (var j = cc.j; j < cc.j + (this.verticalMode ? cc.w : cc.w / 2); j++) {
                var newi = this.verticalMode ? (cc.i - i) + cc.i + cc.h - 1 : i;
                var newj = this.verticalMode ? j : (cc.j - j) + cc.j + cc.w - 1;

                var tmp = this.pattern[i][j];
                this.pattern[i][j] = this.pattern[newi][newj];
                this.pattern[newi][newj] = tmp;

                this.pattern[i][j].flipped = (this.pattern[i][j].flipped != this.verticalMode);
                if (newi != i || newj != j) {
                    this.pattern[newi][newj].flipped = (this.pattern[newi][newj].flipped != this.verticalMode);
                }
            }
        }

        // Set up the animations
        for (var i = cc.i; i < cc.i + cc.h; i++) {
            for (var j = cc.j; j < cc.j + cc.w; j++) {
                var newi = this.verticalMode ? (cc.i - i) + cc.i + cc.h - 1 : i;
                var newj = this.verticalMode ? j : (cc.j - j) + cc.j + cc.w - 1;

                this.locked++;
                this.flipTween =
                    this.tweens.add({
                        targets: this.tiles[i][j],
                        scaleX : {from: 1, to: this.verticalMode ? 1 : 0},
                        x: '+=' + (this.verticalMode ? 0 : ((cc.w - 1)/2 - (j - cc.j)) * this.tilesize),
                        scaleY: {from: 1, to: this.verticalMode ? 0 : 1},
                        y: '+=' + (this.verticalMode ? ((cc.h - 1)/2 - (i - cc.i)) * this.tilesize : 0),
                        ease : 'Quad.easeOut', duration : 150, yoyo: true});
                this.flipTween.on('yoyo', function(i, j, newtile, v, self) {return function() {
                    self.tiles[i][j].setTexture(newtile);
                    self.tiles[i][j].angle = v ? 180 : 0;
                    self.updateCropping();
                }}(i, j, (flipback ? this.getBackTexture(i, j) : this.pattern[i][j].tile), this.pattern[i][j].flipped, this));
                this.flipTween.on('complete', function(i, j, self) {return function() {
                    self.locked--;
                    if (self.emitter.shouldExplode) {
                        self.emitter.explode();
                        if (self.pattern[i][j].connectedComponent.w == self.width && self.pattern[i][j].connectedComponent.h == self.height)
                            self.time.delayedCall(2000, self.win, [], self);
                    }
                    self.emitter.shouldExplode = false;
                    if (self.badEmitter.shouldExplode)
                        self.badEmitter.explode();
                    self.badEmitter.shouldExplode = false;
                    self.shakeAll();
                }}(i, j, this));
            }
        }
    }

    shakeAll() {
        if (! this.shake)
            return;
        this.shake = false;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (this.tiles[i][j].shake) {
                    this.tiles[i][j].shake = false;
                    this.tweens.add({
                        targets: this.tiles[i][j],
                        x: '+=10',
                        ease: 'Quad.easeIn', // function (t) {
                        //     return (t * Math.cos(t * Math.PI * 2));
                        // },
                        duration: 100,
                        // onComplete: function (i, j, self) {return function() {
                        //     self.tiles[i][j].x = i * self.tilesize + self.left;
                        //     self.tiles[i][j].y = j * self.tilesize + self.top;
                        // }} (i, j, this),
                        yoyo: true});
                };
            }
        }
    }

    
    connectAt(i, j, ii, jj) {
        this.connect(this.pattern[i][j].connectedComponent, this.pattern[ii][jj].connectedComponent);
    }
    
    connect(cc1, cc2) {
        var newcc = null;
        var compatible = true;
        var v1, v2;
        var line;

        // Check whether it makes a rectangle and whether the sides are compatible
        if (cc1.i == cc2.i && cc1.h == cc2.h && (cc1.j + cc1.w == cc2.j || cc2.j + cc2.w == cc1.j))
        {
            newcc = {};
            newcc.i = cc1.i;
            newcc.j = Math.min(cc1.j, cc2.j);
            newcc.h = cc1.h;
            newcc.w = cc1.w + cc2.w;

            var x = Math.max(cc1.j, cc2.j) * this.tilesize + this.left - this.tilesize / 2;
            for (var i = cc1.i; i < cc1.i + cc1.h; i++) {
                v1 = this.sideValue(this.pattern[i][Math.max(cc1.j, cc2.j) - 1], 2);
                v2 = this.sideValue(this.pattern[i][Math.max(cc1.j, cc2.j)], 3);
                compatible = compatible && (v1 === v2);
            }
            line = new Phaser.Geom.Line(
                x, cc1.i * this.tilesize + this.top - this.tilesize / 2,
                x, (cc1.i + cc1.h) * this.tilesize + this.top - this.tilesize / 2);
        }
        if (cc1.j == cc2.j && cc1.w == cc2.w && (cc1.i + cc1.h == cc2.i || cc2.i + cc2.h == cc1.i))
        {
            newcc = {}
            newcc.i = Math.min(cc1.i, cc2.i);
            newcc.j = cc1.j;
            newcc.h = cc1.h + cc2.h;
            newcc.w = cc1.w;

            var y = Math.max(cc1.i, cc2.i) * this.tilesize + this.top - this.tilesize / 2;
            for (var j = cc1.j; j < cc1.j + cc1.w; j++) {
                v1 = this.sideValue(this.pattern[Math.max(cc1.i, cc2.i) - 1][j], 4);
                v2 = this.sideValue(this.pattern[Math.max(cc1.i, cc2.i)][j], 1);
                compatible = compatible && (v1 === v2);
            }
            line = new Phaser.Geom.Line(
                cc1.j * this.tilesize + this.left - this.tilesize / 2, y,
                (cc1.j + cc1.w) * this.tilesize + this.left - this.tilesize / 2, y);
        }

        // If it doesn’t make a rectangle, abort
        if (newcc == null) {
            for (var i = cc1.i; i < cc1.i + cc1.h; i++) {
                for (var j = cc1.j; j < cc1.j + cc1.w; j++) {
                    this.tiles[i][j].shake = true;
                }
            }
            for (var i = cc2.i; i < cc2.i + cc2.h; i++) {
                for (var j = cc2.j; j < cc2.j + cc2.w; j++) {
                    this.tiles[i][j].shake = true;
                }
            }
            this.shake = true;
            return;
        }

        if (! compatible) {
            this.badEmitter.setEmitZone({
                source: line,
                type: 'edge',
                quantity: 50
            });
            this.badEmitter.shouldExplode = true;
            return;
        }

        this.emitter.setEmitZone({
            source: line,
            type: 'edge',
            quantity: 50
        });
        this.emitter.shouldExplode = true;
        
        // Update the connected components of every tile
        for (var i = cc1.i; i < cc1.i + cc1.h; i++) {
            for (var j = cc1.j; j < cc1.j + cc1.w; j++) {
                this.pattern[i][j].connectedComponent = newcc;
            }
        }
        for (var i = cc2.i; i < cc2.i + cc2.h; i++) {
            for (var j = cc2.j; j < cc2.j + cc2.w; j++) {
                this.pattern[i][j].connectedComponent = newcc;
            }
        }
        this.flipped = newcc;
        this.flipped2 = null;

        this.updateCropping();
    }

    updateCropping() {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var cc = this.pattern[i][j].connectedComponent;
                var left = (j == cc.j) ? 3 : 0;
                var top = (i == cc.i) ? 3 : 0;
                var right = (j == cc.j + cc.w - 1) ? 3 : 0;
                var bot = (i == cc.i + cc.h - 1) ? 3 : 0;
                if (this.pattern[i][j].flipped)
                    this.tiles[i][j].setCrop(right, bot, this.tilesize - left - right, this.tilesize - top - bot);
                else
                    this.tiles[i][j].setCrop(left, top, this.tilesize - left - right, this.tilesize - top - bot);
            }
        }
    }

    dismantle() {
        if (this.flipped === null)
            return;
        for (var i = this.flipped.i; i < this.flipped.i + this.flipped.h; i++) {
            for (var j = this.flipped.j; j < this.flipped.j + this.flipped.w; j++) {
                this.pattern[i][j].connectedComponent = {i: i, j: j, h: 1, w: 1};
                this.flip(this.pattern[i][j].connectedComponent, true);
            }
        }
        this.updateCropping();
        this.flipped = null;
        this.flipped2 = null;
    }
    
    reset() {
        if (this.winb)
            return;
        if (this.flipped !== null)  this.flip(this.flipped, true);
        if (this.flipped2 !== null) this.flip(this.flipped2, true);
        this.flipped = null;
        this.flipped2 = null;
        this.locked--;
    }

    // Detecting compatibility

    sideValue(tilef, dir) {
        var tile = tilef.tile;
        dir = (tilef.flipped) ? (5 - dir) : dir;
        var isRoad, other = false;
        switch (tile) {
        case "tile12":   isRoad = ((dir === 1 || dir == 2)); break;
        case "tile13":   isRoad = ((dir === 1 || dir == 3)); break;
        case "tile14":   isRoad = ((dir === 1 || dir == 4)); break;
        case "tile23":   isRoad = ((dir === 2 || dir == 3)); break;
        case "tile24":   isRoad = ((dir === 2 || dir == 4)); break;
        case "tile34":   isRoad = ((dir === 3 || dir == 4)); break;
        case "tile123":  isRoad = (dir !== 4); break;
        case "tile124":  isRoad = (dir !== 3); break;
        case "tile134":  isRoad = (dir !== 2); break;
        case "tile234":  isRoad = (dir !== 1); break;
        case "tile1234": isRoad = true; break;
        default: other = true
        }
        if (! other) {
            if (isRoad)
                return "road";
            else
                return "noRoad";
        }

        var itile, jtile;
        for (var i = 0; i < this.prepattern.length; i++) {
            for (var j = 0; j < this.prepattern[0].length; j++) {
                if (this.prepattern[i][j] === tile) {
                    itile = i;
                    jtile = j;
                }
            }
        }

        switch (dir) {
        case 1:
            return ("" + itile + " " + jtile + "h");
        case 2:
            return ("" + itile + " " + (jtile + 1) + "v");
        case 3:
            return ("" + itile + " " + jtile + "v");
        case 4:
            return ("" + (itile + 1) + " " + jtile + "h");
        }
    }

    win() {
        this.winb = true;
        this.lvl++;
        this.initialize();
    }
}

gameScene = new GameScene('game', 0);

// Shuffling the initial position

function shuffleRec(pattern, i0, j0) {
    var w = pattern[i0][j0].connectedComponent.w;
    var h = pattern[i0][j0].connectedComponent.h;

    // Decide whether to flip this component
    if (Math.random() >= 0.5) {
        for (var i = i0; i < i0 + h/2; i++) {
            for (var j = j0; j < j0 + w; j++) {
                var newi = (i0 - i) + i0 + h - 1;
                var newj = (j0 - j) + j0 + w - 1;
                var tmp = pattern[i][j];
                if (i == i0 + (h - 1) / 2 && j >= j0 + w / 2)
                    continue;
                pattern[i][j] = pattern[newi][newj];
                pattern[newi][newj] = tmp;
                pattern[i][j].flipped = ! pattern[i][j].flipped;
                if (i != newi || j != newj)
                    pattern[newi][newj].flipped = ! pattern[newi][newj].flipped;
            }
        }
    }

    // If it is a simple square, we are done
    if (w == 1 && h == 1)
        return;

    // Decide where to split
    var verticalSplit;
    if (w == 1)
        verticalSplit = false;
    if (h == 1)
        verticalSplit = true;
    if (w > 1 && h > 1)
        verticalSplit = (Math.random() >= 0.5);
    
    var splitPosition = 1 + Math.floor(Math.random() * ((verticalSplit ? w : h) - 1));

    // Split the connected components
    var cc1, cc2;
    if (verticalSplit) {
        cc1 = {i: i0, j: j0, w: splitPosition, h: h};
        cc2 = {i: i0, j: j0 + splitPosition, w: w - splitPosition, h: h};
        for (var i = i0; i < i0 + h; i++) {
            for (var j = j0; j < j0 + w; j++) {
                pattern[i][j].connectedComponent = (j - j0 < splitPosition) ? cc1 : cc2;
            }
        }
    } else {
        cc1 = {i: i0, j: j0, w: w, h: splitPosition};
        cc2 = {i: i0 + splitPosition, j: j0, w: w, h: h - splitPosition};
        for (var i = i0; i < i0 + h; i++) {
            for (var j = j0; j < j0 + w; j++) {
                pattern[i][j].connectedComponent = (i - i0 < splitPosition) ? cc1 : cc2;
            }
        }
    }
    shuffleRec(pattern, i0, j0);
    shuffleRec(pattern, (verticalSplit ? i0 : i0 + splitPosition), (verticalSplit ? j0 + splitPosition : j0));
}

function shuffle(prepattern) {
    var height = prepattern.length;
    var width = prepattern[0].length;
    var pattern = [];
    for (var i = 0; i < height; i++) {
        pattern[i] = [];
        for (var j = 0; j < width; j++) {
            pattern[i][j] = {tile: prepattern[i][j], flipped: false, connectedComponent: {i:0, j:0, w:width, h:height}}
        }
    }
    shuffleRec(pattern, 0, 0);
    return pattern;
}
