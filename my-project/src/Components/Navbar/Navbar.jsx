import React from "react";
import {Link} from "react-router-dom";

function Navbar() {
    let userId = 5;
    return(
        <div>
            {/* Home Linkine tıklandığında,  App.jsx > Switch > Route path="/" 'den gelerek, Home Component'ini derleyecektir. */}
            <li><Link to="/">Home</Link></li>   
            <li><Link to={{pathname : '/users/' + userId}}></Link></li>
        </div>
    )
}
    
    


export default Navbar;