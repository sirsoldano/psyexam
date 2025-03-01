import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import fs from "fs/promises";
import path from "path";
import { prisma } from "utils/db.server";
import { useState } from "react";
import { Layout } from "~/components/Layout";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const examId = Number(params.examId);
  const url = new URL(request.url);
  const patientId = Number(url.searchParams.get("patientId"));

  if (isNaN(examId) || isNaN(patientId)) {
    throw new Response("Invalid Exam or Patient ID", { status: 400 });
  }
  const exam = await prisma.exam.findUnique({where: { id : examId }});
  const filePath = path.join(process.cwd(), "exams", `${exam.examname}.json`);
  let examData;
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    examData = JSON.parse(fileContent);
  } catch (error) {
    throw new Response("Exam configuration not found", { status: 404 });
  }

  return json({ examData, examId, patientId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const patientId = Number(formData.get("patientId"));
  const examId = Number(formData.get("examId"));

  if (isNaN(patientId) || isNaN(examId)) {
    return json({ error: "Invalid input" }, { status: 400 });
  }

  const exam = await prisma.exam.findUnique({where: { id : examId }});
  const filePath = path.join(process.cwd(), "exams", `${exam.examname}.json`);
  let examData;
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    examData = JSON.parse(fileContent);
  } catch (error) {
    throw new Response("Exam configuration not found", { status: 404 });
  }

  const totalQuestions = examData.questions.length;
  const resultData: Record<string, number | null | object> = {
    patient: { connect: { id: patientId } }, // patientId の代わりにリレーションを指定
    exam: { connect: { id: examId } },       // examId もリレーションとして接続
  };

  let allAnswered = true;
  for (let i = 0; i < 10; i++) {
    const value = formData.get(`item${i}`);
    if (i < totalQuestions) {
      resultData[`item${i}`] = value !== null ? Number(value) : null;
      if (value === null) {
        allAnswered = false;
      }
    } else {
      resultData[`item${i}`] = null;
    }
  }

  if (!allAnswered) {
    return json({ error: "Please answer all required questions." }, { status: 400 });
  }  

  await prisma.result.create({ data: resultData });
  await prisma.stackedExam.deleteMany({
    where: {
      patientId: patientId,
      examId: examId,
    },
  });
  return redirect(`/patient/${patientId}?success=true`);
};

export default function ExamForm() {
  const { examData, examId, patientId } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const isSubmitting = navigation.state === "submitting";

  const handleSelect = (questionIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [`item${questionIndex}`]: value }));
  };

  const isFormComplete = examData.questions.every((_, index) => answers[`item${index}`] !== undefined);

  return (
    <Layout title={examData.title}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {examData.instruction}
            </p>

            <Form method="post" className="space-y-8">
              <input type="hidden" name="patientId" value={patientId} />
              <input type="hidden" name="examId" value={examId} />

              {examData.questions.map((question: any, index: number) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <label className="block text-gray-900 dark:text-white text-lg mb-4">
                    {index + 1}. {question.text}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {examData.options.map((option: any) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`
                          p-3 rounded-lg text-center transition-all duration-200
                          ${
                            answers[`item${index}`] === option.value
                              ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-lg transform scale-105'
                              : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
                          }
                        `}
                        onClick={() => handleSelect(index, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name={`item${index}`}
                    value={answers[`item${index}`] ?? ""}
                  />
                </div>
              ))}

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
                <button
                  type="submit"
                  className={`
                    w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200
                    ${
                      isFormComplete && !isSubmitting
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                        : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    }
                  `}
                  disabled={!isFormComplete || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      送信中...
                    </span>
                  ) : (
                    "提出する"
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}