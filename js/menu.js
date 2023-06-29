var MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function MenuScene() {
        Phaser.Scene.call(this, { key: 'MenuScene' });
    },
    preload: function () {
        this.load.image('background1', 'assets/backgroundPixel/Castelo.png');
        this.load.image('background2', 'assets/backgroundPixel/Floresta.png');
        this.load.image('background3', 'assets/backgroundPixel/MontanhasNoite.png');

        // Icones
        this.load.image('therion', 'assets/personagem/therion/Therion.png');
        this.load.image('olberic', 'assets/personagem/olberion/Olberic.png');
        this.load.image('ophelia', 'assets/personagem/ophelia/Ophelia.png');
        this.load.image('primrose', 'assets/personagem/primrose/Primrose.png');

        this.load.image('title', 'assets/logo.png');
        this.load.audio('menuTheme', 'assets/sound/menuTheme.mp3');
        this.load.image('icon', 'assets/sound.png');
    },
    create: function () {
        var canvasWidth = this.sys.game.config.width;
        var canvasHeight = this.sys.game.config.height;
        var audio = this.sound.add('menuTheme');
        audio.volume = 0.3;
        audio.play();
        var audioOn = true;

        window.playerSel = 0;
        var backgroundImages = ['background1', 'background2', 'background3'];
        var background = this.add.image(0, 0, backgroundImages[0])
            .setOrigin(0)
            .setDisplaySize(canvasWidth, canvasHeight);
        this.tweens.add({
            targets: background,
            duration: 10000,
            alpha: 0,
            yoyo: true,
            repeat: -1,
            onYoyo: function () {
                var randomIndex = Phaser.Math.Between(0, backgroundImages.length - 1);
                background.setTexture(backgroundImages[randomIndex]);
            }
        });
        var title = this.add.image(canvasWidth / 2, 80, 'title')
            .setOrigin(0.5, 0)
            .setScale(0.8);
        var soundButton = this.add.image(100, 100, 'icon')
            .setInteractive()
            .on('pointerdown', function () {
                console.log('Botão clicado!');
                toggleAudio();
            });
        function toggleAudio() {
            if (audioOn) {
                audio.pause();
                audioOn = false;
            } else {
                audio.play();
                audioOn = true;
            }
        }
        var startButton = this.add.text(canvasWidth / 2, canvasHeight - 150, 'Iniciar', {
            font: '24px TimesNewRoman',
            fill: '#ffffff',
            backgroundColor: '#292929',
            padding: {
                x: 10,
                y: 6
            }
        }).setOrigin(0.5, 4).setInteractive();

        startButton.on('pointerdown', function () {
            audio.pause();
            this.scene.start('BattleScene');
        }, this);

        var selectButton = this.add.text(canvasWidth / 2, canvasHeight - 150, 'Selecione o Personagem', {
            font: '24px TimesNewRoman',
            fill: '#ffffff',
            backgroundColor: '#292929',
            padding: {
                x: 10,
                y: 6
            }
        }).setOrigin(0.5, 2).setInteractive();

        selectButton.on('pointerdown', function () {
            this.openPopup();
        }, this);

        this.selectPopupGroup = this.add.group();
    },
    openPopup: function () {
        var canvasWidth = this.sys.game.config.width;
        var canvasHeight = this.sys.game.config.height;
        var popupBackground = this.add.rectangle(canvasWidth / 2, canvasHeight / 2, 912, 500, 0x000000, 0.7);
        this.selectPopupGroup.add(popupBackground);
        var popupText = this.add.text(canvasWidth / 2, canvasHeight / 2 - 70, 'Selecione um Personagem', {
            font: '24px TimesNewRoman',
            fill: '#ffffff'
        }).setOrigin(0.5, 4);
        this.selectPopupGroup.add(popupText);

        var iconNames = ['therion', 'olberic', 'ophelia', 'primrose'];
        var iconSpacing = 200;
        var startX = (canvasWidth - (iconSpacing * (iconNames.length - 1))) / 2;

        for (var i = 0; i < iconNames.length; i++) {
            var icon = this.add.image(startX + (i * iconSpacing), canvasHeight / 2, iconNames[i])
                .setScale(1.3)
                .setInteractive();
            icon.on('pointerdown', function () {
                console.log('Ícone clicado:', this.texture.key);
                var iconKey = this.texture.key;
                if (iconKey === 'olberic') {
                    playerSel = 0;
                } else if (iconKey === 'primrose') {
                    playerSel = 1;
                } else if (iconKey === 'therion') {
                    playerSel = 2;
                } else if (iconKey === 'ophelia') {
                    playerSel = 3;
                }

                console.log('Ícone clicado:', iconKey);
                console.log('Valor de playerSel:', this.scene.playerSel);
                this.scene.closePopup();

            }, icon);

            this.selectPopupGroup.add(icon);
        }
    },
    closePopup: function () {
        this.selectPopupGroup.clear(true, true);
    }
});