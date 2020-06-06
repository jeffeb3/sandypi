from UIserver import socketio, app, db
from flask import render_template
from UIserver.database import UploadedFiles

def show_message_on_UI(message):
    socketio.emit("message_container", message)

@socketio.on('connect')
def on_connect():
    #app.logger.info("Connected")
    pass


# frontend callbacks

@socketio.on('message')
def handle_message(message):
    app.logger.info("Received message from js")
    res = message['data'].split(":")
    if res[0]=="start":
        app.feederbot.start_drawing(res[1])
    if res[0]=="queue":
        app.feederbot.queue_drawing(res[1])

@socketio.on("request_nav_drawing_status")
def nav_drawing_request():
    if app.feederbot.is_drawing():
        item = db.session.query(UploadedFiles).filter(UploadedFiles.id==app.feederbot.get_code()).one()
        socketio.emit("current_drawing_preview", render_template("drawing_status.html", item=item))

# NCFeeder callbacks

@socketio.on('drawing_ended')
def on_drawing_ended():
    app.logger.info("B> Drawing ended")
    show_message_on_UI("Drawing ended")
    app.feederbot.set_is_drawing(False)

@socketio.on('drawing_started')
def on_drawing_started(code):
    app.logger.info("B> Drawing started")
    show_message_on_UI("Drawing started")
    app.feederbot.set_code(code)

@socketio.on('server_command')
def on_server_command(command):
    app.logger.info("Command received from bot")