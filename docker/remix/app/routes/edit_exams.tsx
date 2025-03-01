import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { useState } from "react";

export const loader = async () => {
  const exams = await prisma.exam.findMany();
  return json({ exams });
};

// `action`: Exam の追加・削除を処理
export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "add") {
    const examName = formData.get("examName");
    const cutoff = Number(formData.get("cutoff"));

    await prisma.exam.create({
      data: { examname: examName, cutoff },
    });
  }

  if (actionType === "delete") {
    const examId = Number(formData.get("examId"));

    await prisma.exam.delete({
      where: { id: examId },
    });
  }

  return null;
};

// フロント側
export default function ExamPage() {
  const { exams } = useLoaderData();
  const fetcher = useFetcher();
  const [examName, setExamName] = useState("");
  const [cutoff, setCutoff] = useState("");

  // Exam 追加処理
  const addExam = () => {
    fetcher.submit(
      { actionType: "add", examName, cutoff },
      { method: "POST" }
    );
    setExamName("");
    setCutoff("");
  };

  // Exam 削除処理
  const deleteExam = (examId) => {
    fetcher.submit(
      { actionType: "delete", examId },
      { method: "POST" }
    );
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">検査管理</h1>

      {/* 追加フォーム */}
      <div className="mb-6">
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="検査名"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={cutoff}
          onChange={(e) => setCutoff(e.target.value)}
          placeholder="カットオフ値"
          className="border p-2 mr-2"
        />
        <button
          onClick={addExam}
          className="bg-blue-500 text-white px-4 py-2"
        >
          追加
        </button>
      </div>

      {/* 検査一覧 */}
      <ul className="space-y-2">
        {exams.map((exam) => (
          <li
            key={exam.id}
            className="flex justify-between border-b pb-2"
          >
            <span>{exam.examname} (カットオフ: {exam.cutoff})</span>
            <button
              onClick={() => deleteExam(exam.id)}
              className="bg-red-500 text-white px-3 py-1"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
