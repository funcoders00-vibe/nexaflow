import os
import sys
# Set PYTHONPATH to root of backend
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.repositories.database import Database
from src.repositories.schemas import Lead, LeadScore, AIRecommendation, Analytics
from src.services.leads_ai_service import LeadsAIService
from src.services.qdrant_service import QdrantService
from sqlalchemy.orm import Session

def run_tests():
    print("=== LEADS AI SYSTEM VERIFICATION ===")
    
    # 1. Test Database connection and schemas
    print("\n1. Testing Database Connection & Relational Schema...")
    db = Database()
    if db.test_connection():
        print("[Pass] Successfully connected to PostgreSQL database.")
    else:
        print("[Fail] Failed to connect to database.")
        return

    session = Session(db.engine)
    try:
        total_leads = session.query(Lead).count()
        print(f"[Pass] Database Lead count: {total_leads}")
        
        sample_lead = session.query(Lead).first()
        if sample_lead:
            print(f"[Pass] Sample lead loaded: '{sample_lead.company_name}' in {sample_lead.country} ({sample_lead.industry})")
            
            # Check relationships
            scores = session.query(LeadScore).filter(LeadScore.lead_id == sample_lead.id).first()
            if scores:
                print(f"[Pass] Associated LeadScore loaded successfully (Score: {scores.lead_score})")
            else:
                print("[Warning] No LeadScore found for sample lead.")
                
            recs = session.query(AIRecommendation).filter(AIRecommendation.lead_id == sample_lead.id).all()
            print(f"[Pass] Loaded {len(recs)} AI Recommendations for lead '{sample_lead.company_name}'.")
    except Exception as e:
        print(f"[Fail] Database schema test failed: {e}")
        session.close()
        return

    # 2. Test LeadsAIService Agents
    print("\n2. Testing Multi-Agent AI Service (NVIDIA Llama-3.1-70B API)...")
    ai_service = LeadsAIService()
    print(f"   AI Service configured. Mock mode status: {ai_service.is_mock}")
    
    try:
        # Test Discovery Agent
        print("   Testing Lead Discovery Agent...")
        discovered = ai_service.discover_leads("ecommerce in USA", "USA", "Ecommerce")
        print(f"   [Pass] Discovered {len(discovered)} leads.")
        for d in discovered[:2]:
            print(f"      - Company: {d.get('company_name')} | Stack: {d.get('technology_stack')} | Hiring: {d.get('hiring_status')}")
            
        # Test Outreach Agent
        print("   Testing Outreach Generation Agent (LinkedIn)...")
        if sample_lead:
            lead_dict = {"company_name": sample_lead.company_name, "industry": sample_lead.industry, "country": sample_lead.country, "decision_maker_details": sample_lead.decision_maker_details}
            outreach = ai_service.generate_outreach(lead_dict, "LinkedIn")
            print(f"   [Pass] Outreach generated successfully.")
            print(f"      Subject: {outreach.get('subject')}")
            print(f"      Body: {outreach.get('body')[:120]}...")
    except Exception as e:
        print(f"[Fail] AI Service testing failed: {e}")

    # 3. Test Qdrant Vector DB & Semantic Search
    print("\n3. Testing Qdrant Vector Store & Semantic Matching...")
    qdrant = QdrantService()
    if qdrant.client:
        print("[Pass] Connected to Qdrant Vector Database.")
        
        # Seed vectors if database has leads
        try:
            leads = session.query(Lead).all()
            for l in leads:
                lead_vector_doc = f"Company: {l.company_name}\nIndustry: {l.industry}\nCountry: {l.country}\nPain Points: {l.pain_points}"
                payload = {"company_name": l.company_name, "industry": l.industry, "country": l.country, "id": l.id}
                qdrant.upsert_lead_vector(l.id, lead_vector_doc, payload)
            print(f"[Pass] Upserted {len(leads)} lead vectors to Qdrant successfully.")
            
            # Run semantic query search
            print("   Running semantic query search for: 'healthcare automation'...")
            results = qdrant.search_leads_semantic("healthcare automation", limit=3)
            print(f"   [Pass] Found {len(results)} matches.")
            for r in results:
                print(f"      - Match: {r.get('company_name')} (Score: {r.get('search_score'):.4f})")
        except Exception as e:
            print(f"[Fail] Qdrant data operations failed: {e}")
    else:
        print("[Warning] Qdrant client unavailable. Bypassing vector store search tests.")

    session.close()
    print("\n=== SYSTEM VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    run_tests()
