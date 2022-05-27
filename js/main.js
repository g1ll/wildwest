$(document).ready(canvasApp);
function canvasApp() {

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var size = getWindowSize();
    var xs; //cowboy position x centro do canvas
    var ys; //cowboy position y centro do canvas
    var rs; //raio do circulo
    var wr;
    var hr;
    var xr; //x retângulo 
    var yr; //y retângulo
    //Gerando a posição aleatória das pedras
    var yro = []; //array para guardar as posições no eixo y
    var xro = [];//array para guardar as posições no eixo x
    var nro; //número de pedras a serem desenhadas no cenário
    //Mesma lógica das pedras para os arbustos
    var ygr = [];
    var xgr = [];
    var grs = [];//indice aleatório de arbustos
    var ngr;
    var wm = 25;
    var hm = 25;
    var ym = [];
    var xm = [];
    var nm;
    var v; //orientação incial do rectangulo (1 = vertical;0 = horizontal)
    var d; //orientação incial do rectangulo (1 = diagonal;0 = normal)
    var moveu;
    var istouch;
    var isclick;
    var key;
    var dead;
    var score;
    var c_shot;
    var load = 0;
    var total = 21;
    var cload = 0;
    var interval = 60;
    var loop = setInterval(isLoaded, interval);
    var vel;
    var vel_ret;
    //Adicionando o som
    var intro;
    var intro_link = "sounds/intro.mp3";
    var theme;
    var reset = false;
    //    var link1 = "http://soundbible.com/grab.php?id=1947&type=mp3";
    var link1 = "sounds/theme.mp3";
    var punch_sound;
    //    var link2 = "http://soundbible.com/grab.php?id=1876&type=mp3";
    var link2 = "sounds/punch.mp3";
    var gun_sound;
    //    var link3 = 'http://soundbible.com/grab.php?id=2121&type=mp3';
    var link3 = 'sounds/380.mp3';
    var die_sound;
    //    var link4 = 'http://soundbible.com/grab.php?id=1033&type=mp3';
    //    var link4 = 'http://soundbible.com/grab.php?id=1454&type=mp3';
    var link4 = 'sounds/pain.mp3';
    var win_sound;
    //    var link5 = 'http://soundbible.com/grab.php?id=1412&type=mp3';
    var link5 = 'sounds/yahoo.mp3';
    var deadsound;
    var link_deadsound = 'sounds/end.mp3';

    //Images    
    var img_diamond;
    var img_silvergold;
    var img_bag;
    var img_bag3;
    var img_bullet;
    var img_back;
    var img_rocks;
    var img_hud_back;
    var img_grass;
    var img_cowboy_d;
    var img_cowboy_e;
    var img_cowboy_c;
    var img_cowboy_n;
    var img_cowboy_dead;
    //var img_intro;
    var c_sprites = 0;
    var dir_cb = 'down';
    var state_cb = 'stop';

    load_assets();

    function init() {
        if(reset){
            clearInterval(reset)
            reset = false;
        }
        resize();
        load = 0;
        xs = canvas.width / 2; //cowboy position x centro do canvas
        ys = canvas.height / 2; //cowboy position y centro do canvas
        rs = 20; //raio do circulo
        wr = 4;
        hr = 3;
        xr = 0; //x retângulo 
        yr = Math.random() * canvas.height - 50;

        v = 0; //orientação incial do rectangulo (1 = vertical;0 = horizontal)
        d = 0; //orientação incial do rectangulo (1 = diagonal;0 = normal)
        moveu = false;

        key = 0;
        dead = false;
        score = 0;
        c_shot = 0;
        interval = 60;
        vel = 20;
        vel_ret = 30;

        c_sprites = 0;
        dir_cb = 'down';
        state_cb = 'stop';


        nro = 20;
        yro = [];
        xro = [];
        //Gerando valores aleatórios até no número máximo de pedras
        for (var i = 0; i < nro; i++) {
            //método push() adiciona um elemento no array
            yro.push(Math.round(Math.random() * canvas.height - 50));
            xro.push(Math.round(Math.random() * canvas.width - 50));
        }
        ngr = 50 + Math.round(Math.random() * 50);
        ygr = [];
        ygr = [];
        grs = [];
        for (var i = 0; i < ngr; i++) {
            ygr.push(Math.round(Math.random() * canvas.height - 50));
            xgr.push(Math.round(Math.random() * canvas.width - 50));
            grs.push(Math.round(Math.random()));
        }
        nm = 1;
        ym = [];
        xm = [];
        for (var i = 0; i < nm; i++) {
            ym.push(30 + Math.round(Math.random() * (canvas.height - hm - 30)));
            xm.push(Math.round(Math.random() * (canvas.width - wm)));
        }

        intro.pause();
        intro.currentTime = 0;
        deadsound.pause();
        if (typeof deadsound.loop === 'boolean') {
            deadsound.loop = false;
        } else {
            deadsound.removeEventListener('ended', function () {
                this.currentTime = 0;
            }, false);
        }
        deadsound.currentTime = 0;
        theme.volume = 1;
        theme.play();
        clearInterval(loop);
        loop = setInterval(mainLoop, interval);
        //        setTimeout(function () {
        //            gun_sound.currentTime = 0;
        //            gun_sound.play();
        //            moveBullet();
        //        }, 600);

    }

    function mainLoop() {

        drawBackground();

        drawBag();

        drawCowboy();

        if (!dead) {

            //if (c_shot > 0)
            moveBullet();

            drawBullet();

            if (state_cb === 'walk') {
                moveCowboy();
            }


            if (colisao(xr, yr, wr, hr, xs, ys, rs)) {
                die_sound.play();
                punch_sound.play();
                //theme.volume = 0.3;
                theme.pause();
                theme.currentTime = 0;
                deadsound.currentTime = 0;
                deadsound.volume = 0.5;
                deadsound.play();
                if (typeof deadsound.loop === 'boolean') {
                    deadsound.loop = true;
                } else {
                    deadsound.addEventListener('ended', function () {
                        this.currentTime = 0;
                    }, false);
                }
                dead = true;
                state_cb = 'dead';
                dir_cb === 'fall';
                setTimeout(function () {
                    clearInterval(loop)
                }, 300);
            }

            if (getBag()) {
                score += 50;
            }
        }


        drawHud();

    }//FIM MAIN LOOP


    //Função para mover o smile
    function moveCowboy() {//receve o código da tecla apertada
        //        console.log("x: " + xs + " || tx: " + touchX + " ");
        //        console.log("y: " + xy + " || ty: " + touchY + " ");
        if (!dead && (istouch || isclick)) {
            if ((touchX < xs && touchX !== 0) && dir_cb !== "right") {
                state_cb = 'walk';
                dir_cb = 'left';
            } else if ((touchX > xs && touchX !== 0) && dir_cb !== "left") {
                state_cb = 'walk';
                dir_cb = 'right';
            } else if ((touchY > ys && touchY !== 0) && dir_cb !== "up") {
                state_cb = 'walk';
                dir_cb = 'down';
            } else if ((touchY < ys && touchX !== 0) && dir_cb !== "down") {
                state_cb = 'walk';
                dir_cb = 'up';
            }
        }


        if (xs <= canvas.width - rs + 1 && xs >= 0) {//Não deixa o personagem sair do canvas
            if (dir_cb === 'right') {
                if ((istouch || isclick) && (xs + vel > touchX)) {
                    xs = touchX + rs;
                } else {
                    xs += vel;
                }
                moveu = true;
            } else if (dir_cb === 'left') {
                if ((istouch || isclick) && (xs - vel < touchX)) {
                    xs = touchX;
                } else {
                    xs -= vel;
                }
                moveu = true;
            }
        }
        if (ys <= canvas.height - rs + 1 && ys >= 0) {
            if (dir_cb === 'up') {
                if ((istouch || isclick) && (ys - vel < touchY)) {
                    ys = touchY;
                } else {
                    ys -= vel;
                }
                moveu = true;
            } else if (dir_cb === 'down') {
                if ((istouch || isclick) && (ys + vel > touchY)) {
                    ys = touchY;
                } else {
                    ys += vel;
                }
                moveu = true;
            }
        }

        if (touchX == xs && touchY == ys) {
            istouch = false;
            isclick = false;
            state_cb = 'stop';
            moveu = false;
        }
        //Impede o cowboy de sair para fora do canvas
        if (xs > (canvas.width - rs + 1)) {
            xs = canvas.width - rs + 1;
        } else if (xs - rs + 1 < 0) {
            xs = rs + 1;
        }
        if (ys > (canvas.height - rs + 1)) {
            ys = canvas.height - rs + 1;
        } else if (ys - rs + 1 < 0) {
            ys = rs + 1;
        }
    }

    //funçao para mover os quadrados aleatóriamente
    function moveBullet() {

        // if (moveu) {
        if (yr > 2 * canvas.height || xr > 2 * canvas.width) {
            c_shot++;
            gun_sound.currentTime = 0;
            gun_sound.play();
            v = Math.round(Math.random());
            d = Math.round(Math.random());
            //console.log(v);
            xr = 0;
            yr = 0;
            if (v) {
                xr = xs;
                if (d)
                    xr = Math.random() * canvas.width - 50;
            } else {
                yr = ys;
                if (d)
                    yr = Math.random() * canvas.height - 50;
            }
        }

        if (v) {
            yr += vel_ret;
            if (d)
                xr += vel_ret / 2;
        } else {
            xr += vel_ret;
            if (d)
                yr += vel_ret / 2;
        }
        // } 
        // else {
        //     xr += vel_ret;
        // }
    }

    //teste de colisão simples baseado apenas nas posições x e y dos objetos
    function colisao(x1, y1, w1, h1, x2, y2, rs) {
        //testa se x2 esta em x1        
        var x = x1 - rs;
        var y = y1 - rs;
        var w = w1 + rs * 2;
        var h = h1 + rs * 2;
        //Retângulo ampliado
        //        context.strokeStyle = "#000";
        //        context.strokeRect(x, y, w, h);
        //        context.strokeStyle = "red";
        //        context.strokeRect(x2, y2, 1, 1);
        if ((x2 >= x && x2 <= x + w) && ((y2 >= y && y2 <= y + h)))
            return true;
        else
            return false;
    }

    function isLoaded() {
        resize();
        //if(intro.){
        // intro.play();
        //}
        var p = Math.round(((load * 100) / total));
        if (cload < 1) {
            cload += .1;
        } else {
            cload = 0;
        }
        if (load >= total) {
            p = 100;
            cload = 1;
            controles();
            //Background
            context.fillStyle = "rgba(255,255,255,1)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            print_center("READY " + p + "%  !!!", canvas.height / 2 - 150, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("Move the CowBoy with keys", canvas.height / 2 - 100, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("up, down, left and right  (←↑→↓) ", canvas.height / 2 - 75, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("to capture the money bag", canvas.height / 2 - 50, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("and scape of the shots!", canvas.height / 2 - 25, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("Click or touch to start", canvas.height / 2 + 85, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            print_center("or reset game if you die!", canvas.height / 2 + 105, "rgba(0,0,0," + cload + ")", "bold", 20, "west");
            context.globalAlpha = p / 100;
            context.drawImage(img_cowboy_n, 0, 0, 48, 70, canvas.width / 2 - 24, canvas.height / 2 + 15, 48, 70);
            context.globalAlpha = 1;
        } else {
            //Background
            context.fillStyle = "rgba(255,255,255,1)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            print_center("Loading... " + p + "% ", canvas.height / 2 - 70, "rgba(0,0,0," + cload + ")", "bold", 24, "west");
            context.globalAlpha = p / 100;
            context.drawImage(img_cowboy_n, 0, 0, 48, 70, canvas.width / 2 - 24, canvas.height / 2 - 35, 48, 70);
            context.globalAlpha = 1;
        }
    }

    function blood(qtd, dsp) {
        context.strokeStyle = "red";
        context.strokeRect(xs - (Math.round(Math.random() * dsp)), ys - (Math.round(Math.random() * dsp)), 1, 1);
        context.strokeRect(xs + (Math.round(Math.random() * dsp)), ys + (Math.round(Math.random() * dsp)), 1, 1);
        context.strokeRect(xs - (Math.round(Math.random() * dsp)), ys + (Math.round(Math.random() * dsp)), 1, 1);
        context.strokeRect(xs + (Math.round(Math.random() * dsp)), ys - (Math.round(Math.random() * dsp)), 1, 1);
        for (var i = 0; i < qtd; i++) {
            context.beginPath();
            context.fillStyle = "rgba(255,0,0," + (Math.random() + .5) + ")";
            context.arc(
                xs + ((Math.round(Math.random())) ? +(Math.round(Math.random() * dsp)) : -(Math.round(Math.random() * dsp))), //Posição X, referência ao centro do círculo;
                ys + ((Math.round(Math.random())) ? +(Math.round(Math.random() * dsp)) : -(Math.round(Math.random() * dsp))), //Posição Y;
                (Math.round(Math.random() * 2)), //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 180, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
            );
            context.fill(); //Desenha o contorno do círculo
            context.closePath(); //Finaliza o caminho "Path" do desenho atual
        }
    }

    function drawBackground() {

        //Background
        //context.fillStyle = "#F7BE81";
        context.fillStyle = context.createPattern(img_back, "repeat");
        ;
        context.fillRect(0, 0, canvas.width, canvas.height);
        //Desenhando as pedras
        for (var i = 0; i < nro; i++) {
            context.drawImage(img_rocks, xro[i], yro[i], 50, 50);
        }
        //Desenhando os arbustos
        for (var i = 0; i < ngr; i++) {
            context.drawImage(img_grass, 197 * grs[i], 0, 197, 195, xgr[i], ygr[i], 50, 50);
        }
        //box
        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function drawBullet() {
        //Retângulo
        //context.fillStyle = "#2E2E2E";
        //context.fillRect(xr, yr, wr, hr);
        //        context.beginPath();
        //        context.fillStyle = "#2E2E2E";
        //        context.arc(
        //                xr, //Posição X, referência ao centro do círculo;
        //                yr, //Posição Y;
        //                wr / 2, //Raio do círculo;
        //                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
        //                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
        //                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
        //                );
        //        context.fill(); //Realiza o prenchimento do círculo
        //        context.closePath(); //Finaliza o caminho "Path" do desenho atual

        //if (v)
        //  context.drawImage(img_bullet2, xr - 12, yr - 12, wr * 5, hr * 5);
        //else
        var w = 752;
        var h = 658;
        //        var w = 35;
        //        var h = 15;

        if (d) {
            drawRotatedImage(img_bullet, 0, 0, w, h, xr, yr, wr * 5, hr * 5, 45);
        } else {
            if (v) {
                drawRotatedImage(img_bullet, 0, 0, w, h, xr, yr, wr * 5, hr * 5, 90);
            } else {
                context.drawImage(img_bullet, xr - 12, yr - 12, wr * 5, hr * 5);
            }
        }





    }

    function drawCowboy() {
        if (state_cb === 'walk') {
            c_sprites++;
            if (c_sprites > 1 && (dir_cb == 'right' || dir_cb == 'left'))
                c_sprites = 0;
            else if (c_sprites > 2)
                c_sprites = 0;
        } else if (state_cb === 'dead') {
            dir_cb = 'fall';
            c_sprites++;
            if (c_sprites > 5) {
                c_sprites = 5;
            }
        } else {
            c_sprites = 0;
        }

        if (dir_cb === 'right') {
            context.drawImage(img_cowboy_d, 48 * c_sprites, 0, 48, 70, xs - 24, ys - 35, 48, 70);
        } else if (dir_cb === 'left') {
            context.drawImage(img_cowboy_e, 48 * c_sprites, 0, 48, 70, xs - 24, ys - 35, 48, 70);
        } else if (dir_cb === 'up') {
            context.drawImage(img_cowboy_c, 48 * c_sprites, 0, 48, 70, xs - 24, ys - 35, 48, 70);
        } else if (dir_cb === 'down') {
            context.drawImage(img_cowboy_n, 48 * c_sprites, 0, 48, 70, xs - 24, ys - 35, 48, 70);
        } else if (dir_cb === 'fall') {
            context.drawImage(img_cowboy_dead, 48 * c_sprites, 0, 48, 70, xs - 24, ys - 35, 48, 70);
            if (c_sprites < 5) {
                blood(10 * c_sprites, 5 * c_sprites);
                blood(10 * c_sprites, 10 * c_sprites);
                blood(20 * c_sprites, 5 * c_sprites);
            } else {
                blood(10 * c_sprites, 5 * c_sprites);
                blood(10 * c_sprites, 10 * c_sprites);
                blood(20 * c_sprites, 5 * c_sprites);
            }
        }
    }

    function drawBag() {
        for (var i = 0; i < nm; i++) {
            context.drawImage(img_bag, xm[i], ym[i], wm, hm);
        }
    }

    function getBag() {
        for (var i = 0; i < nm; i++) {
            if (colisao(xm[i], ym[i], wm, hm, xs, ys, rs)) {
                createBag(i);
                return true;
            }
        }
    }

    function createBag(i) {
        ym[i] = Math.round(30 + Math.round(Math.random() * (canvas.height - hm - 30)));
        xm[i] = Math.round(Math.random() * (canvas.width - wm));
    }

    function drawHud() {
        //        context.fillStyle = "rgba(255,255,255,0.6)";
        context.fillStyle = context.createPattern(img_hud_back, 'repeat');
        context.fillRect(0, 0, canvas.width, 30);
        var mil = "";
        var xp = canvas.width / 2;
        var yp = 0;
        if (score > 0)
            mil = " k";
        var msg = "Money: $ " + score + mil;

        print_center(msg, yp + 5, '#eee8a3', 'normal', 24, 'west');

        xp = xp + context.measureText(msg).width / 2 + 2;

        for (var c = 0, nd = Math.floor(score / 9600); c < nd; c++) {

            context.drawImage(img_diamond, 0, 0, 80, 80, xp + c * wm, yp, wm + wm / 2, hm + hm / 4);

        }

        for (var g = 0, ng = Math.floor((score - nd * 9600) / 1200); g < ng; g++, c++) {
            context.drawImage(img_silvergold, 224, 0, 224, 175, xp + c * wm, yp, wm + wm / 2, hm + hm / 4);

        }

        for (var k = 0, ns = Math.floor((score - (ng * 1200) - (nd * 9600)) / 600); k < ns; k++, c++) {
            context.drawImage(img_silvergold, 0, 0, 224, 175, xp + c * wm, yp, wm + wm / 2, hm + hm / 4);

        }

        for (var l = 0, nb = Math.floor((score - (ns * 600) - (ng * 1200) - (nd * 9600)) / 150); l < nb; l++, c++) {
            context.drawImage(img_bag3, xp + c * wm, yp, wm + wm / 2, hm + hm / 4);

        }

        for (var j = 0, n = Math.floor((score - nb * 150 - (ns * 600) - (ng * 1200) - (nd * 9600)) / 50); j < n; j++, c++) {
            context.drawImage(img_bag, xp + c * wm, yp + 5, wm, hm);
        }
    }



    function drawRotatedImage(img, cx, cy, cw, ch, x, y, width, height, degrees) {
        //fonte: http://jsfiddle.net/m1erickson/z4p3n/
        // first save the untranslated/unrotated context
        context.save();

        context.beginPath();
        // move the rotation point to the center of the rect
        context.translate(x + width / 2, y + height / 2);
        // rotate the rect
        context.rotate(degrees * Math.PI / 180);

        // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
        context.drawImage(img, cx, cy, cw, ch, -width / 2, -height / 2, width, height);

        // restore the context to its untranslated/unrotated state
        context.restore();

    }

    function controles() {
        //Evento do teclado com JQuery
        $(window).keydown(function (e) {
            key = e.which;
            istouch = false;
            isclick = false;
            if (!dead) {
                if (key === 68 || key === 39) {
                    state_cb = 'walk';
                    dir_cb = 'right';
                } else if (key === 65 || key === 37) {
                    state_cb = 'walk';
                    dir_cb = 'left';
                } else if (key === 87 || key === 38) {
                    state_cb = 'walk';
                    dir_cb = 'up';
                } else if (key === 83 || key === 40) {
                    state_cb = 'walk';
                    dir_cb = 'down';
                }
                if (key === 32 && load === total) {
                    intro.pause();
                    intro.currentTime = 0;
                    setTimeout(init, 500);
                }
            } else {
                dir_cb === 'fall';
                if (key === 32 && !reset) {
                    reset = setTimeout(() => {
                        clearInterval(loop);
                        theme.pause();
                        theme.currentTime = 0;
                        init();
                    }, 1000);
                }
            }
        });
        //Evento do teclado com JQuery
        $(window).keyup(function (e) {
            if (!dead) {
                state_cb = 'stop';
            }
        });


        //Controlando o snake com o touch Native JS
        document.getElementById("canvas").addEventListener("touchstart", function (event) {
            if (load >= total || dead) {

                if (!reset)
                    reset = setTimeout(() => {
                        //Recriando o intervalo para o loop
                        if (typeof loop !== "undefined") //Testa se o loop já foi criado
                            clearInterval(loop); //Se o loop já existe então limpa o intervalo para depois ser recriado
                        intro.pause();
                        intro.currentTime = 0;
                        init()
                    }, 1000);
            }


            event.preventDefault();
            //Guarda as posições do toque
            touchX = event.targetTouches[0].pageX - (size.w - canvas.width) / 2;
            touchY = event.targetTouches[0].pageY - 60;
            istouch = true;
            state_cb = 'walk';
        }, true);

        //Controlando o snake com o clique Native JS
        document.getElementById("canvas").addEventListener("click", function (event) {
            if (!reset)
                if (load >= total || dead) {
                    reset = setTimeout(() => {
                        //Recriando o intervalo para o loop
                        if (typeof loop !== "undefined") //Testa se o loop já foi criado
                            clearInterval(loop); //Se o loop já existe então limpa o intervalo para depois ser recriado
                        intro.pause();
                        intro.currentTime = 0;
                        init();
                    }, 1000);
                }

            event.preventDefault();
            //Guarda as posições do toque
            touchX = event.clientX - (size.w - canvas.width) / 2;
            touchY = event.clientY - 60;
            console.log("Click: X " + touchX + " Y " + touchY);
            isclick = true;
            state_cb = 'walk';
        }, true);

    }

    function print_center(message, yPosition, fill, style, size, font) {
        context.font = style + " " + size + "px " + font;
        context.fillStyle = fill;
        context.textBaseline = "top";
        var metrics = context.measureText(message);
        var textWidth = metrics.width;
        var xPosition = (canvas.width / 2) - (textWidth / 2);
        context.fillText(message, xPosition, yPosition);
    }

    function print_x_y(msg, xp, yp, style, size, font, fill) {
        context.font = style + " " + size + "px " + font;
        context.fillStyle = fill;
        context.textBaseline = "top";
        context.fillText(msg, xp, yp)
    }

    function load_assets() {

        //Criando e configurando o audio
        theme = new Audio(link1);
        theme.load(); //Carregando o arquivo
        theme.volume = 1; //Configurando o volume
        //Testa se existe suporte à propriedade loop
        if (typeof theme.loop === 'boolean') {
            //  Se o navegador possui suporte apenas configuramos a propriedade 
            //loop para true
            theme.loop = true; //Execução em loop ativada
        } else {//Caso não exista suporte utilizaremos o evento ended para saber
            // quando a música chegou ao fim
            // ----
            // Com o evento ended chamamos um função que irá voltar ao início da
            //  reprodução do arquivo de 
            // áudio toda vez que a reprodução chegar ao final da música
            //Adicionando o evento ended (fim da reprodução)
            theme.addEventListener('ended', function () {
                this.currentTime = 0; //Voltando a reprodução ao início da música
            }, false);
        }//FIM IF

        theme.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            // console.log(theme.src);
        }, false);
        //Não compatível com maioria dos navegadores
        //    theme.addEventListener("progress", function(evt) {
        //        console.log(evt.lengthComputable);
        //        if (evt.lengthComputable) {
        //        var percentComplete = evt.loaded / evt.total;
        //        //Do something with download progress
        //        console.log(evt);
        //        console.log("LOAD "+theme.src+" "+percentComplete);
        //      }
        //  },false);


        punch_sound = new Audio(link2);
        punch_sound.load(); //Carregando o arquivo
        punch_sound.volume = .5; //Configurando o volume
        punch_sound.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(punch_sound.src);
        }, false);

        gun_sound = new Audio(link3);
        gun_sound.load(); //Carregando o arquivo
        gun_sound.volume = .3; //Configurando o volume
        gun_sound.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(gun_sound.src);
        }, false);

        die_sound = new Audio(link4);
        die_sound.load(); //Carregando o arquivo
        die_sound.volume = .5; //Configurando o volume
        die_sound.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(die_sound.src);
        }, false);

        win_sound = new Audio(link5);
        win_sound.load(); //Carregando o arquivo
        win_sound.volume = 1; //Configurando o volume
        win_sound.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(die_sound.src);
        }, false);

        intro = new Audio(intro_link);
        intro.load(); //Carregando o arquivo
        intro.volume = 1; //Configurando o volume
        intro.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(die_sound.src);
        }, false);

        deadsound = new Audio(link_deadsound);
        deadsound.load(); //Carregando o arquivo
        deadsound.volume = 1; //Configurando o volume
        deadsound.addEventListener('canplaythrough', function () {
            load++;
            this.oncanplaythrough = null;
            //console.log(die_sound.src);
        }, false);

        //CREATE LOAD IMAGENS
        img_cowboy_d = new Image();
        img_cowboy_d.src = 'img/sprites/cb_d.png';
        img_cowboy_d.addEventListener('load', function () {
            load++;
        }, false);

        img_cowboy_e = new Image();
        img_cowboy_e.src = 'img/sprites/cb_e.png';
        img_cowboy_e.addEventListener('load', function () {
            load++;
        }, false);

        img_cowboy_c = new Image();
        img_cowboy_c.src = 'img/sprites/cb_up.png';
        img_cowboy_c.addEventListener('load', function () {
            load++;
        }, false);

        img_cowboy_n = new Image();
        img_cowboy_n.src = 'img/sprites/cb_dw.png';
        img_cowboy_n.addEventListener('load', function () {
            load++;
        }, false);

        img_back = new Image();
        img_back.src = 'img/dust.png';
        img_back.addEventListener('load', function () {
            load++;
        }, false);

        img_rocks = new Image();
        img_rocks.src = 'img/rocks.png';
        img_rocks.addEventListener('load', function () {
            load++;
        });

        img_grass = new Image();
        img_grass.src = 'img/sprites/grass.png';
        img_grass.addEventListener('load', function () {
            load++;
        });

        img_bullet = new Image();
        img_bullet.src = 'img/bullet4.png';
        img_bullet.addEventListener('load', function () {
            load++;
        });

        img_bag = new Image();
        img_bag.src = 'img/moneybag2.png';
        img_bag.addEventListener('load', function () {
            load++;
        });

        img_bag3 = new Image();
        img_bag3.src = 'img/moneybag3.png';
        img_bag3.addEventListener('load', function () {
            load++;
        });

        img_silvergold = new Image();
        img_silvergold.src = 'img/sprites/silvergold.png';
        img_silvergold.addEventListener('load', function () {
            load++;
        });

        img_cowboy_dead = new Image();
        img_cowboy_dead.src = 'img/sprites/cb_dead.png';
        img_cowboy_dead.addEventListener('load', function () {
            load++;
        });

        img_diamond = new Image();
        img_diamond.src = 'img/diamond.png';
        img_diamond.addEventListener('load', function () {
            load++;
        });


        img_hud_back = new Image();
        img_hud_back.src = 'img/hud.png';
        img_hud_back.addEventListener('load', function () {
            load++;
        });
    }

    function getWindowSize() {
        //Monstrando os tamanhos no console
        //        console.log("Wd " + document.documentElement.clientWidth + " | Ww " + window.innerWidth + "\n " +                "Hd " + document.documentElement.clientHeight + " | Hw " + window.innerHeight);

        return {
            w: (window.innerWidth && document.documentElement.clientWidth ?
                Math.min(window.innerWidth, document.documentElement.clientWidth) :
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.getElementsByTagName('body')[0].clientWidth),
            h: (window.innerHeight && document.documentElement.clientHeight ?
                Math.min(window.innerHeight, document.documentElement.clientHeight) :
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.getElementsByTagName('body')[0].clientHeight)
        };
    }

    function resize() {
        size = getWindowSize();
        if (Math.min(size.w, size.h) <= 600) {//|| isMobile()) {
            w = size.w * 0.9;
            h = size.h * 0.9;
            text_size = Math.max(w, h) * 0.02;
        } else {
            w = size.w * 0.5;
            h = size.h * 0.8;
            text_size = Math.max(w, h) * 0.02;
        }

        $("body").attr('width', size.w); // A variável w guarda a largura do canvs
        $("body").attr('height', size.h);
        $("#canvas").attr('width', w); // A variável w guarda a largura do canvs
        $("#canvas").attr('height', h);
        console.log(size.w + " || " + size.h);
    }
}