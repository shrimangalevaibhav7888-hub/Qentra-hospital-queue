from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Notification

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/my")
def get_my_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).order_by(Notification.created_at.desc()).all()
    unread_count = len([n for n in notifs if not n.is_read])
    return {
        "success": True,
        "notifications": [n.to_dict() for n in notifs],
        "unreadCount": unread_count
    }

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    return {"success": True, "message": "Marked notification as read"}

@router.patch("/read-all")
def mark_all_notifications_read(db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"success": True, "message": "Marked all notifications as read"}
