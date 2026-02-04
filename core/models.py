from django.db import models

class ConsultationRequest(models.Model):
    full_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=15)  # Handling 10+ digits if needed
    district = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.mobile_number}"

class FAQBase(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.question

class GeneralFAQ(FAQBase):
    class Meta:
        verbose_name = "General FAQ"
        verbose_name_plural = "General FAQs"

class SubsidyFAQ(FAQBase):
    class Meta:
        verbose_name = "Subsidy FAQ"
        verbose_name_plural = "Subsidy FAQs"

class TechnicalFAQ(FAQBase):
    class Meta:
        verbose_name = "Technical FAQ"
        verbose_name_plural = "Technical FAQs"

class InstallationFAQ(FAQBase):
    class Meta:
        verbose_name = "Installation FAQ"
        verbose_name_plural = "Installation FAQs"
