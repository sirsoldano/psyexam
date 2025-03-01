import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { Layout } from "~/components/Layout";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const patientId = Number(formData.get("patientId"));

  if (isNaN(patientId)) {
    return json({ error: "無効なIDです" }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return json({ error: "該当する患者IDが見つかりません" }, { status: 404 });
  }
  return redirect(`/doctor/${patientId}`);
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <Layout title="医師用ページ">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* 患者ID検索フォーム */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              患者検索
            </h2>
            <Form method="post" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  患者ID
                </label>
                <input
                  type="number"
                  name="patientId"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="IDを入力"
                />
              </div>
              {actionData?.error && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {actionData.error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                検索
              </button>
            </Form>
          </div>

          {/* 管理メニュー */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              管理メニュー
            </h2>
            <div className="space-y-4">
              <a
                href="/edit_exams"
                className="block w-full text-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                検査項目の管理
              </a>
              <a
                href="/edit_patients"
                className="block w-full text-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                患者データの管理
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}