/**
 * Función que se ejecuta al principio, y que, según el navegador que sea nos devuelve una función que controla los eventos
 */
const addEvento = (function () {
  /**
   * Función que carga un evento si el navegador se rige por el W3C
   * @param {element} elemento Elemento en donde actuará el evento
   * @param {event} evento Evento que actuará
   * @param {function} manejador Manejador del evento
   */
  const w3cEvento = (elemento, evento, manejador) => {
    elemento.addEventListener(evento, manejador, false);
  };
  /**
   * Función que carga un evento si el navegador es Internet Explorer
   * @param {element} elemento Elemento en donde actuará el evento
   * @param {event} evento Evento que actuará
   * @param {function} manejador Manejador del evento
   */
  const ieEvento = (elemento, evento, manejador) => {
    evento = 'on' + evento.charAt(0).toUpperCase() + evento.substring(1);
    const fx = () => {
      manejador.call(elemento);
    };
    elemento.attachEvent(evento, fx);
  };
  /**
   * Función que cargará un evento para un navegador muy antiguo
   * @param {element} elemento Elemento en donde actuará el evento
   * @param {event} evento Evento que actuará
   * @param {function} manejador Manejador del evento
   */
  const tradicionalEvento = (elemento, evento, manejador) => {
    evento = 'on' + evento.charAt(0).toUpperCase() + evento.substring(1);
    elemento.evento = manejador;
  };
  if (typeof window.addEventListener !== 'undefined') {
    return w3cEvento;
  } else if (typeof window.attachEvent !== 'undefined') {
    return ieEvento;
  } else {
    return tradicionalEvento;
  }
})();
// Array de precios de Pizzas
var pizzas = [
  ['Margarita', 8, 10, 14],
  ['Tropical', 7, 9, 13],
  ['Carbonara', 9, 11, 15],
  ['4 quesos', 10, 13, 17],
];
// Objeto de arrays de ingredientes de cada Pizza
var ingredientesPizzas = {
  Margarita: ['Jamón cocido', 'Queso'],
  Tropical: ['Piña', 'Mango'],
  Carbonara: ['Carne Ternera', 'Bacon'],
  '4 quesos': ['Emmental', 'Brie', 'Rulo de cabra', 'Queso Azul'],
};
/**
 * Manejador del evento DOMContentLoaded
 */
