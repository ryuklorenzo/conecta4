# Ejemplo proyecto Javascript. Juego Go

Implementación simplificada del famoso juego [Go](https://es.wikipedia.org/wiki/Go). En esta versión gana el jugador que
posea la mitad de las posiciones más uno, y no se tiene en cuenta regiones, limitaciones en posicionar piezas...

Se tiene una serie de escenas o pantallas:

- Introducción
- Elección de personajes
- Tablero
- Finalización


Se decide crear un sitio web tipo [SPA](https://es.wikipedia.org/wiki/Single-page_application), de forma que no sea necesario
recargar la página para "navegar" entre las diferentes escenas.

**En JavaScript se pueden crear aplicaciones usando muchas técnicas y filosofías, por ejemplo, crear todos los elementos
usando únicamente JavaScript (sin prácticamente HTML) o usar diferentes características de JavaScript que no existen en otros lenguajes.
En este caso se intenta aplicar principios de la POO, e interactuar sobre etiquetas HTML/CSS creadas.**


## Estructura del proyecto

Posee la estructura clásica de una aplicación web:

- index.html  Página principal, en este caso la única página web
- css         Carpeta con los estilos
- imgs        Imágenes usadas en la web
- js          Ficheros js
- sounds      Carpeta nueva, contiene la música del proyecto

## Escenas o pantallas

En casi todo los juegos se tiene diferentes escenas o pantallas, teniendo que realizar una gestión unificacada de todas ellas de 
forma sencilla: Pasa a la siguiente escena, iniciar la escena, abandonar la escena...

Se hace uso de las características de la POO, en concreto las interfaces/clases abstractas (al estilo Javascript...). 
Se define en el fichero /js/scene una clase abstracta (una forma para hacer un método abstracto en JavaScript es hacer saltar una excepción si se llama
al método)

```js
class Scene {
    _container = null  //elemento HTML sobre el que se construye la escena
    _next = null  //escena siguiente
    constructor(container, next) {
        this._next = next
        this._container = container
    }
    start(){
        throw new Error('Método Start de la Scene(Clase base abstracta), se tiene que implementar en el hijo');
    }
    stop(){
        throw new Error('Método Stop de cla Scene(Clase base abstracta), se tiene que implementar en el hijo');

    }
    restart(){
        throw new Error('Método Restart de la Scene(Clase base abstracta), se tiene que implementar en el hijo');
    }
}
```

Ahora para definir una nueva escena, se ha de heredad de la clase escene, implementar los métodos abstractos y añadir la lógica propia de la 
escena. Por ejemplo, en la escena de introducción:

```js
class Intro extends Scene {
    //atributos de la escena 
    #sound = null
    //constructor
    constructor(container, next) {
        //llamada constructor clase base
        super(container, next)
        //obteniendo elementos del DOM necesarios para la escena
        //configuración de escuchadores de eventos y asociarlos a métodos internos de la clase
        var portada = container.querySelector("#portada");
        var boton_scene1_toscene2 = container.querySelector("#boton_scene1_toscene2");
        boton_scene1_toscene2.addEventListener("click", this._next);
        //inicio del sonido
        this.#sound = container.querySelector(".song");

    }
    /**
     * Implementación método abstrcato
     */
    start() {
        /*
        Chrome: chrome://settings/content/sound
        Firefox: about:config y buscar media.autoplay.default
        Edge: edge://settings/content/mediaAutoplay
         */
        if (this.#sound != null) {
            this.#sound.play();
        }
    }
    /**
     * Implementación método abstrcato
     */
    stop() {
        if (this.#sound != null) {
            this.#sound.pause();
        }
    }
    /**
     * Implementación método abstrcato, no es una buena práctica POO se debería
     * no tener estos casos, pero añade complejidad al desarrollo
     */
    restart() {
    }
}
```

Esta clase es sencilla, hereda de Scene, contiene únicamente un atributo/propiedad: el sonido. Implementa los métodos abstratos de la clase
scene y configura en el constructor los eventos.

### Clase Game

Se necesita un elemento que gestione la creación de las escenas, este elemento es la clase Game que se encuentra en el fichero js/game.js.  A partir de las etiquetas HTML con un id concreto se crean las escenas y se añaden a una lista.


```js
class Game {
    //array de escenas
    #scenes = []
    #actual = 0
    //para pruebas de funcioanmiento
    //#nextButton = null
    //#previusButton = null
    #container = null
    #dataplayer1 = null
    #dataplayer2 = null

    /**
     * se le pasa el contenedor en que se creara el juego
     * crea y añade al array asociativo scenes las diferentes escenas
     * @param queryCSS
     */
    constructor(queryCSS) {
        this.container = document.querySelector(queryCSS)
        for (const child of this.container.querySelectorAll(".scene")) {
            var id = child.getAttribute("id")
            var scene = null;
            switch (id) {
                case "intro":
                    scene = new Intro(child, this.next)
                    break;
                case "config":
                    scene = new Option(child, (options) => {
                        this.#dataplayer1 = options.player1
                        this.#dataplayer2 = options.player2
                        this.next()
                    })
                    break;
                case "goBoard":
                    scene = new GoBoard(child, this.next, {
                        player1: this.#dataplayer1,
                        player2: this.#dataplayer2,
                    })
                    break;
                case "end":

                    scene = new End(child, this.next)
                    break;
            }
            //se añaden al array asociativo/lista
            if (scene != null)
                this.#scenes.push(scene)
            this.#update()
        }
    }

    /**
     * método privado #, cambia a visible/no visible las diferentes escenas
     */
    #update = () => {
        this.#scenes.forEach((element, index) => {
            if (index == 2 && index == this.#actual) {
                element.setOptions({
                    player1: this.#dataplayer1,
                    player2: this.#dataplayer2
                })
            }
            element._container.classList.remove("active");
            if (index == this.#actual) {
                element._container.classList.add("active");
                element.start()
            } else {
                element.stop()
            }
        });

    }
    /**
     * funcionles lambda (almacenado en variable) que cambia la escena actual
     */
    previus = () => {
        this.#actual > 0 ? this.#actual-- : 0;
        this.#update()
    };
    /**
     * funcionles lambda (almacenado en variable) que cambia la escena actual
     */
    next = () => {
        //en bucle

        if (this.#actual < (this.#scenes.length - 1))
            this.#actual++;
        else
            this.#actual = 0;
        this.#update()
    }
}

```
En la página HTML se tiene las diferentes etiquetas con las escenas ( *se puede hacer de muchas formas distintas, en este caso es para prácticar la selecciñon de nodos DOM*):

```html
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go Game</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/intro.css">
    <link rel="stylesheet" href="css/options.css">
    <link rel="stylesheet" href="css/goBoard.css">
    <!--se incluyen las diferentes clases js-->
    <script src="js/scene.js"></script>
    <script src="js/intro.js"></script>
    <script src="js/options.js"></script>
    <script src="js/end.js"></script>
    <script src="js/goBoard.js"></script>
    <script src="js/game.js"></script>
    <script>
        var game = null;
        //inicio del juego, se ejecuta al terminar la carga de la página ( <body onload="iniciar()...)
        function iniciar() {
            game = new Game(".dam-game");
        }
    </script>
</head>

<body onload="iniciar()">
<!--contenedor principal-->
<main class="dam-game">

    <div class="scene active" id="intro">
        <audio class="song">
...
```

Por ejemplo, para crear la escena intro se obtiene el nodo con id intro y se pasa al constructor de la clase Intro, junto con la función lamda de siguiente (se llama dentro de la escena, de forma que 
se ejecuta el código de la clase  Game)

## Clases Intro y End

No destacan en nada, simplemente un SVG con un botón para ir al siguiente.

## Clase Options

En esta escena se seleccion el nombre de cada jugador y la imagen de la ficha (usando comunicación con el exterior y haciendo uso de servicios externos).
Posee los siguientes métodos privados:

- #createList: Realizar una petición a https://dragonball-api.com, a partir del json devuelto crea los elementos HTML y los configura (eventos...)
- #selectImg1: Al hacer click sobre una imagen creada en #createList deselecciona  la anterior y selecciona la nueva, cambiado el estilo CSS
- #selectImg2: Igual que el método anterior pero con el segundo jugador
- #reset: Borra los nombres y las imágenes seleccionadas
- #enableNext: Activa el botón de siguiente si los jugadores han puesto el nombre y han seleccionado una imagen

E implementa los dos métodos abstractos

- start
- stop

En el constructor se le pasan 2 parámetros:

- El contenedor
- El método que se ejecutar al pulsar siguiente, que actualiza el nombre y la imagen de los usuarios

```js
 constructor(container, next) {
        super(container, next)
        this.#fieldName1 = container.querySelector("#fieldname1")
        this.#fieldName1.addEventListener("keyup", this.#enableNext)
        this.#fieldName2 = container.querySelector("#fieldname2")
        this.#fieldName2.addEventListener("keyup", this.#enableNext)
        this.#imageList1 = container.querySelector("#imageList1")
        this.#imageList2 = container.querySelector("#imageList2")
        this.#buttonNext = container.querySelector("#buttonAceptarConfiguracion")
        this.#sound=container.querySelector(".song");
        this.#buttonNext.addEventListener("click",()=>{
            var options={
                player1: {
                    name: this.#fieldName1.value,
                    url: this.#imageURL1.src,
                },
                player2: {
                    name: this.#fieldName2.value,
                    url: this.#imageURL2.src,
                },
            }
            this._next(options)
        });
        ....
```
Al usarlo:

```js
...
   case "config":
                    scene = new Option(child, (options) => {
                        this.#dataplayer1 = options.player1
                        this.#dataplayer2 = options.player2
                        this.next()
                    })
                    break;
...
```
Destacan el método #createList:

```js
 #createList() {
        fetch("https://dragonball-api.com/api/characters?page=1&limit=10")
            .then((response) => response.json())
            .then((data) => {
                for (var i = 0; i < data.meta.itemCount; i++) {
                    var img1 = document.createElement("img");
                    img1.src = data.items[i].image;
                    img1.addEventListener("click", this.#selectImg1)
                    imageList1.appendChild(img1);
                    var img2 = document.createElement("img");
                    img2.src = data.items[i].image;
                    imageList2.appendChild(img2);
                    img2.addEventListener("click", this.#selectImg2)
                }
            });
    }
```
Se obtiene el texto, se pasa Json, recorriendo los elementos, en cada iteración se crea las 2 imágenes y se añaden a los cntenedores, estableciendo
el evento al hacer click (es un método de la clase)


## Clase GoBoard

El juego propiamente, posee un tabler de 19x19 en el que se van colocando las fichas. Hereda, al igual que el resto de las escenas de la clase Scene e immplementa
los métodos abstractos.

Los atributos  más destacados son son:

- #board: Privado, es una matriz con el estado del tablero 0 vacia 1 jugador 1, 2 jugador 2
- _options: Opciones de configuración, el nombre y la imagen de cada jugador
- #turn: Booleano con el turno del jugador actual

De los métodos:

- #CreateBoard(). Crea el tablero creando filas y para cada fila columnas, de tipo div
```js
 #createBoard()
{
    var nodo;
    //se crea la fina
    for (var i = 0; i < this.#rows; i++) {
        var row = document.createElement("div")
        row.classList.add("row")
        document.getElementById("board").appendChild(row)
        //se crean las columnas
        for (var j = 0; j < this.#cols; j++) {
            nodo = this.#createNode()
            //se almacena para ser evaluado
            this.#board[i][j] = nodo
            row.appendChild(nodo)
        }

    }
}
```

En el método anterior se llama al método createNode, que crea una celda, el contenido del método es:

```js
 #createNode() {
        var nodo = document.createElement("div")
        nodo.classList.add("cell")
        nodo.addEventListener("click", (event) => {
            var node = event.target
            //evita que se coloque en una que ya tiene una ficha
            if (!node.classList.contains("circle")) {
                var circle = document.createElement("div")
                circle.classList.add("circle")
                if (this.getTurn()) {
                    circle.style.backgroundImage = "url('" + this._options.player1.url + "')";
                    circle.classList.add("circle_playerOne")

                } else {
                    circle.style.backgroundImage = "url('" + this._options.player2.url + "')";
                    circle.classList.add("circle_playerTwo")
                }
                //cambio de turno y añadir al elemento
                this.toggleTurn();
                node.appendChild(circle)
            }

        })
        return nodo
    }
```
Crea un nodo con clase cell (CSS), añadiendose un esuchador de eventos.

Otro punto destacado es la evaluación del tablero, que evalua si se ha atrapado alguna ficha de uno u otro jugador, usando un método recursivo, evalCell:

```js
    #evalBoard() {
        for (var i = 0; i < this.#rows; i++) {
            for (var j = 0; j < this.#cols; j++) {
                if (this.#board[i][j] != null && !this.#isEmpty(this.#board[i][j])) {
                    var resultado = this.#evalCell(i, j, [[i, j]])
                    console.log(resultado)
                    //si devuelve una lista con algún elemento, se cambia de color
                    if (resultado.length > 0) {
                        resultado.forEach((coord) => {
                            this.#clearCell(coord[0], coord[1])
                        })
                    }
                }

            }
        }
        var score = this.#countBoard();
        this.#scoreplayer1.innerHTML = score[0]
        this.#scoreplayer2.innerHTML = score[1]
    }
    #evalCell(row, column, vecinos_color) {
        var atrapado = true
        let vecinos_nuevos = []
        var color = this.#getColor(this.#board[row][column])
        //en el momento que existe una libre se para
        for (var i = -1; i <= 1 && atrapado; i++)
            for (var j = -1; j <= 1 && atrapado; j++) {
                //solo la de la izquierda, derecha, arriba y abajo que se encuentren entre los ímites
                if ((Math.abs(i) + Math.abs(j) == 1) && row + i >= 0 && row + i < this.#rows - 1 && column + j >= 0 && column + j < this.#cols - 1) {
                    if (this.#isEmpty(this.#board[row + i][column + j])) {
                        atrapado = false
                    } else {
                        //se añade para evaluar si es necesario las que son del mismo color
                        if (this.#getColor(this.#board[row + i][column + j]) == color) {
                            //falta comprobar que no estan en la lista
                            var coords = [row + i, column + j]
                            if (!vecinos_color.some(([x, y]) => x === coords[0] && y === coords[1])) {
                                vecinos_nuevos.push(coords)

                            }
                        }
                    }
                }
            }
        this.#board[row][column].childNodes[0].classList.add("red")
        //nuevas celdas evaluadas
        let nuevos = []
        if (atrapado) {
            //esta rodeado por al meno uno de los suyos que se tiene que evaluar para ver
            //si tiene escapatoria
            if (vecinos_nuevos.length > 0) {
                //alguno esta libre
                for (var i = 0; i < vecinos_nuevos.length; i++) {
                    var cell = vecinos_nuevos[i]
                    //llamada recursiva
                    var libre = this.#evalCell(cell[0], cell[1], vecinos_color.concat([cell]))
                    if (libre.length == 0) {
                        atrapado = false
                        return []
                    } else {
                        //se añade a los conectados
                        nuevos = nuevos.concat(libre)

                    }
                }
                //en este punto no se ha encontrado nada libre, se añaden y se devuelven
                //si llega a la llamada principal, se cambia de color
                var mergedArray = [...new Set([...vecinos_nuevos, ...vecinos_color, ...nuevos])]
                return mergedArray //vecinos_color.concat(nuevos).concat(vecinos_nuevos)
            } else {
                //no existe ningun vecino y está atrapado, se devuelve el mismo
                return vecinos_color
            }
        }
        //no esta atrapado
        return []
    }

```
Para evaluar una celda se miran la posiciones (si es posible): arriba, abajo, izquierda y derecha, si alguna es del mismo color y no está en la lista se añade a una lista.
En caso de estar rodeado se devuelve la celda, en caso de no estar atrapado lista vacia, y si algun vecino es del mismo color y no se ha evaluado se evalua para ver si existe una escapatoria.

