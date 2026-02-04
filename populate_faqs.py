import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ayush_solar.settings')
django.setup()

from core.models import GeneralFAQ, SubsidyFAQ, TechnicalFAQ, InstallationFAQ

def populate_data():
    # Clear existing data
    GeneralFAQ.objects.all().delete()
    SubsidyFAQ.objects.all().delete()
    TechnicalFAQ.objects.all().delete()
    InstallationFAQ.objects.all().delete()

    # General FAQs
    general_data = [
        {
            "question": "What is PM Surya Ghar Muft Bijli Yojana?",
            "answer": "PM Surya Ghar Muft Bijli Yojana is a government scheme launched by Prime Minister Narendra Modi to provide free electricity to households by promoting rooftop solar installation. Under this scheme, subsidies are provided to reduce the cost of solar panels."
        },
        {
            "question": "How much subsidy can I get?",
            "answer": "The subsidy depends on the capacity of the solar plant. For up to 2kW, you can get ₹30,000 per kW. For additional capacity up to 3kW, the subsidy is ₹18,000 per kW. The maximum subsidy is capped at ₹78,000 for systems of 3kW and above."
        },
        {
            "question": "Who is eligible for this scheme?",
            "answer": "Any Indian household with a suitable roof for solar installation and a valid electricity connection can apply. The applicant must not have availed any previous solar subsidy."
        },
        {
            "question": "How much money can I save?",
            "answer": "On average, a 3kW solar system can save you ₹3,000 to ₹4,000 per month on electricity bills. Over 25 years (the lifespan of solar panels), the savings can amount to lakhs of rupees."
        }
    ]

    for item in general_data:
        GeneralFAQ.objects.create(**item)

    # Subsidy FAQs
    subsidy_data = [
        {
            "question": "When will I receive the subsidy amount?",
            "answer": "The subsidy is usually credited directly to your bank account within 30 days after the successful commissioning of the solar plant and verification by the DISCOM officials."
        },
        {
            "question": "Is the subsidy for commercial buildings too?",
            "answer": "No, PM Surya Ghar Muft Bijli Yojana is primarily for residential households. Commercial and industrial sectors have different schemes and incentives."
        },
        {
            "question": "What documents are required for subsidy?",
            "answer": "You need your electricity bill, Aadhaar card, bank account details, and proof of roof ownership. The vendor (Ayush Solar) will assist you in uploading these documents."
        }
    ]

    for item in subsidy_data:
        SubsidyFAQ.objects.create(**item)

    # Technical FAQs
    technical_data = [
        {
            "question": "How much roof space is required for 3kW?",
            "answer": "Approximately 300 square feet of shadow-free roof area is required for a 3kW solar plant. It should ideally face south for maximum generation."
        },
        {
            "question": "What happens when the power goes out?",
            "answer": "Grid-connected solar systems automatically shut down during a power cut for safety reasons (anti-islanding). If you need power during outages, you need a hybrid system with battery backup."
        },
        {
            "question": "Do solar panels work on cloudy days?",
            "answer": "Yes, they still generate electricity on cloudy days, but the efficiency might be reduced to 20-30% of full capacity. They do not generate power at night."
        }
    ]

    for item in technical_data:
        TechnicalFAQ.objects.create(**item)

    # Installation FAQs
    installation_data = [
        {
            "question": "How long does installation take?",
            "answer": "Once the approvals are in place, the physical installation of the solar plant takes only 1-2 days. The entire process including net metering might take 2-4 weeks."
        },
        {
            "question": "What is the warranty on the system?",
            "answer": "Solar panels typically come with a 25-year performance warranty. Inverters usually have a 5-10 year warranty, and workmanship warranty is provided by the installer."
        },
        {
            "question": "Does it require maintenance?",
            "answer": "Solar systems require very low maintenance. You just need to clean the panels with water every couple of weeks to remove dust and bird droppings for maximum efficiency."
        }
    ]

    for item in installation_data:
        InstallationFAQ.objects.create(**item)

    print("Successfully populated FAQs.")

if __name__ == '__main__':
    populate_data()
