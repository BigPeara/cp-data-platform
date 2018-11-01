import { createStore } from 'redux';
import Cookies from 'js-cookie';

const TOGGLECOLLAPSED = 'togglecollapsed';

let collapsed = Cookies.get(TOGGLECOLLAPSED) || false;
if (collapsed === 'false') {
    collapsed = false
} else if (collapsed === 'true') {
    collapsed = true;
}

var toggle = (state = collapsed ,action)=>{
    switch ( action.type ){
        case TOGGLECOLLAPSED:
            Cookies.set( TOGGLECOLLAPSED, !state) 
            return state = !state;
        default:
            return state;
    }
}

export default createStore(toggle);