from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import EventRoom, TourRoom, Message
from .serializers import EventRoomSerializer, TourRoomSerializer, MessageSerializer
from events.models import Event
from tours.models import Tour
import logging

logger = logging.getLogger(__name__)


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.debug("Request data: %s", request.data)
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(sender=request.user)
            return Response(
                {"status": "Message sent successfully", "message": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        logger.debug("Validation errors: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        event_rooms = EventRoom.objects.filter(participants=request.user)
        serializer = EventRoomSerializer(event_rooms, many=True)
        return Response(serializer.data)


class TourRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        tour_rooms = TourRoom.objects.filter(participants=request.user)
        serializer = TourRoomSerializer(tour_rooms, many=True)
        return Response(serializer.data)


class EventRoomAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id, *args, **kwargs):
        event_room = get_object_or_404(EventRoom, id=room_id)
        if request.user in event_room.participants.all():
            serializer = EventRoomSerializer(event_room)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "Access Denied"}, status=status.HTTP_403_FORBIDDEN
            )


class TourRoomAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id, *args, **kwargs):
        tour_room = get_object_or_404(TourRoom, id=room_id)
        if request.user in tour_room.participants.all():
            serializer = TourRoomSerializer(tour_room)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "Access Denied"}, status=status.HTTP_403_FORBIDDEN
            )


class ExpressEventInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        event.add_interested_user(request.user)
        return Response(
            {"status": "Successfully expressed interest in the event"},
            status=status.HTTP_200_OK,
        )


class ExpressTourInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tour_id):
        tour = get_object_or_404(Tour, id=tour_id)
        tour.add_interested_user(request.user)
        return Response(
            {"status": "Successfully expressed interest in the tour"},
            status=status.HTTP_200_OK,
        )
