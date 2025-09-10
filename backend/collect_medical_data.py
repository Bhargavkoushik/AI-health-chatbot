import requests
import json
import os
from pathlib import Path
import xml.etree.ElementTree as ET
import time
import re

def collect_medlineplus_data():
    """Collect real medical data from MedlinePlus XML API - Working version"""
    
    # Create directories
    data_dir = Path("app/data/medical_knowledge")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    print("🏥 Collecting medical data from MedlinePlus XML API...")
    
    # Medical topics to collect
    medical_topics = [
        "diabetes", "asthma", "hypertension", "heart disease", 
        "depression", "anxiety", "pneumonia", "stroke",
        "arthritis", "migraine", "allergies", "bronchitis"
    ]
    
    all_medical_data = []
    successful_topics = 0
    
    for topic in medical_topics:
        try:
            # Use the correct MedlinePlus XML API URL
            url = f"https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term={topic}"
            
            print(f"📥 Fetching data for: {topic}")
            
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            
            # Parse XML response
            medical_entries = parse_medlineplus_xml(response.text, topic)
            
            if medical_entries:
                all_medical_data.extend(medical_entries)
                successful_topics += 1
                print(f"✅ Successfully collected {len(medical_entries)} entries for {topic}")
            else:
                print(f"⚠️ No data found for {topic}")
            
            # Be respectful to the API - small delay
            time.sleep(1)
            
        except Exception as e:
            print(f"⚠️ Failed to collect data for {topic}: {str(e)}")
            continue
    
    # Add comprehensive manual data as backup
    manual_data = get_comprehensive_medical_data()
    all_medical_data.extend(manual_data)
    
    print(f"📊 Total collected: {len(all_medical_data)} medical entries")
    print(f"📡 API Success: {successful_topics}/{len(medical_topics)} topics")
    
    # Save structured data
    output_file = data_dir / "medlineplus_structured.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_medical_data, f, indent=2, ensure_ascii=False)
    
    # Create text version for RAG ingestion
    create_text_version(all_medical_data, data_dir)
    
    print(f"💾 Saved to: {output_file}")
    return len(all_medical_data) > 0

def parse_medlineplus_xml(xml_content, topic):
    """Parse MedlinePlus XML response and extract medical information"""
    
    medical_entries = []
    
    try:
        root = ET.fromstring(xml_content)
        
        # Find all document elements
        documents = root.findall('.//document')
        
        for doc in documents:
            # Extract URL
            url = doc.get('url', '')
            
            # Extract content fields
            title = ""
            full_summary = ""
            alt_title = ""
            
            for content in doc.findall('content'):
                name = content.get('name', '')
                
                if name == 'title':
                    title = clean_xml_text(content)
                elif name == 'FullSummary':
                    full_summary = clean_xml_text(content)
                elif name == 'altTitle':
                    alt_title = clean_xml_text(content)
            
            # Create medical entry if we have substantial content
            if full_summary and len(full_summary) > 100:
                medical_entry = {
                    "condition": title or topic.title(),
                    "content": full_summary,
                    "alternative_names": alt_title,
                    "source": "MedlinePlus API",
                    "source_url": url,
                    "category": "health_topic",
                    "search_term": topic
                }
                
                medical_entries.append(medical_entry)
    
    except ET.ParseError as e:
        print(f"XML parsing error for {topic}: {e}")
    except Exception as e:
        print(f"Error processing {topic}: {e}")
    
    return medical_entries

def clean_xml_text(element):
    """Clean XML text content, removing HTML tags and extra whitespace"""
    
    # Get all text content from element and subelements
    text_parts = []
    
    def extract_text(elem):
        if elem.text:
            text_parts.append(elem.text)
        for child in elem:
            extract_text(child)
            if child.tail:
                text_parts.append(child.tail)
    
    extract_text(element)
    full_text = ''.join(text_parts)
    
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', full_text)
    
    # Remove span highlights
    clean_text = re.sub(r'<span class="qt\d+">(.*?)</span>', r'\1', clean_text)
    
    # Clean up whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text)
    clean_text = clean_text.strip()
    
    return clean_text

