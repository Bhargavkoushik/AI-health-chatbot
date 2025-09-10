from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
from app.config import settings



def chatbot(query: str) -> str:
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    knowledge_store = FAISS.load_local(
        "app/Medical_DataBase",
        embeddings,
        allow_dangerous_deserialization=True
    )
    retriever = knowledge_store.as_retriever()

    # ✅ pass API key here
    llm = ChatGroq(model="Gemma2-9b-It", api_key=settings.groq_api_key)

    prompt = hub.pull("rlm/rag-prompt")

    parallel_chain = RunnableParallel({
        "context": retriever,
        "question": RunnablePassthrough()
    })
    chain = parallel_chain | prompt | llm | StrOutputParser()
    response = chain.invoke(query)
    return response
