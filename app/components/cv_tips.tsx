'use client';

export function CVTips() {
  const tips = [
    {
      title: "Usa um formato simples (sem gráficos nem tabelas)",
      description: "Os sistemas ATS têm dificuldade em ler elementos visuais. Utiliza apenas texto com uma estrutura clara."
    },
    {
      title: "Utiliza palavras-chave exatas do anúncio",
      description: "Copia os termos usados no anúncio da oferta (tecnologias, funções, competências). O ATS procura correspondências exatas."
    },
    {
      title: "Evita cabeçalhos personalizados",
      description: "Utiliza termos comuns como 'Experiência Profissional', 'Educação', 'Competências'."
    },
    {
      title: "Guarda o currículo em formato .docx ou .pdf (simples)",
      description: "Alguns ATS têm problemas com PDFs mal formatados ou versões antigas do Word."
    },
    {
      title: "Não uses siglas sem escrever também o significado",
      description: "Exemplo: escreve 'JavaScript (JS)' ou 'Base de Dados (BD)' para garantir que é reconhecido."
    },
    {
      title: "Coloca as informações por ordem cronológica inversa",
      description: "Começa pela experiência mais recente, pois é isso que o ATS e o recrutador querem ver."
    },
    {
      title: "Inclui títulos de cargos comuns",
      description: "Utiliza nomes genéricos como 'Desenvolvedor Backend', 'Analista de Sistemas', etc., mesmo que o nome oficial da função fosse diferente."
    },
    {
      title: "Evita erros ortográficos",
      description: "O ATS pode não reconhecer palavras mal escritas, o que pode levar à exclusão do currículo."
    },
    {
      title: "Inclui uma secção de competências técnicas",
      description: "Lista as tecnologias, linguagens e ferramentas que utilizaste (ex: Java, Git, SQL, Docker)."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Dicas para um Currículo que Passe em Sistemas ATS</h2>
          <p className="text-xs sm:text-sm text-gray-600">Siga estas recomendações para aumentar as suas hipóteses de ser selecionado</p>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white rounded-lg p-3 sm:p-4 border border-blue-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
              <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm sm:text-base">{tip.title}</span>
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm ml-7 sm:ml-8">{tip.description}</p>
          </div>
        ))}
        <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-xs sm:text-sm text-blue-800 font-medium">Dica Extra</p>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                O currículo gerado por esta aplicação já segue estas boas práticas, 
                mas certifique-se de personalizar o conteúdo de acordo com cada oferta específica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 