from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import CustomUserSerializer


class SignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        user = serializer.save()
        return user


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
