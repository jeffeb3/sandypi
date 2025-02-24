from queue import Queue
import json
from server.database.playlist_elements import ShuffleElement

class QueueManager():
    def __init__(self, app, socketio):
        self._isdrawing = False
        self._element = None
        self.app = app
        self.socketio = socketio
        self.q = Queue()
    
    def is_drawing(self):
        return self._isdrawing

    def is_queue_empty(self):
        return not self._isdrawing and len(self.q.queue)==0

    def set_is_drawing(self, dr):
        self._isdrawing = dr

    def get_element(self):
        return self._element
    
    def set_element(self, element):
        self.app.logger.info("Code: {}".format(element))
        self._element = element
        self.set_is_drawing(True)

    # stop the current drawing and start the next
    def stop_drawing(self):
        self.app.feeder.stop()

    # add an element to the queue
    def queue_element(self, element, show_toast=True):
        if self.q.empty() and not self.is_drawing():
            self.start_element(element)
            return
        self.app.logger.info("Adding {} to the queue".format(element.drawing_id))
        self.q.put(element)
        if show_toast:
            self.app.semits.show_toast_on_UI("Element added to the queue")
        self.send_queue_status()

    # return the content of the queue as a string
    def queue_str(self):
        return str(self.q.queue)
    
    def get_queue(self):
        return self.q.queue

    # clear the queue
    def clear_queue(self):
        self.q.queue.clear()
    
    def set_new_order(self, elements):
        self.clear_queue()
        for el in elements:
            if el!= 0:
                self.q.put(el)
        self.send_queue_status()
    
    # remove the first element with the given code
    def remove(self, code):
        tmp = Queue()
        is_first = True
        for c in self.q.queue:
            if c == code and is_first:
                is_first = False
            else:
                tmp.put(c)
        self.q = tmp

    # queue length
    def queue_length(self):
        return self.q.qsize()
    
    def update_status(self):
        pass
        # in this method should ask the updated status to the feeder (like if is drawing, queue and if necessary other stuff)

    # start the next drawing of the queue
    # by default will start it only if not already printing something
    # with "force_stop = True" will stop the actual drawing and start the next
    def start_next(self, force_stop=False):
        if(self.is_drawing()):
            if not force_stop:
                return False
        try:
            if self.queue_length() > 0:
                element = self.q.queue.popleft()
                self.start_element(element)
                self.app.logger.info("Starting next element: {}".format(element.type))
                return True
            self._element = None
            return False
        except Exception as e:
            self.app.logger.error("An error occured while starting a new drawing from the queue:\n{}".format(str(e)))
            self.start_next()

    # This method send a "start" command to the bot with the element
    def start_element(self, element):
        element = element.before_start(self.app)
        if not element is None:
            self.app.logger.info("Sending gcode start command")
            self.app.feeder.start_element(element, force_stop = True)
        else: self.start_next()

    def send_queue_status(self):
        elements = list(map(lambda x: str(x), self.q.queue)) if len(self.q.queue) > 0 else []                       # converts elements to json
        res = {
            "current_element": str(self._element),
            "elements": elements
        }
        self.app.semits.emit("queue_status", json.dumps(res))