def get_comprehensive_medical_data():
    """Comprehensive manual medical data as reliable backup"""
    return [
        {
            "condition": "Type 2 Diabetes",
            "content": """Type 2 diabetes is a chronic condition that affects how your body processes blood sugar (glucose). In type 2 diabetes, your body either resists the effects of insulin or doesn't produce enough insulin to maintain normal glucose levels.

SYMPTOMS:
- Increased thirst and frequent urination
- Increased hunger and unintended weight loss  
- Fatigue and blurred vision
- Slow-healing sores and frequent infections
- Areas of darkened skin, usually in armpits and neck

CAUSES AND RISK FACTORS:
- Insulin resistance and genetic factors
- Being overweight or obese
- Physical inactivity and poor diet
- Age 45 or older, family history of diabetes
- High blood pressure and abnormal cholesterol
- History of gestational diabetes or PCOS

TREATMENT:
- Lifestyle modifications: healthy eating and regular exercise
- Blood glucose monitoring and diabetes self-management education
- Medications: Metformin, insulin, other diabetes medications
- Regular medical checkups and preventive care
- Management of blood pressure and cholesterol

PREVENTION:
- Maintain a healthy weight through balanced diet and exercise
- Choose whole grains, fruits, and vegetables
- Limit processed foods and sugary beverages  
- Stay physically active (at least 150 minutes per week)
- Get regular health screenings

WHEN TO SEE A DOCTOR:
- If you experience symptoms of diabetes
- For regular screening if you have risk factors
- If blood sugar levels remain consistently high
- For ongoing diabetes management and complication prevention

COMPLICATIONS:
- Cardiovascular disease (heart attack, stroke)
- Kidney damage (diabetic nephropathy)
- Eye damage (diabetic retinopathy)
- Nerve damage (diabetic neuropathy)
- Foot problems and skin conditions""",
            "source": "Medical Knowledge Base",
            "category": "endocrine_disorders"
        },
        
        {
            "condition": "Hypertension (High Blood Pressure)",
            "content": """High blood pressure (hypertension) is a common condition in which the force of blood against artery walls is consistently too high. It's called the "silent killer" because it often has no warning signs or symptoms.

BLOOD PRESSURE CATEGORIES:
- Normal: Less than 120/80 mmHg
- Elevated: Systolic 120-129 and diastolic less than 80
- Stage 1: Systolic 130-139 or diastolic 80-89
- Stage 2: Systolic 140/90 or higher
- Hypertensive Crisis: Higher than 180/120 (seek emergency care)

SYMPTOMS:
- Most people have no symptoms
- Severe hypertension may cause: headaches, shortness of breath, nosebleeds
- Complications may cause: chest pain, vision changes, blood in urine

CAUSES AND RISK FACTORS:
- Primary hypertension: No identifiable cause (most common)
- Secondary hypertension: Caused by underlying conditions
- Risk factors: Age, family history, obesity, sedentary lifestyle
- Diet high in salt and low in potassium
- Smoking, excessive alcohol use, chronic stress
- Sleep apnea, kidney disease, thyroid problems

TREATMENT:
- Lifestyle changes: DASH diet, regular exercise, weight management
- Limit sodium intake to less than 2,300 mg per day
- Medications: ACE inhibitors, ARBs, diuretics, beta-blockers, calcium channel blockers
- Regular blood pressure monitoring
- Management of underlying conditions

PREVENTION:
- Maintain healthy weight (BMI 18.5-24.9)
- Exercise regularly (30 minutes most days)
- Eat a heart-healthy diet rich in fruits and vegetables
- Limit alcohol consumption and don't smoke
- Manage stress through relaxation techniques
- Get adequate sleep (7-8 hours per night)

WHEN TO SEE A DOCTOR:
- For regular blood pressure screenings
- If blood pressure is consistently 130/80 or higher
- For symptoms of very high blood pressure
- To discuss cardiovascular risk factors and prevention strategies""",
            "source": "Medical Knowledge Base",
            "category": "cardiovascular_disorders"
        },
        
        {
            "condition": "Asthma",
            "content": """Asthma is a chronic respiratory condition in which airways become inflamed, narrow, and produce extra mucus, making it difficult to breathe. It can range from a minor nuisance to a life-threatening condition.

SYMPTOMS:
- Shortness of breath, especially during physical activity
- Chest tightness or pain
- Wheezing when exhaling (common in children)
- Trouble sleeping due to shortness of breath, coughing, or wheezing
- Coughing or wheezing attacks worsened by respiratory viruses

TYPES OF ASTHMA:
- Allergic asthma: Triggered by allergens like pollen, dust mites, pet dander
- Non-allergic asthma: Triggered by factors like stress, weather changes, exercise
- Occupational asthma: Caused by workplace irritants
- Exercise-induced bronchoconstriction: Triggered by physical activity

COMMON TRIGGERS:
- Allergens: pollen, dust mites, mold, pet dander
- Respiratory infections and colds
- Cold air and weather changes
- Air pollutants and strong odors
- Certain medications (aspirin, beta-blockers)
- Strong emotions and stress
- Gastroesophageal reflux disease (GERD)

TREATMENT:
- Controller medications: Inhaled corticosteroids, long-acting beta-agonists
- Quick-relief medications: Short-acting beta-agonists (rescue inhalers)
- Allergy medications: antihistamines, allergy shots
- Biologics for severe allergic asthma
- Bronchial thermoplasty for severe cases

PREVENTION AND MANAGEMENT:
- Identify and avoid personal triggers
- Take controller medications as prescribed
- Use proper inhaler technique
- Get vaccinated against flu and pneumonia
- Maintain a healthy weight and exercise regularly
- Have an asthma action plan

WHEN TO SEEK EMERGENCY CARE:
- Severe shortness of breath or wheezing
- Inability to speak in full sentences due to breathlessness
- Blue coloration of lips or face
- Rapid pulse and sweating with breathing difficulty
- Rescue inhaler not providing relief after 15 minutes""",
            "source": "Medical Knowledge Base", 
            "category": "respiratory_disorders"
        }
    ]

def create_text_version(medical_data, data_dir):
    """Create text version optimized for RAG ingestion"""
    
    text_content = []
    
    for entry in medical_data:
        # Format each entry for better RAG chunking
        text_entry = f"""
MEDICAL CONDITION: {entry['condition']}
SOURCE: {entry['source']}
CATEGORY: {entry.get('category', 'general')}

MEDICAL INFORMATION:
{entry['content']}

ALTERNATIVE NAMES: {entry.get('alternative_names', 'None')}
SEARCH TERMS: {entry.get('search_term', 'general')}

---
"""
        text_content.append(text_entry)
    
    # Save comprehensive text file
    text_file = data_dir / "medical_knowledge_comprehensive.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(text_content))
    
    print(f"📄 Created text version: {text_file}")

if __name__ == "__main__":
    success = collect_medlineplus_data()
    if success:
        print("\n🎉 Medical data collection completed successfully!")
        print("\n📁 Files created:")
        print("   ✅ app/data/medical_knowledge/medlineplus_structured.json")
        print("   ✅ app/data/medical_knowledge/medical_knowledge_comprehensive.txt")
        print("\n🚀 Ready for RAG ingestion!")
        print("💡 Next step: Run docker-compose up to start the RAG system")
    else:
        print("❌ Medical data collection failed!")
