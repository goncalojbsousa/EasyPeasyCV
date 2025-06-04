'use client';

// Props interface for the TechnicalSkills component
interface TechnicalSkillsProps {
  skills: string;
  step: number;
  STEPS: string[];
  onSkillsChange: (value: string) => void;
  onStepChange: (newStep: number) => void;
}

export function TechnicalSkills({
  skills,
  step,
  STEPS,
  onSkillsChange,
  onStepChange
}: TechnicalSkillsProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <div className="w-full">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span className="text-blue-600">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </span>
          Habilidades Técnicas
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Habilidades</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Ex: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker"
            value={skills}
            onChange={e => onSkillsChange(e.target.value)}
          />
        </div>
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