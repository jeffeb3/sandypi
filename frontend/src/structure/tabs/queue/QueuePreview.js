import './Queue.scss';

import { Component } from 'react';
import { connect } from 'react-redux';

import { getQueueCurrent, getQueueElements, getQueueEmpty } from './selector';
import { getElementClass } from '../playlists/SinglePlaylist/Elements';

const mapStateToProps = (state) => {
    return {
        elements: getQueueElements(state),
        currentElement: getQueueCurrent(state),
        isQueueEmpty: getQueueEmpty(state)
    }
}

class QueuePreview extends Component{
    render(){
        if (this.props.currentElement !== undefined){
            let ElementType = getElementClass(this.props.currentElement);
            return <div onClick={this.props.onClick.bind(this)} className={"preview-bar-container p-2 m-2 rounded clickable"+ (this.props.isQueueEmpty ? " d-none" : "")}>
                <div className="text-primary  d-inline-block mr-2">Now drawing: </div>
                <div className="d-inline-block preview-bar-image">
                    <ElementType element={this.props.currentElement} showPreview={"true"} hideOptions={"true"}/>
                </div>
            </div>
        }else{
            return ""
        }
    }
}

export default connect(mapStateToProps)(QueuePreview);