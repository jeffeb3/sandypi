from flask import Flask, redirect, url_for
from flask_socketio import SocketIO

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = 'secret!' # TODO put a key here
socketio = SocketIO(app)

import UIserver.preferences.playlists
import UIserver.bot_interface.socketio_callbacks

@app.route('/')
def home():
    return redirect(url_for('/playlists'))

if __name__ == '__main__':
    socketio.run(app)


"""

import os
def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sql-alchemy'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app"""