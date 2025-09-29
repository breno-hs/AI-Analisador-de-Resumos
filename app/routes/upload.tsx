import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Enviando currículo...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) return setStatusText("Erro: Falha ao enviar o arquivo.");

    setStatusText("Convertendo para imagem...");

    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file)
      return setStatusText("Erro: Falha ao converter o PDF em imagem.");

    setStatusText("Fazendo upload da imagem...");

    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Erro: Falha ao enviar a imagem.");
    setStatusText("Preparando os dados...");

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analisando o currículo...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setStatusText("Erro: Falha ao analisar o currículo.");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Análise concluída, redirecionando...");
    console.log(data);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Feedback inteligente para seu emprego dos sonhos</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                className="w-full"
                alt="Loading..."
              />
            </>
          ) : (
            <h2>
              Envie seu currículo para obter um ATS Score e dicas de melhoria
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Nome da Empresa</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Nome da Empresa"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Nome do Cargo</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Nome do Cargo"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Descrição do Cargo</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Descrição do Cargo"
                  id="job-description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload do Currículo</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analisar Currículo
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
