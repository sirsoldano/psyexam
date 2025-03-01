import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, Link } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { useState } from "react";
import { Layout } from "~/components/Layout";

interface Exam {
  id: number;
  examname: string;
  cutoff: number;
}

type LoaderData = {
  exams: Exam[];
};

export const loader = async () => {
  const exams = await prisma.exam.findMany();
  return json<LoaderData>({ exams });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "add") {
    const examName = formData.get("examName");
    const cutoff = Number(formData.get("cutoff"));

    if (!examName || isNaN(cutoff)) {
      return json({ error: "検査名とカットオフ値を正しく入力してください" }, { status: 400 });
    }

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

export default function ExamPage() {
  const { exams } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [examName, setExamName] = useState("");
  const [cutoff, setCutoff] = useState("");
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const addExam = () => {
    if (!examName.trim() || !cutoff) return;

    fetcher.submit(
      { actionType: "add", examName, cutoff },
      { method: "POST" }
    );
    setExamName("");
    setCutoff("");
  };

  const handleDelete = (exam: Exam) => {
    setExamToDelete(exam);
  };

  const confirmDelete = () => {
    if (!examToDelete) return;

    fetcher.submit(
      { actionType: "delete", examId: examToDelete.id },
      { method: "POST" }
    );
    setExamToDelete(null);
  };

  return (
    <Layout title="検査管理">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* 追加フォーム */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              新規検査の追加
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  検査名
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="検査名を入力"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  カットオフ値
                </label>
                <input
                  type="number"
                  value={cutoff}
                  onChange={(e) => setCutoff(e.target.value)}
                  placeholder="カットオフ値を入力"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="col-span-1 flex items-end">
                <button
                  onClick={addExam}
                  disabled={!examName.trim() || !cutoff}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  追加
                </button>
              </div>
            </div>
          </div>

          {/* 検査一覧 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              登録済み検査一覧
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      検査名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      カットオフ値
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {exam.examname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {exam.cutoff}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(exam)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/index_doctor"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              医師用ページへ戻る
            </Link>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {examToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              検査の削除
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              「{examToDelete.examname}」を削除してもよろしいですか？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setExamToDelete(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
