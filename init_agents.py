import json
from firebase_admin import credentials, initialize_app, firestore
import datetime

# O arquivo de credenciais lido anteriormente:
# projectId: gen-lang-client-0045564781
# firestoreDatabaseId: ai-studio-78b225d5-4514-46f3-b9fd-9808166b556e

# NOTA: Como não temos o arquivo JSON completo para inicializar o app,
# este script é puramente conceitual. Se for executado, ele falhará
# a menos que o ambiente tenha credenciais de serviço do Google Cloud ativas.

# --- AGENTE DE EXEMPLO BASEADO NO TASKS.JSON E FIREBASE BLUEPRINT ---
AGENTS_DATA = [
  {
    "uid": "admin_session_evanildo", # Usando um ID de usuário fixo para simplicidade
    "email": "evanildobarros@gmail.com",
    "displayName": "Evanildo Barros",
    "photoURL": "https://example.com/avatar.jpg",
    "createdAt": datetime.datetime.utcnow().isoformat() + "Z"
  },
  {
    "id": "agent_mary",
    "ownerId": "admin_session_evanildo",
    "name": "Mary",
    "role": "ESG & Dev Coordinator",
    "status": "idle",
    "currentTask": None,
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z"
  },
  {
    "id": "agent_fred",
    "ownerId": "admin_session_evanildo",
    "name": "Fred",
    "role": "Main Agent",
    "status": "idle",
    "currentTask": None,
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z"
  },
  {
    "id": "agent_vitor",
    "ownerId": "admin_session_evanildo",
    "name": "Vitor",
    "role": "Consultor Pedagógico",
    "status": "idle",
    "currentTask": None,
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z"
  },
  {
    "id": "agent_kewin",
    "ownerId": "admin_session_evanildo",
    "name": "Kewin",
    "role": "Personal Health",
    "status": "idle",
    "currentTask": None,
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z"
  },
  {
    "id": "agent_tamy",
    "ownerId": "admin_session_evanildo",
    "name": "Tamy",
    "role": "Financeira",
    "status": "idle",
    "currentTask": None,
    "updatedAt": datetime.datetime.utcnow().isoformat() + "Z"
  }
]

def initialize_firestore():
    # Este bloco falhará se as credenciais não estiverem configuradas no ambiente.
    # Isso é apenas um placeholder conceitual para o que o front-end faz.
    try:
        # Tenta inicializar com credenciais de ambiente
        # Firebase Admin SDK requer um arquivo de credenciais JSON ou variáveis de ambiente
        # O código real do Firebase JS SDK usa o config JSON lido.
        print("Simulação: Inicializando Firestore...")
        return True
    except Exception as e:
        print(f"ERRO DE INICIALIZAÇÃO: Não foi possível simular a conexão com o Firestore. {e}")
        return False

def populate_firestore_data():
    if initialize_firestore():
        db = firestore.client() # Simulação
        
        # 1. Inserir o Usuário (necessário para o App.tsx)
        user_ref = db.collection('users').document('admin_session_evanildo')
        user_data = AGENTS_DATA[0]
        user_ref.set(user_data, merge=True)
        print(f"Simulação: Usuário 'admin_session_evanildo' populado no /users.")

        # 2. Inserir os Agentes
        for agent in AGENTS_DATA[1:]:
            agent_ref = db.collection('agents').document(agent['id'])
            agent_ref.set(agent, merge=True)
            print(f"Simulação: Agente '{agent['name']}' populado no /agents.")

        print("\n--- Simulação de Injeção de Dados Concluída ---")
        print("Se o login fosse possível, esses dados estariam prontos para o App.tsx ler.")

if __name__ == '__main__':
    populate_firestore_data()
