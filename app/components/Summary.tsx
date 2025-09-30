import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 49
        ? "text-yellow-600"
        : "text-red-600";
  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <div className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </div>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Score do Currículo</h2>
          <p className="text-sm text-gray-500">
            Esse score é calculado com base nas váriaveis listadas a seguir.
          </p>
        </div>
      </div>
      <Category title="Tom & Estilo" score={feedback.toneAndStyle.score} />
      <Category title="Conteúdo" score={feedback.content.score} />
      <Category title="Estrutura" score={feedback.structure.score} />
      <Category title="Habilidades" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
