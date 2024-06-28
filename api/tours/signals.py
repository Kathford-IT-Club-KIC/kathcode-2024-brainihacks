from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Tour
from chats.models import TourRoom


@receiver(post_save, sender=Tour)
def create_tour_room(sender, instance, created, **kwargs):
    if created:
        TourRoom.objects.create(
            event=instance,
            name=f"Chat for {instance.title}",
            description=f"Discussion room for {instance.title}",
            created_by=instance.guide.user,
        )
