from django.contrib import admin
from .models import Message, TourRoom, EventRoom

# Register your models here.
admin.site.register(Message)
admin.site.register(EventRoom)
admin.site.register(TourRoom)
