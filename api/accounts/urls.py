from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet,
    TouristViewSet,
    GuideViewSet,
    GuideRatingViewSet,
    EventManagerViewSet,
    EventManagerRatingViewSet,
    AgencyRatingViewSet,
)

router = DefaultRouter()
router.register(r"users", CustomUserViewSet)
router.register(r"tourists", TouristViewSet)
router.register(r"guides", GuideViewSet)
router.register(r"guide_ratings", GuideRatingViewSet)
router.register(r"event_managers", EventManagerViewSet)
router.register(r"event_manager_ratings", EventManagerRatingViewSet)
router.register(r"agency_ratings", AgencyRatingViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