const handlerPrincipal = () => {
  const boton = document.getElementById('add'); // Elemento botón Añadir Pedido
  const tipo = document.getElementById('tipo'); // Elemento select de Pizzas
  const tamano = document.getElementsByName('tam'); // Conjunto de elementos RadioButton del tamaño de las Pizzas
  const cantidad = document.getElementById('num'); // Elemento input de Cantidad de Pizzas
  const pedidos = document.getElementById('pedido'); // Elemento select de Pizzas Recibidas
  const total = document.getElementById('total'); // Elemento input de Total de Pedido
  const bolsa = document.getElementById('bolsa'); // Elemento img de corresponde a la imagen de la bolsa que se cambiará
  /**
   * Procedimiento que carga el select Pizzas con los valores de los atributos del objeto Ingredientes
   */
  const cargaArray = () => {
    for (nombrePizza in ingredientesPizzas) {
      const elementoNuevo = document.createElement('option');
      const textoNuevo = document.createTextNode(nombrePizza);
      elementoNuevo.appendChild(textoNuevo);
      elementoNuevo.setAttribute('value', nombrePizza.substring(0, 3).toLowerCase());
      tipo.appendChild(elementoNuevo);
    }
  };
  /**
   * Función Objeto Pedido en donde se almacenarán todos los datos de cada Pedido y también se realizarán las acciones pertinentes
   */
  const Pedido = function () {
    this._nombre; // Nombre de la Pizza
    this._ingredientes; // Array de Ingredientes de la Pizza
    this._tamano; // Tamaño de la Pizza
    this._cantidad; // Cantidad de Pizzas en el Pedido
    this._precioUnitario; // Precio Unitario de Pizza
    this._precioTotal; // Precio Total de las Pizzas en el Pedido
    /**
     * Método para crear un Pedido
     * @param {string} nombre Nombre de la Pizza
     * @param {string} tamano Tamaño de la Pizza
     * @param {integer} cantidad Número de Pizzas del Pedido
     */
    this.setPizzaNueva = function (nombre, tamano, cantidad) {
      let valido = false;
      // Se comprueba si el nombre de la Pizza es válido o no
      for (nombrePizza in ingredientesPizzas) {
        if (nombrePizza === nombre) {
          valido = true;
        }
      }
      if (valido) {
        this._nombre = nombre;
      } else {
        throw 'Pizza no válida';
      }
      // Objeto para realizar la conversión de nombres de entre los values del select y el tamaño que almacenará el objeto
      const tamanoPizzas = {
        peq: 'Pequeña',
        med: 'Mediana',
        gra: 'Grande',
      };
      // Si el tamaño no está definido se produce una excepción, y sino se almacena en el objeto
      if (tamanoPizzas[tamano] !== undefined) {
        this._tamano = tamanoPizzas[tamano];
      } else {
        throw 'Tamaño de Pizza inválido';
      }
      // Se almacena la lista de ingredientes en el objeto
      this._ingredientes = ingredientesPizzas[this._nombre];
      // Selección del precio unitario de las Pizzas em el Array mediante el uso del objeto siguiente
      pizzas.forEach(pizza => {
        if (pizza[0] === nombre) {
          const eleccionIndice = {
            peq: 1,
            med: 2,
            gra: 3,
          };
          this._precioUnitario = pizza[eleccionIndice[tamano]];
        }
      });
      // Se comprueba que el valor insertado para la Cantidad es válido o no. Si no es así se produce una excepción
      let cantidadElegida = Number(cantidad);
      if (!isNaN(cantidadElegida)) {
        if (Number.isInteger(cantidadElegida)) {
          if (cantidadElegida > 0) {
            this._cantidad = cantidad;
            this._precioTotal = this._cantidad * this._precioUnitario;
          } else {
            throw 'La Cantidad insertada no es un valor entero positivo';
          }
        } else {
          throw 'La Cantidad insertada no es un valor entero';
        }
      } else {
        throw 'La Cantidad insertada no es un valor numérico';
      }
    };
    /**
     * Método privado para convertir un array de strings en un único string
     * @returns Devuelve un string indicando los ingredientes usados para la elaboración de la Pizza
     */
    const listaIngredientes = () => {
      let strIngredientes = '';
      for (let i = 0; i < this._ingredientes.length; i++) {
        if (i === this._ingredientes.length - 1) {
          strIngredientes += ' y ';
        } else if (i !== 0) {
          strIngredientes = ', ';
        }
        strIngredientes += this._ingredientes[i];
      }
      return strIngredientes;
    };
    /**
     * Método que devuelve el mensaje que se cargará en la ventana de confirmación
     * @returns Devuelve unh string con el mensaje que se cargará en la ventana de confirmación
     */
    this.toMessage = function () {
      return `Nombre: ${this._nombre}\nIngredientes: ${listaIngredientes()}\nTamaño: ${this._tamano}\nPrecio unidad: ${
        this._precioUnitario
      }\nCantidad: ${this._cantidad}\nPrecio total: ${this._precioTotal}`;
    };
    /**
     * Método de devuelve el option que se cargará en el select de las Pizzas Pedidas
     * @returns Devuelve un elemento option que se cargará en el select de Pizzas Pedidas
     */
    this.toRegistro = function () {
      const nuevoElemento = document.createElement('option');
      const nuevoTexto = document.createTextNode(
        `${this._cantidad} - ${this._nombre} - ${listaIngredientes()} - ${this._tamano} - ${this._precioUnitario} - ${
          this._precioTotal
        }`
      );
      nuevoElemento.appendChild(nuevoTexto);
      nuevoElemento.setAttribute('precio', this._precioTotal);
      return nuevoElemento;
    };
    /**
     * Getter que devuelve el precio total
     * @returns Devuelve el precio total
     */
    this.getPrecioTotal = function () {
      return this._precioTotal;
    };
  };
  // Se carga el select inicialmente
  cargaArray();
  /**
   * Manejador para el evento click del botón Añadir Pedido
   */
  const handlerBoton = () => {
    let valido = false;
    const nombre = tipo.options[tipo.selectedIndex].label; // Leemos el nombre de la Pizza
    let tamanoPizza; // Variable en donde se almacenará provisionalmente el tamaño de la Pizza
    // Comprobamos que alguno de los componentes RadioButton ha sido seleccionado, y si es así, se almacena su valor
    tamano.forEach(elemento => {
      if (elemento.checked) {
        valido = true;
        tamanoPizza = elemento.value;
      }
    });
    // Si todo va bien...
    if (valido) {
      // Comprobamos que el valor insertado en el input Cantidad el válido o no
      if (cantidad.value !== '') {
        let cantidadPizzas = Number(cantidad.value);
        if (!isNaN(cantidadPizzas)) {
          if (Number.isInteger(cantidadPizzas)) {
            if (cantidadPizzas > 0) {
              // Si todo es correcto se crea un objeto
              let nuevoPedido = new Pedido();
              // Se coloca aquí un try...catch para controlar las excepciones que podrían generarse desde el objeto con los throw
              try {
                nuevoPedido.setPizzaNueva(nombre, tamanoPizza, cantidadPizzas);
                const eleccion = confirm(nuevoPedido.toMessage()); // Se pregunta si los datos son correctos y se muestra el resultado por pantalla
                if (eleccion) {
                  pedidos.appendChild(nuevoPedido.toRegistro()); // Insertamos el option dentro del select de Pizzas Pedidas
                  total.value = Number(total.value) + nuevoPedido.getPrecioTotal(); // Se actualiza el valor del Total del Pedido
                  bolsa.setAttribute('src', 'bolsallena.jpg'); // Se cambia la imagen para indicar que existen datos en el pedido y no está vacío
                }
              } catch (error) {
                alert('Parámetros incorrectos');
              }
            } else {
              alert('El valor insertado en Cantidad no es positivo');
              cantidad.focus();
            }
          } else {
            alert('El valor insertado en Cantidad no es un valor entero');
            cantidad.focus();
          }
        } else {
          alert('El valor insertado de la Cantidad no es numérico');
          cantidad.focus();
        }
      } else {
        alert('No se ha insertado una cantidad válida');
        cantidad.focus();
      }
    } else {
      alert('No se ha seleccionado el tamaño de la Pizza');
    }
  };
  // Listener del evento click en el elemento boton
  addEvento(boton, 'click', handlerBoton);
};
// Listener del evento DOMContentLoaded en el elemento document (Cuando se carga por completo el DOM)
addEvento(document, 'DOMContentLoaded', handlerPrincipal);
