from rest_framework import viewsets, permissions
from .models import (
    CustomUser,
    Tourist,
    Guide,
    GuideRating,
    EventManager,
    EventManagerRating,
    AgencyRating,
    Agency,
)
from .serializers import (
    CustomUserSerializer,
    TouristSerializer,
    GuideSerializer,
    GuideRatingSerializer,
    EventManagerSerializer,
    EventManagerRatingSerializer,
    AgencyRatingSerializer,
    AgencySerializer,
)


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TouristViewSet(viewsets.ModelViewSet):
    queryset = Tourist.objects.all()
    serializer_class = TouristSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all()
    serializer_class = GuideSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EventManagerViewSet(viewsets.ModelViewSet):
    queryset = EventManager.objects.all()
    serializer_class = EventManagerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class GuideRatingViewSet(viewsets.ModelViewSet):
    queryset = GuideRating.objects.all()
    serializer_class = GuideRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EventManagerRatingViewSet(viewsets.ModelViewSet):
    queryset = EventManagerRating.objects.all()
    serializer_class = EventManagerRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AgencyRatingViewSet(viewsets.ModelViewSet):
    queryset = AgencyRating.objects.all()
    serializer_class = AgencyRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
