from django.db import models
from accounts.models import User
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('reviewing', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview Scheduled'),
        ('offered', 'Offer Extended'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='application_resumes/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notice_period = models.CharField(max_length=50, blank=True)
    ai_match_score = models.FloatField(null=True, blank=True)
    employer_notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['applicant', 'job']
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.username} → {self.job.title}"


class Interview(models.Model):
    MODE_CHOICES = [
        ('video', 'Video Call'),
        ('phone', 'Phone'),
        ('onsite', 'On-site'),
    ]
    application = models.ForeignKey(Application, on_delete=models.CASCADE,
                                     related_name='interviews')
    scheduled_at = models.DateTimeField()
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='video')
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview for {self.application}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('application', 'Application Update'),
        ('interview', 'Interview Scheduled'),
        ('offer', 'Job Offer'),
        ('message', 'New Message'),
        ('system', 'System'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.title}"
