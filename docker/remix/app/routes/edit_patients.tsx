import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, Form, Link, useActionData } from "@remix-run/react";
import { prisma } from "../../utils/db.server";
import { Layout } from "~/components/Layout";
import { useState } from "react";

interface Patient {
  id: number;
  initial: string;
  birthdate: string;
  sex: number;
}

type ActionData = {
  error?: string;
};

export const loader = async () => {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" }
  });
  return json({ patients });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const id = Number(formData.get("id"));
    const sex = Number(formData.get("sex"));
    const birthdate = formData.get("birthdate") as string;
    const initial = formData.get("initial") as string;
  
    if (isNaN(id) || !birthdate || !initial) {
      return json({ error: "すべての項目を正しく入力してください。" }, { status: 400 });
    }
    try {
        await prisma.patient.create({
            data: { id, initial, birthdate: new Date(birthdate), sex }
          });
      } catch (error) {
        return json({ error: "このIDは既に使用されています。" }, { status: 400 });
      }
  } else if (intent === "delete") {
    const patientId = Number(formData.get("patientId"));
    if (!isNaN(patientId)) {
      await prisma.patient.delete({ where: { id: patientId } });
    }
  }

  return redirect("/edit_patients");
};

export default function ManagePatients() {
  const { patients } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const handleDelete = (patient: Patient) => {
    setPatientToDelete(patient);
  };

  return (
    <Layout title="患者管理">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* 患者登録フォーム */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              新規患者登録
            </h2>
            <Form method="post" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  患者ID
                </label>
                <input
                  type="number"
                  name="id"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  イニシャル
                </label>
                <input
                  type="text"
                  name="initial"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  生年月日
                </label>
                <input
                  type="date"
                  name="birthdate"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  性別
                </label>
                <select
                  name="sex"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="1">男性</option>
                  <option value="2">女性</option>
                  <option value="3">その他</option>
                </select>
              </div>

              {actionData?.error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {actionData.error}
                </div>
              )}

              <button
                type="submit"
                name="intent"
                value="add"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                登録
              </button>
            </Form>
          </div>

          {/* 患者一覧 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              登録済み患者一覧
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      イニシャル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      生年月日
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {patients.map((patient: Patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {patient.initial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {patient.birthdate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(patient)}
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

      {/* 削除確認モーダル */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              患者データの削除
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ID: {patientToDelete.id}（{patientToDelete.initial}）のデータを削除してもよろしいですか？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                キャンセル
              </button>
              <Form method="post" className="inline">
                <input type="hidden" name="patientId" value={patientToDelete.id} />
                <button
                  type="submit"
                  name="intent"
                  value="delete"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  削除する
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
