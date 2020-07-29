// Productos y servicios
export const setListadoProductos = payload => ({
    type: 'SET_LISTADO_PRODUCTOS',
    payload,
});

// Sesion de usuario
export const setEstado = payload => ({
    type: 'SET_ESTADO_USUARIO',
    payload,
});

export const setModal = payload => ({
    type: 'SET_MODAL',
    payload,
});

// autorizarUsuario
export const autorizarUsuario = payload => ({
    type: 'SET_AUTORIZAR_USUARIO',
    payload,
});

export const setUsuario = payload => ({
    type: 'SET_USUARIO',
    payload,
});

export const setFirebaseInitialized = payload => ({
    type: 'SET_INICIO_FIREBASE',
    payload,
});

export const setInicioSesion = payload => ({
    type: 'SET_INICIO_SESION',
    payload,
});

// Formulario de contacto 
export const setEnviarForm = payload => ({
    type: 'SET_ENVIAR_FORM',
    payload,
});

export const setRequerimiento = payload => ({
    type: 'SET_REQUERIMIENTO',
    payload,
});

// Tienda y Gestion de Compras
export const setAceptar = payload => ({
    type: 'SET_PAGAR',
    payload,
});

export const setRechazar = payload => ({
    type: 'SET_RECHAZAR',
    payload,
});

export const addCompra = (compra) => {
    return (dispatchEvent, getState) => {
        // async call to database
        dispatchEvent({
            type: 'ADD_COMPRA',
            compra
        });
    }
};

// Mensajes => payload =>

export function agregarMensaje(text, payload) {
  return { 
    type: 'ADD_TODO',
    text,    
    payload,
  };
};

export function eliminarMensaje(id, payload) {
  return { 
    type: 'ELIMINAR_TODO',
    id,
    payload,
  };
};

export function editarMensaje(id, text, payload) {
  return { 
    type: 'EDITAR_TODO',
    text,
    id,
    payload,
  };
};

export function enviarMensaje(id, payload) {
  return { 
    type: 'COMPLETE_TODO',
    id,
    payload,
  };
};

export function mensajeEntregado(payload) {
  return { 
    type: 'ENTREGA_COMPLETA',
    payload,
  };
};

export function limpiarEntrega(payload) {
  return { 
    type: 'LIMPIEZA_COMPLETA',
    payload,
  };
};

/*
 * tipos de acciones
 */

export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * otras constantes
*/

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * creadores de acciones
*/

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}