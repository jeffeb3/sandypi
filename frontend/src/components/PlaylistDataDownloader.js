import { Component } from 'react';
import { connect } from 'react-redux';

import { setPlaylists, setSinglePlaylistId, updateSinglePlaylist } from '../structure/tabs/playlists/Playlists.slice';
import { showSinglePlaylist } from '../structure/tabs/Tabs.slice';
import { isShowNewPlaylist } from '../structure/tabs/playlists/selector';

import { playlists_request } from '../sockets/sEmits';
import { playlists_refresh_response, playlists_refresh_single_response, playlist_create_id } from '../sockets/sCallbacks';


const mapStateToProps = (state) => {
    return {
        showNewPlaylist: isShowNewPlaylist(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPlaylists: (playlists) => dispatch(setPlaylists(playlists)),
        refreshSinglePlaylist: (res) => dispatch(updateSinglePlaylist(res)),
        loadNewPlaylist: (pl, showPlaylist) => {
            console.log(pl)
            dispatch(updateSinglePlaylist(pl));
            if (showPlaylist)
                dispatch(setSinglePlaylistId(pl.id)); 
            if (showPlaylist)
                dispatch(showSinglePlaylist(pl.id));
        }
    }
}

class PlaylistDataDownloader extends Component{

    componentDidMount(){
        playlists_refresh_response(this.onPlaylistsRefresh.bind(this));
        playlists_refresh_single_response(this.onSinglePlaylistRefresh.bind(this));
        playlist_create_id(this.onPLaylistIdCreated.bind(this));
        this.requestPlaylists();
    }
    
    requestPlaylists(){
        playlists_request();
    }

    onPlaylistsRefresh(res){
        this.props.setPlaylists(res.map((el)=>{return JSON.parse(el)}));
    }

    onSinglePlaylistRefresh(res){
        let playlist = JSON.parse(res);
        playlist.elements = JSON.parse(playlist.elements);
        this.props.refreshSinglePlaylist(playlist);
    }

    onPLaylistIdCreated(playlist){
        playlist = JSON.parse(playlist);
        this.props.loadNewPlaylist(playlist, this.props.showNewPlaylist);
    }

    render(){
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDataDownloader);