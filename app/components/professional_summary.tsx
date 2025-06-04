'use client';

// Props interface for the ProfessionalSummary component
interface ProfessionalSummaryProps {
  resume: string;
  step: number;
  STEPS: string[];
  onResumeChange: (resume: string) => void;
  onStepChange: (newStep: number) => void;
}

export function ProfessionalSummary({
  resume,
  step,
  STEPS,
  onResumeChange,
  onStepChange
}: ProfessionalSummaryProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <div className="w-full">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span className="text-blue-600">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-6.75A2.25 2.25 0 0017.25 5.25h-10.5A2.25 2.25 0 004.5 7.5v9A2.25 2.25 0 006.75 18.75h10.5A2.25 2.25 0 0019.5 16.5v-2.25' />
            </svg>
          </span>
          Resumo Profissional<span className="text-red-500">*</span>
        </h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg bg-white min-h-[120px]"
          placeholder="Desenvolvedor Fullstack com experiência no desenvolvimento de aplicações web escaláveis, responsivas e centradas no utilizador. Trabalhando com TypeScript, React, Next.js, Node.js, PostgreSQL e Prisma, com forte atenção à performance, usabilidade e qualidade do código..."
          value={resume}
          onChange={e => onResumeChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between w-full">
        <button
          type="button"
          className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-semibold"
          onClick={() => onStepChange(Math.max(1, step - 1))}
        >
          Anterior
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => onStepChange(Math.min(STEPS.length, step + 1))}
        >
          Próximo
        </button>
      </div>
    </form>
  );
} 