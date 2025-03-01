import { json, redirect } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { useState } from "react";

// Loader: データ取得
export const loader = async ({ params }) => {
  const patientId = Number(params.patientId);

  const results = await prisma.result.findMany({
    where: { patientId },
    include: { exam: true },
  });

  const stackedExams = await prisma.stackedExam.findMany({
    where: { patientId },
    include: { exam: true },
  });

  const allExams = await prisma.exam.findMany();
  const availableExams = allExams.filter(
    (exam) => !stackedExams.some((se) => se.examId === exam.id)
  );

  return json({ results, patientId, stackedExams, availableExams });
};

// Action: 削除・追加処理
export const action = async ({ request }) => {
  const formData = await request.formData();
  const patientId = Number(formData.get("patientId"));
  const examId = Number(formData.get("examId"));
  const actionType = formData.get("actionType");

  if (!patientId || !examId) {
    return json({ error: "Invalid data" }, { status: 400 });
  }

  if (actionType === "delete") {
    await prisma.stackedExam.deleteMany({
      where: { patientId, examId },
    });
  } else if (actionType === "add") {
    const exists = await prisma.stackedExam.findFirst({
      where: { patientId, examId },
    });

    if (!exists) {
      await prisma.stackedExam.create({
        data: { patientId, examId },
      });
    }
  }

  return redirect(`/doctor/${patientId}`);
};

export default function DoctorPatientPage() {
  const { results, patientId, stackedExams, availableExams } = useLoaderData();
  const fetcher = useFetcher();
  const [localStackedExams, setLocalStackedExams] = useState(stackedExams);
  const [localAvailableExams, setLocalAvailableExams] = useState(availableExams);

  // 検査削除処理
  const deleteStackedExam = (examId) => {
    fetcher.submit(
      { patientId, examId, actionType: "delete" },
      { method: "POST" }
    );
    setLocalStackedExams((prev) => prev.filter((exam) => exam.examId !== examId));
    setLocalAvailableExams((prev) => [...prev, stackedExams.find((se) => se.examId === examId).exam]);
  };

  // 検査追加処理
  const addStackedExam = (examId) => {
    fetcher.submit(
      { patientId, examId, actionType: "add" },
      { method: "POST" }
    );
    setLocalStackedExams((prev) => [...prev, { examId, exam: localAvailableExams.find((e) => e.id === examId) }]);
    setLocalAvailableExams((prev) => prev.filter((exam) => exam.id !== examId));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">検査結果</h1>
      {results.length > 0 ? (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2">検査名</th>
              <th className="p-2">スコア</th>
              <th className="p-2">日付</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-t">
                <td className="p-2">{result.exam.examname}</td>
                <td className="p-2">
                  {Array.from({ length: 10 }).map((_, i) =>
                    result[`item${i}`] !== null ? result[`item${i}`] : "N/A"
                  ).join(", ")}
                </td>
                <td className="p-2">{new Date(result.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">データがありません</p>
      )}

      {/* 予定されている検査一覧 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">予定されている検査</h2>
        {localStackedExams.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-500 text-white">
                <th className="p-2">検査名</th>
                <th className="p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {localStackedExams.map((exam) => (
                <tr key={exam.examId} className="border-t">
                  <td className="p-2">{exam.exam.examname}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteStackedExam(exam.examId)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">予定されている検査がありません</p>
        )}
      </section>

      {/* 検査追加 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">追加できる検査</h2>
        {localAvailableExams.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-2">検査名</th>
                <th className="p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {localAvailableExams.map((exam) => (
                <tr key={exam.id} className="border-t">
                  <td className="p-2">{exam.examname}</td>
                  <td className="p-2">
                    <button
                      onClick={() => addStackedExam(exam.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      追加
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">追加できる検査はありません</p>
        )}
      </section>
    </div>
  );
}
