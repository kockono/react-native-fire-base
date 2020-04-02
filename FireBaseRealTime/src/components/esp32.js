import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from 'react-switch';
import './a.css'

class Esp32 extends Component {
    
    constructor() {
        super();
        this.state = {
            checked:true,
            message: '', // Aqui almacenaremos el mensaje del input
            messages: [

            ]
        }
        this.handleChange=this.handleChange.bind(this)
    }


    componentDidMount() {
        window.firebase.database().ref('dispositivos/prototipo01/realtime/').on('value', snap => { // Guardar datos en messages5
            const currentmessages = snap.val();
            let checked=true
            if(currentmessages[0].apagado===1){
                checked=true
            }
            else{
                checked=false
            }
            
            if(currentmessages != null) {
                this.setState({
                    messages: currentmessages,
                    checked
                  
                });
            }
        });
    }


    handleChange(checked) { // Recibe el evento de la informacion
        
        this.setState({checked})
     
        let num=checked?1:0
        
        window.firebase.database().ref(`dispositivos/prototipo01/realtime/0/apagado`) // Contendran una id
        .set(num);
        this.setState({message: ''}); // Limpiar valor
    }
    
    render() {

        const {messages} = this.state;
        const messagesList = messages.map(message => {
            return <div><h2> Cantidad de gas en el ambiente: {message.ppm}ppm</h2>  <h2>Valvula: {message.apagado===1?"on":"off"}</h2></div>

        })

        return(
            <div class ="division">
                <h1>Calidad de gas</h1>
                <div> {messagesList}</div>
       
                   <Switch
                   onChange={this.handleChange}
                   checked={this.state.checked}
                   uncheckedIcon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 15,
                        color: "orange",
                        paddingRight: 2
                      }}
                    >
                      Off
                    </div>
                  }
                  checkedIcon={
                    <svg viewBox="0 0 10 10" height="100%" width="100%" fill="aqua">
                      <circle r={3} cx={5} cy={5} />
                    </svg>
                  }
                  className="react-switch"
                  id="icon-switch"
                   
                   />
            </div>
        )
    }
}

export default Esp32;

