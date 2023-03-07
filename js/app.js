const moduloGame = (() => {
    'use strict'

    let deck         = [];
    const tipos      = ["C", "D", "H", "S"], 
          especiales = ["A", "J", "K", "Q"];
    
    let puntosJugadores = [];
    
    const btnPedir = document.querySelector("#btnPedir"), 
          btnPasar = document.querySelector("#btnPasar"),
          btnNuevo = document.querySelector("#btnNuevo");

    const divCartasJugadores = document.querySelectorAll(".divCartas"),
          puntosHTML = document.querySelectorAll("small");
    
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
    
        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerText = "");
    
        btnPedir.disabled = false;
        btnPasar.disabled = false;
    }
    
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
    
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
    
        return _.shuffle(deck);
    };
    
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw "No hay cartas en el deck";
        }
    
        return deck.pop();
    }
    
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
                                (valor === 'A') ?
                                                11 : 10
                                : valor * 1;
    }
    

    const acumularPuntos = ( turno, carta ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const repartirCarta = ( turno, carta ) => {
        const imgCard = document.createElement('img');
        imgCard.src = `img/${carta}.png`;
        imgCard.classList.add('carta');
        divCartasJugadores[turno].append(imgCard);
    }

    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(puntosJugadores.length - 1, carta);
            repartirCarta(puntosJugadores.length - 1, carta);
        } while ( puntosComputadora < puntosMinimos && puntosMinimos < 21 );
    
        setTimeout(() => {
            if (puntosComputadora > puntosMinimos && puntosComputadora <= 21) {
                alert('Perdiste');
            } else if (puntosComputadora == puntosMinimos && puntosComputadora <= 21) {
                alert('Empate');
            } else {
                alert('Ganaste');
            }
        }, 100);
    }

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(0, carta);
        repartirCarta(0, carta);
    
        setTimeout(() => {
            if ( puntosJugador > 21 ) {
                btnPedir.disabled = true;
                btnPasar.disabled = true;
                alert("Perdiste");
            } else if (puntosJugador === 21) {
                btnPedir.disabled = true;
                btnPasar.disabled = true;
                alert("Ganaste");
            }
        }, 100);
    
    });
    
    btnPasar.addEventListener('click', () => {
        btnPasar.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });
    
    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego: inicializarJuego
    };
})();