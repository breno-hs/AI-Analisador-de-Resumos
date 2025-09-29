export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
  interface Feedback {
    overallScore: number; //máximo 100
    ATS: {
      score: number; //avalie com base na adequação ao ATS
      tips: {
        type: "bom" | "melhorar";
        tip: string; //dê 3-4 dicas
      }[];
    };
    toneAndStyle: {
      score: number; //máximo 100
      tips: {
        type: "bom" | "melhorar";
        tip: string; //faça um "título" curto para a explicação real
        explanation: string; //explique em detalhes aqui
      }[]; //dê 3-4 dicas
    };
    content: {
      score: number; //máximo 100
      tips: {
        type: "bom" | "melhorar";
        tip: string; //faça um "título" curto para a explicação real
        explanation: string; //explique em detalhes aqui
      }[]; //dê 3-4 dicas
    };
    structure: {
      score: number; //máximo 100
      tips: {
        type: "bom" | "melhorar";
        tip: string; //faça um "título" curto para a explicação real
        explanation: string; //explique em detalhes aqui
      }[]; //dê 3-4 dicas
    };
    skills: {
      score: number; //máximo 100
      tips: {
        type: "bom" | "melhorar";
        tip: string; //faça um "título" curto para a explicação real
        explanation: string; //explique em detalhes aqui
      }[]; //dê 3-4 dicas
    };
}`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `Você é um especialista em ATS (Applicant Tracking System) e análise de currículos.
Por favor, analise e avalie este currículo e sugira como melhorá-lo.
A avaliação pode ser baixa se o currículo for ruim.
Seja minucioso e detalhado.
Não tenha receio de apontar quaisquer erros ou áreas para melhoria.
Se houver muito a melhorar, não hesite em dar notas baixas. Isso é para ajudar o user a melhorar seu currículo.
Se disponível, use a descrição da vaga para a vaga à qual o user está se candidatando para dar um feedback mais detalhado.
Se fornecida, leve a descrição da vaga em consideração.
O título da vaga é: ${jobTitle}
A descrição da vaga é: ${jobDescription}
Forneça o feedback usando o seguinte formato: ${AIResponseFormat}
Retorne a análise como um objeto JSON, sem nenhum outro texto e sem os backticks.
Não inclua nenhum outro texto ou comentários.`;
