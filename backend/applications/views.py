from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Application, Interview, Notification
from .serializers import (ApplicationSerializer, ApplicationCreateSerializer,
                           InterviewSerializer, NotificationSerializer)


class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check duplicate
        job_id = request.data.get('job')
        if Application.objects.filter(applicant=request.user, job_id=job_id).exists():
            return Response({'error': 'You have already applied for this job.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            applicant=self.request.user
        ).select_related('job', 'job__employer_profile')


class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__employer=user)
        return Application.objects.filter(applicant=user)


class JobApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(
            job_id=job_id, job__employer=self.request.user
        ).select_related('applicant', 'applicant__seeker_profile')


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    try:
        app = Application.objects.get(pk=pk, job__employer=request.user)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found.'}, status=404)
    new_status = request.data.get('status')
    if new_status not in dict(Application.STATUS_CHOICES):
        return Response({'error': 'Invalid status.'}, status=400)
    app.status = new_status
    app.employer_notes = request.data.get('employer_notes', app.employer_notes)
    app.save()
    # Create notification
    Notification.objects.create(
        user=app.applicant,
        title='Application Status Updated',
        message=f'Your application for "{app.job.title}" has been updated to: {new_status.title()}',
        notification_type='application'
    )
    return Response(ApplicationSerializer(app).data)


# Notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    try:
        notif = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)
    notif.is_read = True
    notif.save()
    return Response({'message': 'Marked as read.'})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read.'})


# Dashboard stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    if user.role == 'employer':
        from jobs.models import Job
        jobs = Job.objects.filter(employer=user)
        apps = Application.objects.filter(job__employer=user)
        return Response({
            'total_jobs': jobs.count(),
            'active_jobs': jobs.filter(status='active').count(),
            'total_applications': apps.count(),
            'shortlisted': apps.filter(status='shortlisted').count(),
            'interviews': apps.filter(status='interview').count(),
            'offers': apps.filter(status='offered').count(),
        })
    else:
        apps = Application.objects.filter(applicant=user)
        return Response({
            'total_applied': apps.count(),
            'under_review': apps.filter(status='reviewing').count(),
            'shortlisted': apps.filter(status='shortlisted').count(),
            'interviews': apps.filter(status='interview').count(),
            'offers': apps.filter(status='offered').count(),
            'rejected': apps.filter(status='rejected').count(),
        })
