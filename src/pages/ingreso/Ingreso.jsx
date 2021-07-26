/* eslint-disable prettier/prettier */
// Pagina de Ingreso
import React from "react";
import "../../../public/assets/css/ingreso.css";

const Ingreso = (props) => {
  let checkStyle = {
    width: "30px",
  };

  return (
    <>
      <main className="section">
        <div className="pageContainer">
          <div className="ingresoFormulario">
            <div className=" row">
              <div className="imagenIngreso"></div>
              <div className="colRight">
                <div className="ingresarFormulario">
                  <span className="tituloformulario">
                    <h1>Bienvenido!</h1>
                  </span>
                  <p>
                    ERES NUEVO, <br />
                    CREA FÁCIL UNA CUENTA!<a href="">, Registrate</a>
                  </p>
                  <br />
                  <ul>
                    <li>
                      <a href="">INGRESAR CON FACEBOOK </a>
                    </li>
                    <li>
                      <a href="">INGRESAR CON GMAIL </a>
                    </li>
                  </ul>
                  <br />
                  <form id="formularioIngreso" action="">
                    <hr />
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="correo o número celular"
                    />
                    <br />
                    <br />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="contraseña"
                    />
                    <br />
                    <span>
                      <a href="">OLVIDASTE LA CONTRASEÑA</a>
                    </span>
                    <br />
                    <input type="checkbox" name="" id="" style={checkStyle} />
                    <span> Recuérdame </span>
                    <br />
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      style={checkStyle}
                      required
                    />
                    <span> NO SOY UN ROBOT </span> <br />
                    <br />
                    <button>INICIAR SESIÓN</button>
                    <br />
                    <hr />
                  </form>
                  <span className="tituloformulario">
                    <h1>BIENVENIDO</h1>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ingresoUbicacion">
            <div className="row" style={{"width": "100%"}}>
              <div className="colLeft">
                <span className="tituloformulario">
                  {" "}
                  <h1>Ingresa tu ubicación</h1>{" "}
                </span>
                <p>
                  Podras consultar con mejor <br />
                  precision los costos y <br />
                  tiempos de entrega <br />
                </p>
                <form action="busquedaCiudad">
                  <label htmlFor=""> Ciudad </label>
                  <br />
                  <select name="city" id="city">
                    <option>seleccionar uno</option>
                    <option value="Bogota">Bogota</option>
                  </select>
                  <br />
                  <label htmlFor="">Dirección</label>
                  <br />
                  <input type="text" />
                  <br />
                  <button className="btn">Consultar</button>
                </form>
              </div>
              <div className="imagenUbicacion"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Ingreso;
