import React, { Component } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Stop, Trash } from 'react-bootstrap-icons';
import { connect } from 'react-redux';

import { Section, Subsection } from '../../../components/Section';
import SortableElements from '../../../components/SortableElements';

import { queue_status } from '../../../sockets/sCallbacks';
import { queue_get_status, queue_set_order, queue_stop_drawing } from '../../../sockets/sEmits';
import { listsAreEqual } from '../../../utils/dictUtils';
import { getElementClass } from '../playlists/SinglePlaylist/Elements';
import { isViewQueue } from '../selector';

import { setTab, tabBack } from '../Tabs.slice';
import { setQueueElements, setQueueStatus } from './Queue.slice';
import { getQueueCurrent, getQueueElements, getQueueEmpty } from './selector';

const mapStateToProps = (state) => {
    return {
        elements: getQueueElements(state),
        currentElement: getQueueCurrent(state),
        isQueueEmpty: getQueueEmpty(state),
        isViewQueue: isViewQueue(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setQueueStatus: (val) => dispatch(setQueueStatus(val)),
        handleTabBack: () => dispatch(tabBack()),
        setQueueElements: (list) => dispatch(setQueueElements(list)),
        setTabHome: () => dispatch(setTab('home'))
    }
}

class Queue extends Component{
    constructor(props){
        super(props);
        this.state = {
            elements: [], 
            refreshList: false
        }
    }

    componentDidUpdate(){
        if (!listsAreEqual(this.state.elements, this.props.elements)){
            this.setState({...this.state, elements: this.props.elements, refreshList: true});
        }
        if (this.props.isQueueEmpty && this.props.isViewQueue){
            this.props.handleTabBack();
        }
    }

    componentDidMount(){
        queue_status(this.parseQueue.bind(this));
        queue_get_status();
    }

    parseQueue(data){
        let res = JSON.parse(data);
        res.elements = res.elements.map((el) => { return JSON.parse(el) });
        this.props.setQueueStatus(res);
    }

    handleSortableUpdate(list){
        if (!listsAreEqual(list, this.state.elements)){
            this.setState({...this.state, elements: list});
            this.props.setQueueElements(list);
            queue_set_order(list);
        }
    }

    clearQueue(){
        // save an empty list
        this.handleSortableUpdate([]);
    }

    stopDrawing(){
        queue_stop_drawing();
    }

    renderList(){
        if (this.state.elements !== undefined)
            if (this.state.elements.length > 0){
                return <Subsection sectionTitle="Coming next..."
                        sectionButton="Clear queue"
                        buttonIcon={Trash}
                        sectionButtonHandler={this.clearQueue.bind(this)}>
                    <SortableElements
                        list={this.state.elements}
                        onUpdate={this.handleSortableUpdate.bind(this)}
                        refreshList={this.state.refreshList}
                        onListRefreshed={()=>this.setState({...this.state, refreshList: false})}
                        hideOptions={true}>
                    </SortableElements>
                </Subsection>
            }
        return "";
    }

    render(){
        if (this.props.isQueueEmpty){
            return <Container>
                <div className="center pt-5">
                    Nothing is being drawn at the moment
                </div>
                <div className="center pt-3">
                    <Button onClick={() => this.props.setTabHome()}>Homepage</Button>
                </div>
            </Container>
        }else{
            let ElementType = getElementClass(this.props.currentElement);
            return <Container>
                <Section sectionTitle="Now drawing"
                        sectionButton="Stop drawing"
                        buttonIcon={Stop}
                        sectionButtonHandler={this.stopDrawing.bind(this)}>
                    <Row className={"center"}>
                        <Col sm={6} className="mb-5 position-relative">
                            <ElementType element={this.props.currentElement}
                                hideOptions={"true"}/>
                        </Col>
                    </Row>
                </Section>
                {this.renderList()}
            </Container>
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);