/**
 * Función autoejecutable que nos devuelve una función según el tipo de navegador que usemos
 */
const addEvent = (function () {
  /**
   * Manejador que se ejecutará si nuestro navegador reconoce addEventListener de W3C
   * @param {object} elemento Elemento que hará disparar el evento
   * @param {string} evento Evento en minúsculas que se disparará
   * @param {function} funcion Manejador del Evento
   */
  const w3cAddEvento = (elemento, evento, funcion) => {
    elemento.addEventListener(evento, funcion, false);
  };
  /**
   * Manejador que se ejecutará si el navegador es Internet Explorer
   * @param {object} elemento Elemento que hará disparar el evento
   * @param {string} evento Evento en minúsculas que se disparará
   * @param {function} funcion Manejador del Evento
   */
  const ieAddEvento = (elemento, evento, funcion) => {
    evento = 'on' + evento.CharAt(0).toUpperCase() + evento.substring(1);
    const fx = () => {
      funcion.call(elemento);
    };
    elemento.attachEvent(evento, fx);
  };
  /**
   * Manejador que se ejecutará para navegadores que no sean IE no reconozcan las recomendaciones de W3C
   * @param {object} elemento Elemento que hará disparar el Evento
   * @param {string} evento Evento en minúsculas que se disparará
   * @param {function} funcion Manejador del Evento
   */
  const clasicoAddEvento = (elemento, evento, funcion) => {
    evento = 'on' + evento.CharAt(0).toUpperCase() + evento.substring(1);
    elemento.evento = funcion;
  };
  // Según sea el Browser, así se tendrá en cuenta el manejador correspondiente
  if (typeof window.addEventListener !== 'undefined') {
    return w3cAddEvento;
  } else if (typeof window.attachEvent !== 'undefined') {
    return ieAddEvento;
  } else {
    return clasicoAddEvento;
  }
})();
const removeEvent = (function () {
  const w3cRemoveEvent = (elemento, evento, funcion) => {
    elemento.removeEventListener(evento, funcion, false);
  };
  const ieRemoveEvent = (elemento, evento, funcion) => {
    evento = 'on' + evento.charAt(0).toUpperCase() + evento.substring(1);
    const fx = () => {
      funcion.call(elemento);
    };
    elemento.detachEvent(evento, fx);
  };
  const clasicoRemoveEvent = (elemento, evento, funcion) => {
    evento = 'on' + evento.charAt(0).toUpperCase() + evento.substring(1);
    elemento.evento = funcion;
  };
  if (typeof window.removeEventListener !== 'undefined') {
    return w3cRemoveEvent;
  } else if (typeof window.detachEvent !== 'undefined') {
    return ieRemoveEvent;
  } else {
    return clasicoRemoveEvent;
  }
})();
/**
 * Manejador del evento DOMContentLoaded
 */
const handlerPrincipal = () => {
  // Array inicial de aficiones
  let arrayAficiones = [
    'Leer',
    'Dormir',
    'Cine',
    'Videojuegos',
    'Fútbol',
    'Tenis',
    'Nadar',
    'Bucear',
    'Senderismo',
    'Escalada',
    'Esquiar',
    'Pescar',
  ];
  // Array en donde se almacenan las aficiones seleccionadas
  let arrayAficionesSeleccionadas = [];
  /**
   * Función que recarga un array en un Select
   * @param {array} arrayElementos Array de datos que se insertarán en el Select
   * @param {select} ventanaElementos Select en donde se insertarán los datos
   */
  const leerDatos = (arrayElementos, ventanaElementos) => {
    // Borro todos los Options del Select
    while (ventanaElementos.options.length !== 0) {
      ventanaElementos.remove(0);
    }
    // Copio el Array dentro del Select ordenado
    arrayElementos.sort();
    arrayElementos.forEach(elemento => {
      const nuevoElemento = document.createElement('option');
      const nuevoTexto = document.createTextNode(elemento);
      nuevoElemento.appendChild(nuevoTexto);
      nuevoElemento.setAttribute('value', elemento.substring(0, 3).toLowerCase());
      ventanaElementos.add(nuevoElemento);
    });
  };
  const ventanaAficiones = document.getElementById('aficiones');
  const ventanaAficionesSeleccionadas = document.getElementById('aficionesSeleccionadas');
  const botonesMovimientos = document.querySelectorAll('.contenedor div button');
  // Cargamos los datos en el primer Select
  leerDatos(arrayAficiones, ventanaAficiones);
  /**
   * Función que intercambia datos entre Selects
   * @param {select} ventanaOrigen Ventana de donde se recogerán los datos
   * @param {select} ventanaDestino Ventana destino en donde se almacenarán los datos
   */
  const moverDatos = (ventanaOrigen, ventanaDestino) => {
    let arrayOrigen;
    let arrayDestino;
    // Según el ID de la ventana origen, así se establece la dirección de trabajo
    if (ventanaOrigen.id === 'aficiones') {
      arrayOrigen = arrayAficiones;
      arrayDestino = arrayAficionesSeleccionadas;
    } else {
      arrayOrigen = arrayAficionesSeleccionadas;
      arrayDestino = arrayAficiones;
    }
    // Si hay algo seleccionado...
    if (ventanaOrigen.selectedOptions.length !== 0) {
      // Se hace un bucle al revés para que, a la hora de eliminar un elemento, no se interfiera en el índice
      for (let i = ventanaOrigen.selectedOptions.length - 1; i >= 0; i--) {
        arrayOrigen.splice(ventanaOrigen.selectedOptions[i].index, 1);
        arrayDestino.push(ventanaOrigen.selectedOptions[i].label);
      }
      // Se recargan los datos en las 2 ventanas
      leerDatos(arrayOrigen, ventanaOrigen);
      leerDatos(arrayDestino, ventanaDestino);
    } else {
      alert('No existen elementos seleccionados');
    }
  };
  const addSelected = () => {
    moverDatos(ventanaAficiones, ventanaAficionesSeleccionadas);
  };
  const addAll = () => {
    for (let i = 0; i < ventanaAficiones.length; i++) {
      ventanaAficiones.options[i].setAttribute('selected', true);
    }
    moverDatos(ventanaAficiones, ventanaAficionesSeleccionadas);
  };
  const returnSelected = () => {
    moverDatos(ventanaAficionesSeleccionadas, ventanaAficiones);
  };
  const returnAll = () => {
    for (let i = 0; i < ventanaAficionesSeleccionadas.length; i++) {
      ventanaAficionesSeleccionadas.options[i].setAttribute('selected', true);
    }
    moverDatos(ventanaAficionesSeleccionadas, ventanaAficiones);
  };
  const handlerBotones = evento => {
    const botones = {
      pasaSeleccionados: addSelected,
      pasaTodos: addAll,
      regresaSeleccionados: returnSelected,
      regresaTodos: returnAll,
    };
    botones[evento.target.id]();
  };
  for (let i = 0; i < botonesMovimientos.length; i++) {
    addEvent(botonesMovimientos[i], 'click', handlerBotones);
  }
};
addEvent(document, 'DOMContentLoaded', handlerPrincipal);
