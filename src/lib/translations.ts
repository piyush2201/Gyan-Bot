export const translations = {
  English: {
    title: 'Query Bot',
    chatHistory: 'Chat History',
    newChat: 'New Chat',
    clearHistory: 'Clear History',
    botAtYourService: 'Query Bot at your service',
    startConversation: 'Start a new conversation or upload a document.',
    inputPlaceholder: 'Type your question here...',
    thinking: 'Thinking...',
    attachFile: 'Attach file',
  },
  Spanish: {
    title: 'Query Bot',
    chatHistory: 'Historial de chat',
    newChat: 'Nuevo chat',
    clearHistory: 'Limpiar historial',
    botAtYourService: 'Query Bot a tu servicio',
    startConversation: 'Inicia una nueva conversación o sube un documento.',
    inputPlaceholder: 'Escribe tu pregunta aquí...',
    thinking: 'Pensando...',
    attachFile: 'Adjuntar archivo',
  },
  French: {
    title: 'Query Bot',
    chatHistory: 'Historique des discussions',
    newChat: 'Nouvelle discussion',
    clearHistory: 'Effacer l\'historique',
    botAtYourService: 'Query Bot à votre service',
    startConversation: 'Commencez une nouvelle conversation ou téléchargez un document.',
    inputPlaceholder: 'Tapez votre question ici...',
    thinking: 'Réflexion...',
    attachFile: 'Joindre un fichier',
  },
  German: {
    title: 'Query Bot',
    chatHistory: 'Chatverlauf',
    newChat: 'Neuer Chat',
    clearHistory: 'Verlauf löschen',
    botAtYourService: 'Query Bot zu Ihren Diensten',
    startConversation: 'Starten Sie ein neues Gespräch oder laden Sie ein Dokument hoch.',
    inputPlaceholder: 'Geben Sie hier Ihre Frage ein...',
    thinking: 'Denken...',
    attachFile: 'Datei anhängen',
  },
};

export const languages = Object.keys(translations) as (keyof typeof translations)[];
export type Language = keyof typeof translations;
