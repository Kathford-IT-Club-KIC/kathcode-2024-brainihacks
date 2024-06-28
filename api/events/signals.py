from django.db.models.signals import post_save
from django.dispatch import receiver
from events.models import Event
from .models import EventRoom


@receiver(post_save, sender=Event)
def create_event_room(sender, instance, created, **kwargs):
    if created:
        EventRoom.objects.create(
            event=instance,
            name=f"Chat for {instance.title}",
            description=f"Discussion room for {instance.title}",
            created_by=instance.event_manager.user,
        )
