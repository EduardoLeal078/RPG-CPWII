var backgrounds = ['assets/backgroundPixel/FlorestaDia.png', 'assets/backgroundPixel/Cogumelos.png', 'assets/backgroundPixel/deserto.png', 'assets/backgroundPixel/Floresta.png', 'assets/backgroundPixel/Castelo.png'];
var enemys = ['assets/inimigos/steora.png', 'assets/inimigos/dreisang.png', 'assets/inimigos/Balogar.png', 'assets/inimigos/Gareth.png', 'assets/inimigos/dragao.png'];
var players = ['assets/personagem/olberion/ataqueol1.png', 'assets/personagem/primrose/ataquepr1.png', 'assets/personagem/therion/ataqueth1.png', 'assets/personagem/ophelia/ataqueop1.png'];
var currentenemydIndex = 0;
var currentBackgroundIndex = 0;
//Variaveis de Recompensa
var dano = 0;
var vida = 0;
var vidaB = 0;
var cura = 0;
var playerSel = window.playerSel;

var BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BattleScene() {
    Phaser.Scene.call(this, { key: 'BattleScene' });
  },

  preload: function () {
    //Imagens de Fundo,Player e bosses
    for (var i = 0; i < backgrounds.length; i++) {
      this.load.image('background' + i, backgrounds[i]);
    }
    for (var i = 0; i < enemys.length; i++) {
      this.load.image('enemy' + i, enemys[i]);
    }
    for (var i = 0; i < players.length; i++) {
      this.load.image('player' + i, players[i]);
    }
    //Imagens da Animação
    this.load.image('ataqueol1', 'assets/personagem/olberion/ataqueol1.png');
    this.load.image('ataqueol2', 'assets/personagem/olberion/ataqueol2.png');
    this.load.image('ataqueop1', 'assets/personagem/ophelia/ataqueop1.png');
    this.load.image('ataqueop2', 'assets/personagem/ophelia/ataqueop2.png');
    this.load.image('ataquepr1', 'assets/personagem/primrose/ataquepr1.png');
    this.load.image('ataquepr2', 'assets/personagem/primrose/ataquepr2.png');
    this.load.image('ataqueth1', 'assets/personagem/therion/ataqueth1.png');
    this.load.image('ataqueth2', 'assets/personagem/therion/ataqueth2.png');
    //Audio de Batalha
    this.load.audio('battleTheme', 'assets/sound/bossBattle.mp3');
    this.load.image('icon', 'assets/sound.png');
  },
  create: function () {
    var scene = this;
    var background = this.add.image(0, 0, 'background' + currentBackgroundIndex)
      .setOrigin(0)
      .setDisplaySize(this.game.config.width, 512);
    var audio = this.sound.add('battleTheme');
    audio.volume = 0.3;
    audio.play();
    var audioOn = true;
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
    //Personagem e Inimigo ============================================================
    var enemyX = 250;
    var enemyY = this.game.config.height / 2 - 50;
    var playerX = this.game.config.width - 250;
    var playerY = this.game.config.height / 2 + 50;
    var enemy = this.add.image(enemyX, enemyY, 'enemy' + currentenemydIndex)
      .setOrigin(0.5, 0.5)
      .setScale(1.5);
    var player = this.add.image(playerX, playerY, 'player' + playerSel)
      .setOrigin(0.5, 0.5)
      .setScale(2.0);
    //Barra de Vida ===================================================================
    var enemyHealth = 100 + vidaB;
    var playerHealth = 100 + vida;
    var maxBarWidth = this.game.config.width * 0.3;
    var barWidth = Math.min(200, maxBarWidth);
    var barHeight = 20;
    var backgroundHeight = background.height;
    var menuBoxY = backgroundHeight;
    var menuBox = this.add.graphics();
    menuBox.fillStyle(0x0000ff, 0.7);
    menuBox.fillRect(0, menuBoxY, this.game.config.width, 50);
    var menuBoxBorder = this.add.graphics();
    menuBoxBorder.lineStyle(2, 0xffffff);
    menuBoxBorder.strokeRect(0, menuBoxY, this.game.config.width, 50);
    //Botões de Ação ==================================================================
    var buttonWidth = 200;
    var buttonX = this.sys.game.config.width / 2 - buttonWidth - 10;
    var buttonY = menuBoxY + 25;
    //Ataque ==========================================================================
    var attackButton = this.add.text(buttonX, buttonY, 'Atacar', {
      font: '24px Arial',
      fill: '#ffffff'
    });
    attackButton.setOrigin(0.5);
    attackButton.setInteractive();
    var buttonOn = true;
    attackButton.on('pointerdown', function () {
      if (buttonOn) {
        attackEnemy();
        buttonOn = false;
        setTimeout(function () {
          buttonOn = true;
        }, 1500);
      }
    });
    var attackButtonBorder = this.add.graphics();
    attackButtonBorder.lineStyle(2, 0xffffff);
    attackButtonBorder.strokeRect(buttonX - buttonWidth / 2, buttonY - 15, buttonWidth, 30);
    buttonX += buttonWidth + 10;
    //Cura =============================================================================
    var healButton = this.add.text(buttonX, buttonY, 'Curar', {
      font: '24px Arial',
      fill: '#ffffff'
    });
    healButton.setOrigin(0.5);
    healButton.setInteractive();
    healButton.on('pointerdown', healPlayer);
    var healButtonBorder = this.add.graphics();
    healButtonBorder.lineStyle(2, 0xffffff);
    healButtonBorder.strokeRect(buttonX - buttonWidth / 2, buttonY - 15, buttonWidth, 30);
    buttonX += buttonWidth + 10;
    var exitButton = this.add.text(buttonX, buttonY, 'Sair', {
      font: '24px Arial',
      fill: '#ffffff'
    });
    //Sair =================================================================================
    exitButton.setOrigin(0.5);
    exitButton.setInteractive();
    exitButton.on('pointerdown', exitBattle);
    var exitButtonBorder = this.add.graphics();
    exitButtonBorder.lineStyle(2, 0xffffff);
    exitButtonBorder.strokeRect(buttonX - buttonWidth / 2, buttonY - 15, buttonWidth, 30);
    //Menu com Barras de vida ==============================================================
    var menuVida = this.add.graphics();
    menuVida.fillStyle(0x0000ff, 0.7);
    menuVida.fillRect(0, menuBoxY + 50, this.game.config.width, 150);
    var bossBarX = 125;
    var bossBarY = menuBoxY + 80;
    var bossHealthBar = this.add.graphics();
    bossHealthBar.fillStyle(0x00ff00);
    bossHealthBar.fillRect(bossBarX, bossBarY, barWidth, barHeight);
    var barTotalLength = barWidth + 50;
    var playerBarX = this.game.config.width - barTotalLength - 80;
    var playerBarY = menuBoxY + 80;
    var playerHealthBar = this.add.graphics();
    playerHealthBar.fillStyle(0x00ff00);
    playerHealthBar.fillRect(playerBarX, playerBarY, barWidth, barHeight);
    var playerHealthBarMargin = this.add.graphics();
    playerHealthBarMargin.fillStyle(0x000000, 0);
    playerHealthBarMargin.fillRect(playerBarX + barWidth, playerBarY, 50, barHeight);
    var bossLabel = this.add.text(bossBarX + barWidth / 2, bossBarY + 21, 'Boss', {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    });
    bossLabel.setOrigin(3.7, 1);
    var playerLabel = this.add.text(playerBarX + barWidth / 2, playerBarY + 21, 'Player', {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    });
    playerLabel.setOrigin(3.5, 1);
    var hpP = this.add.text(playerBarX + barWidth / 2, playerBarY + 21, playerHealth, {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    });
    hpP.setOrigin(-2, 1);
    var hpB = this.add.text(bossBarX + barWidth / 2, bossBarY + 21, enemyHealth, {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    });
    hpB.setOrigin(-2, 1);
    //Mudar Sprite de Personagem ====================================================
    function changePlayerImage(newImageKey) {
      player.setTexture(newImageKey);
    }
    // Função para o personagem atacar ==============================================
    function attackEnemy() {
      var a, b;
      if (playerSel == 0) { a = 4; b = 6; atqOlbe(); }
      else if (playerSel == 1) { a = 5; b = 7; atqPrim(); }
      else if (playerSel == 2) { a = 5; b = 7; atqTher(); }
      else if (playerSel == 3) { a = 3; b = 5; atqOphe(); }
      var damage = Phaser.Math.Between(a, b) + dano;
      enemyHealth -= damage;
      hpB.setText(enemyHealth);
      var bossHealthWidth = (enemyHealth / 100) * barWidth;
      bossHealthBar.clear();
      bossHealthBar.fillStyle(0xff0000);
      bossHealthBar.fillRect(bossBarX, bossBarY, bossHealthWidth, barHeight);
      if (enemyHealth <= 0) {
        audio.pause();
        popup();
      } else {
        scene.time.delayedCall(1000, bossAttack, [], scene);
        console.log('VidaPlayer:', playerHealth);
        console.log('Vida Boss:', enemyHealth);
        atqTexto();
      }
    }
    //Ataque do Boss ===================================================
    function bossAttack() {
      var enemyDamage = Phaser.Math.Between(3, 7);
      changeEnemyOrigin(-0.5, 0.5);
      setTimeout(function () {
        changeEnemyOrigin(0.5, 0.5);
      }, 100);
      playerHealth -= enemyDamage;
      hpP.setText(playerHealth);
      var playerHealthWidth = (playerHealth / 100) * barWidth;
      playerHealthBar.clear();
      playerHealthBar.fillStyle(0xff0000);
      playerHealthBar.fillRect(playerBarX, playerBarY, playerHealthWidth, barHeight);
      if (playerHealth <= 0) {
        audio.stop();
        var textBack = this.add.rectangle(455, 300, 912, 50, 0x000000);
        textBack.setOrigin(0.5);
        var deathText = this.add.text(400, 300, 'Você Morreu!!!', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        deathText.setOrigin(0.6);
        this.tweens.add({
          targets: deathText,
          alpha: 0,
          duration: 2000,
          delay: 2000,
          onComplete: function () {
            scene.scene.start('MenuScene');
          }
        });
      }
    }
    // Função para curar o personagem ============================================
    function healPlayer() {
      var a, b;
      if (playerSel == 0) { a = 4; b = 9; }
      else if (playerSel == 1) { a = 3; b = 6; }
      else if (playerSel == 2) { a = 1; b = 7; }
      else if (playerSel == 3) { a = 10; b = 13; }
      var healAmount = Phaser.Math.Between(a, b) + cura;
      console.log('Cura recebida:', healAmount);
      playerHealth += healAmount;
      if (playerHealth > 125) {
        playerHealth = 125;
      }
      var playerHealthWidth = (playerHealth / 100) * barWidth;
      playerHealthBar.clear();
      playerHealthBar.fillStyle(0x00ff00);
      playerHealthBar.fillRect(playerBarX, playerBarY, playerHealthWidth, barHeight);

      scene.time.delayedCall(1000, bossAttack, [], scene);
    }
    // Função para retornar ao menu ==========================================
    function exitBattle() {
      audio.stop();
      reset();
      scene.scene.start('MenuScene');
    }
    //Resetar Batalha
    function reset() {
      dano = vida = vidaB = cura = currentenemydIndex = currentBackgroundIndex = 0;
    }
    //Janela de Recompensa =====================================================
    function popup() {
      var popupOverlay = scene.add.graphics();
      popupOverlay.fillStyle(0x000000, 0.7);
      popupOverlay.fillRect(0, 0, scene.game.config.width, scene.game.config.height);

      var popupText = scene.add.text(scene.game.config.width / 2, scene.game.config.height / 2 - 50, 'Pegue sua recompensa', {
        font: '32px TimesNewRoman',
        fill: '#ffffff',
        align: 'center'
      });
      popupText.setOrigin(0.5, 6);

      var box1 = scene.add.graphics();
      var box1Width = 200;
      var box1Height = 50;
      var box1X = scene.game.config.width / 2 - box1Width / 2;
      var box1Y = scene.game.config.height / 2 + 20;
      box1.fillStyle(0x00ff00);
      box1.fillRect(box1X, box1Y, box1Width, box1Height);
      box1.setInteractive(new Phaser.Geom.Rectangle(box1X, box1Y, box1Width, box1Height), Phaser.Geom.Rectangle.Contains);
      box1.on('pointerdown', function () {
        console.log('Caixa 1 clicada!');
        if (currentBackgroundIndex <= 4) {
          currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
          currentenemydIndex = (currentenemydIndex + 1) % enemys.length;
          dano = Phaser.Math.Between(1, 2);
          vidaB += 20;
          scene.scene.restart();
        } else {
          currentBackgroundIndex = 0;
          scene.scene.start('MenuScene');
        }
      });

      var box1Text = scene.add.text(scene.game.config.width / 2, box1Y + box1Height / 2, '+ Dano (1,2)', { fontSize: '20px', fill: '#000000' });
      box1Text.setOrigin(0.5);

      var box2 = scene.add.graphics();
      var box2Width = 200;
      var box2Height = 50;
      var box2X = scene.game.config.width / 2 - box2Width / 2;
      var box2Y = scene.game.config.height / 2 + 80;
      box2.fillStyle(0xff0000);
      box2.fillRect(box2X, box2Y, box2Width, box2Height);
      box2.setInteractive(new Phaser.Geom.Rectangle(box2X, box2Y, box2Width, box2Height), Phaser.Geom.Rectangle.Contains);
      box2.on('pointerdown', function () {
        console.log('Caixa 2 clicada!');
        if (currentBackgroundIndex <= 4) {
          currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
          currentenemydIndex = (currentenemydIndex + 1) % enemys.length;
          cura = Phaser.Math.Between(1, 3);
          vidaB += 20;
          scene.scene.restart();
        } else {
          currentBackgroundIndex = 0;
          scene.scene.start('MenuScene');
        }
      });

      var box2Text = scene.add.text(scene.game.config.width / 2, box2Y + box2Height / 2, '+ Cura (1,3)', { fontSize: '20px', fill: '#000000' });
      box2Text.setOrigin(0.5);

      var box3 = scene.add.graphics();
      var box3Width = 200;
      var box3Height = 50;
      var box3X = scene.game.config.width / 2 - box3Width / 2;
      var box3Y = scene.game.config.height / 2 + 140;
      box3.fillStyle(0x0000ff);
      box3.fillRect(box3X, box3Y, box3Width, box3Height);
      box3.setInteractive(new Phaser.Geom.Rectangle(box3X, box3Y, box3Width, box3Height), Phaser.Geom.Rectangle.Contains);
      box3.on('pointerdown', function () {
        console.log('Caixa 3 clicada!');
        if (currentBackgroundIndex <= 4) {
          currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
          currentenemydIndex = (currentenemydIndex + 1) % enemys.length;
          vida = Phaser.Math.Between(2, 8);
          vidaB += 20;
          scene.scene.restart();
        } else {
          currentBackgroundIndex = 0;
          scene.scene.start('MenuScene');
        }
      });

      var box3Text = scene.add.text(scene.game.config.width / 2, box3Y + box3Height / 2, '+ Vida(2,8)', { fontSize: '20px', fill: '#000000' });
      box3Text.setOrigin(0.5);
    }

    //Mostra Texto ao Atacar ===========================================================
    function atqTexto() {
      var graphics = scene.add.graphics();
      graphics.fillStyle(0x000000, 0.7);
      graphics.fillRect(0, 100, 912, 50);
      var randomText = ['Chuva de Meteoros', 'Furia da Terra', 'Distorção Dimensional', 'BackStab'];
      var randomI = Phaser.Math.Between(0, randomText.length - 1);
      var text = scene.add.text(400, 300, randomText[randomI], { fontSize: '24px', fill: '#ffffff' });
      text.setOrigin(0.2, 8);
      setTimeout(function () {
        text.visible = false;
        graphics.clear();
      }, 800);
    }
    //Animação ataque Olberion ===================================================
    function atqOlbe() {
      setTimeout(function () {
        changePlayerImage('ataqueol2');
        setTimeout(function () {
          changePlayerImage('ataqueol1');
        }, 100);
      }, 100);
    }
    //Animação ataque Ophelia ===================================================
    function atqOphe() {
      setTimeout(function () {
        changePlayerImage('ataqueop2');
        setTimeout(function () {
          changePlayerImage('ataqueop1');
        }, 100);
      }, 100);
    }
    //Animação ataque Therion ===================================================
    function atqTher() {
      setTimeout(function () {
        changePlayerImage('ataqueth2');
        setTimeout(function () {
          changePlayerImage('ataqueth1');
        }, 100);
      }, 100);
    }
    //Animação ataque Primerose ===================================================
    function atqPrim() {
      setTimeout(function () {
        changePlayerImage('ataquepr2');
        setTimeout(function () {
          changePlayerImage('ataquepr1');
        }, 100);
      }, 100);
    }
    function changeEnemyOrigin(newOriginX, newOriginY) {
      enemy.setOrigin(newOriginX, newOriginY);
    }
  },
  update: function () {

  }
});
