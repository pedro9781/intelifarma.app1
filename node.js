const express = require('express');
const cors = require('cors');
// Carrega as variáveis de ambiente (PORT e GOOGLE_API_KEY) do .env
require('dotenv').config(); 
const { GoogleGenAI } = require('@google/genai');
const app = express();
// O PORT é lido do arquivo .env (PORT=3000)
const PORT = process.env.PORT || 3000;

// Habilita CORS e processamento de JSON
app.use(cors());
app.use(express.json());

// Inicializa a API Gemini usando a chave lida do .env
const genai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY, 
});

// Define a persona do chatbot
const SYSTEM_INSTRUCTION = "Você é o Doutor Bem Mex, um assistente virtual de enfermagem. Suas respostas devem ser informativas, diretas e focadas em saúde, enfermagem e cuidados básicos, com um tom profissional e acolhedor. Responda à pergunta do usuário.";

// Endpoint para o chat, disponível em http://localhost:3000/chat
app.post('/chat', async (req, res) => {
    // Espera a mensagem do frontend no campo 'message'
    const userMessage = req.body.message; 
    
    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem de usuário não fornecida.' });
    }

    try {
        const response = await genai.models.generateContent({
            model: 'gemini-2.5-flash', 
            config: {
                systemInstruction: SYSTEM_INSTRUCTION 
            },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }]
        });
        
        // Retorna a resposta da IA no campo 'reply'
        res.json({ reply: response.text }); 

    } catch (error) {
        console.error('Erro na comunicação com a API Gemini:', error);
        res.status(500).json({ error: 'Falha na comunicação com a API Gemini. Verifique se a GOOGLE_API_KEY no arquivo .env é válida.' });
    }
});

app.listen(PORT, () => {
    console.log("-----------------------------------------------------------------");
    console.log("BEM-VINDO AO SERVIDOR DE BACK-END GEMINI!");
    console.log("-----------------------------------------------------------------");
    console.log(`Servidor de Back-end Gemini rodando em http://localhost:${PORT}`);
    console.log("-----------------------------------------------------------------");
    console.log("SEU CHATBOT ESTÁ PRONTO PARA RODAR!"); 
});