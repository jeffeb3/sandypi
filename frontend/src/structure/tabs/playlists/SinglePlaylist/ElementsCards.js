import React, { Component } from 'react';
import Image from '../../../../components/Image';
import { getImgUrl } from '../../../../utils/utils';

class BasicElement extends Component{

    getModalOptions(){
        return false;
    }

    showModal(){
        let options = this.getModalOptions();
        if (options){
            console.log("Must show options");   //TODO
        }
    }

    render(){
        return <div className="bg-primary card-img-top"></div>;
    }
}

class DrawingElement extends BasicElement{

    getModalOptions(){
        return false;
    }

    render(){
        return <Image className="w-100" 
                    src = {getImgUrl(this.props.element.drawing_id)} 
                    alt={"Drawing "+this.props.element.drawing_id}/>
    }
}

export { BasicElement, DrawingElement };