import React,{Component} from 'react';

import Esp32 from './components/esp32'

class App extends Component{
    render(){
        return(
            <div>
            <h1>Calidad de gas</h1>
                <Esp32/>
            </div>
        )
    }
}

export default App;
