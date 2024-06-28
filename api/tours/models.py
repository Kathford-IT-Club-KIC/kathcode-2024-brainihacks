from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import Guide, Tourist, CustomUser as User


# Create your models here.
class Tour(models.Model):
    guide = models.ForeignKey(Guide, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    interested_users = models.ManyToManyField(User, related_name="interested_tours")

    def add_interested_user(self, user):
        self.interested_users.add(user)
        self.chat_room.participants.add(user)

    def remove_interested_user(self, user):
        self.interested_users.remove(user)
        self.chat_room.participants.remove(user)

    def __str__(self):
        return self.title


class TouristCompletedTour(models.Model):
    tourist = models.ForeignKey(Tourist, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    guide = models.ForeignKey(Guide, on_delete=models.CASCADE, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tourist} completed {self.tour}"


@receiver(post_save, sender=TouristCompletedTour)
def update_num_tourists_handled(sender, instance, created, **kwargs):
    if created:
        guide = instance.tour.guide
        guide.num_tourists_handled = (
            TouristCompletedTour.objects.filter(tour__guide=guide)
            .distinct("tourist")
            .count()
        )
        guide.save()
