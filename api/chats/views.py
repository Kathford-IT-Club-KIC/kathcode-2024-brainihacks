from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from .serializers import MessageSerializer, RoomSerializer
from events.models import Event
from tours.models import Tour
import logging
from django.shortcuts import render
import google.generativeai as genai
from PIL import Image
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import os
from rest_framework.parsers import MultiPartParser, FormParser
import tempfile
from .models import Message

GOOGLE_API_KEY = "AIzaSyAVt4tFZrNd86ZMoiDgFqPV7wSSAFN7MgE"
genai.configure(api_key=GOOGLE_API_KEY)
logger = logging.getLogger(__name__)


class GeminiAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        prompt = request.data.get("prompt", "")
        image_file = request.FILES.get("image")

        try:
            # Initialize the Gemini model
            model = genai.GenerativeModel("gemini-pro-vision")

            # Prepare the contents for the API call
            contents = [prompt] if prompt else []

            # Process the image if it exists
            if image_file:
                # Save the uploaded image to a temporary file
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=".png"
                ) as temp_image:
                    for chunk in image_file.chunks():
                        temp_image.write(chunk)
                    temp_image_path = temp_image.name

                # Open and add the image to the contents
                image = Image.open(temp_image_path)
                contents.append(image)

            # Generate content using the Gemini API
            response = model.generate_content(contents)

            # Clean up the temporary image file if it was created
            if image_file:
                os.unlink(temp_image_path)

            # Return the generated text
            return Response({"text": response.text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(sender=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


def chat_page(request, *args, **kwargs):
    return render(request, "index.html")


from .models import Room


class ChatRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        rooms = Room.objects.filter(
            participants=user
        )  # Assuming you have a 'members' ManyToManyField in Room model
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatRoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "id"


def chat_room(request, room_id):
    room = Room.objects.get(id=room_id)
    return render(
        request,
        "chat/room.html",
        {"room": room, "ws_url": f"ws://{request.get_host()}/ws/chat/{room_id}/"},
    )


class RoomMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Adjust as needed

    def get(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        messages = Message.objects.filter(room=room).order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
