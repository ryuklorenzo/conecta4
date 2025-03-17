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