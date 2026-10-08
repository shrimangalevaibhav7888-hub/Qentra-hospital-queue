import time
import socketio

# Socket.IO Async Server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

@sio.event
async def connect(sid, environ):
    pass

@sio.event
async def disconnect(sid):
    pass

@sio.event
async def join_room(sid, room):
    await sio.enter_room(sid, room)

@sio.event
async def leave_room(sid, room):
    await sio.leave_room(sid, room)

async def broadcast_queue_update(data: dict = None):
    try:
        payload = {"timestamp": int(time.time() * 1000), **(data or {})}
        await sio.emit("queue_updated", payload)
        await sio.emit("public_display_sync", payload, room="public_display")
    except Exception as e:
        print(f"[SocketService Error] broadcast_queue_update: {e}")

async def broadcast_notification(patient_id: str, notif_dict: dict):
    try:
        await sio.emit("notification_received", notif_dict)
        await sio.emit(
            "notification_broadcast",
            {"patientId": patient_id, "notification": notif_dict}
        )
    except Exception as e:
        print(f"[SocketService Error] broadcast_notification: {e}")
